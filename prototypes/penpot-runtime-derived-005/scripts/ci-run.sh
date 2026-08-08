#!/usr/bin/env bash
set -euo pipefail

ROOT='prototypes/penpot-runtime-derived-005'
PRODUCT='.source/events-bot-new'
SITE="$PRODUCT/site"
PRODUCT_SHA="$(git -C "$PRODUCT" rev-parse HEAD)"

cleanup() {
  if test -f /tmp/rg005-astro.pid; then
    kill "$(cat /tmp/rg005-astro.pid)" 2>/dev/null || true
  fi
  tail -n 120 /tmp/rg005-astro.log 2>/dev/null || true
}
trap cleanup EXIT

printf '[rg005] exact product source: %s\n' "$PRODUCT_SHA"

pushd "$SITE" >/dev/null
npm ci
npx playwright install --with-deps chromium
PUBLIC_SITE_ORIGIN=http://127.0.0.1:4321 SITE_BASE_PATH=/ npm run build
nohup npx astro preview --host 127.0.0.1 --port 4321 > /tmp/rg005-astro.log 2>&1 &
echo $! > /tmp/rg005-astro.pid
popd >/dev/null

for attempt in $(seq 1 120); do
  if curl --fail --silent --show-error --max-time 5 http://127.0.0.1:4321/ >/dev/null; then
    break
  fi
  if test "$attempt" -eq 120; then
    cat /tmp/rg005-astro.log
    exit 1
  fi
  sleep 2
done

python3 - <<'PY'
from pathlib import Path

path = Path('prototypes/penpot-runtime-derived-005/scripts/build-runtime-catalog.mjs')
text = path.read_text(encoding='utf-8')

# Static pages can contain runtime integrations that keep network activity alive.
old = "await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });"
new = "await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 });\n        await page.waitForLoadState('load', { timeout: 8_000 }).catch(() => {});\n        await page.waitForTimeout(350);"
if old in text:
    text = text.replace(old, new, 1)
elif new not in text:
    raise SystemExit('navigation_patch_anchor_missing')

context_old = "const context = await browser.newContext({\n        viewport:"
context_new = "const context = await browser.newContext({\n        serviceWorkers: 'block',\n        viewport:"
if context_old in text:
    text = text.replace(context_old, context_new, 1)
elif context_new not in text:
    raise SystemExit('context_patch_anchor_missing')

progress_old = "clusterIndex += 1;\n    const representative = cluster.routes[0];"
progress_new = "clusterIndex += 1;\n    console.log(`[runtime-derived] cluster ${clusterIndex}/${clusters.length}: ${cluster.routes[0]?.route} (${cluster.routes.length} routes)`);\n    const representative = cluster.routes[0];"
if progress_old in text:
    text = text.replace(progress_old, progress_new, 1)
elif progress_new not in text:
    raise SystemExit('progress_patch_anchor_missing')

# Page archetypes must not fragment merely because content-specific IDs, labels,
# URLs, inline values or slugs differ. Class names and element hierarchy remain,
# so actual layout/state differences still form separate archetypes.
start = text.find('function structuralMarkup(html) {')
end_marker = '\n}\n\nconst htmlFiles'
end = text.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit('structural_markup_anchor_missing')
replacement = r'''function structuralMarkup(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/iu)?.[1] || html;
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, '')
    .replace(/<!--([\s\S]*?)-->/gu, '')
    .replace(/\b(?!class\b)([a-zA-Z_:][\w:.-]*)=(?:"[^"]*"|'[^']*')/gu, '$1="*"')
    .replace(/>[^<]+</gu, '><')
    .replace(/\s+/gu, ' ')
    .trim();
}'''
text = text[:start] + replacement + text[end + 2:]
path.write_text(text, encoding='utf-8')
PY

node --check "$ROOT/scripts/build-runtime-catalog.mjs"
rm -rf "$ROOT/catalog"
node "$ROOT/scripts/build-runtime-catalog.mjs" \
  --repo-dir "$PRODUCT" \
  --site-dir "$SITE" \
  --dist "$SITE/dist" \
  --base-url http://127.0.0.1:4321 \
  --source-sha "$PRODUCT_SHA" \
  --max-clusters 1000 \
  --max-candidates-per-page 600 \
  --max-tree-nodes 180 \
  --out "$ROOT/catalog"

node - "$ROOT/catalog/catalog.json" "$PRODUCT_SHA" <<'NODE'
const fs = require('node:fs');
const [catalogPath, expectedSha] = process.argv.slice(2);
const c = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
assert(c.delivery === 'penpot-runtime-derived-005', 'delivery');
assert(c.source?.revision === expectedSha, `source_sha:${c.source?.revision}:${expectedSha}`);
assert(c.source?.mode === 'latest-main-built-runtime', 'source_mode');
assert(c.source?.productionFreshnessClaimed === false, 'production_claim_without_receipt');
assert(c.contract?.oldDesignSystemUsedAsSource === false, 'old_design_system_forbidden');
assert(c.contract?.manualComponentAllowlistUsed === false, 'manual_allowlist_forbidden');
assert(c.contract?.sourceOfInventory?.includes('built HTML'), 'runtime_inventory_source');
assert(c.counts?.generatedRoutes > 0, 'generated_routes');
assert(c.counts?.structuralClusters > 0, 'structural_clusters');
assert(c.pages?.length === c.counts.structuralClusters, 'cluster_count');
assert(c.pages.every((page) => page.viewports?.length === 4), 'four_viewports_per_archetype');
assert(c.counts?.failures === 0 && c.failures?.length === 0, 'capture_failures');
assert(c.counts?.runtimeComponents >= 30, `runtime_components:${c.counts?.runtimeComponents}`);
assert(c.counts?.runtimePatterns >= 5, `runtime_patterns:${c.counts?.runtimePatterns}`);
assert(c.counts?.importedAstroComponents >= 20, `imported_astro:${c.counts?.importedAstroComponents}`);
const kinds = new Set(c.components.map((item) => item.kind));
for (const kind of ['header', 'footer', 'navigation', 'button']) assert(kinds.has(kind), `missing_kind:${kind}`);
const assets = c.assets.map((item) => `${item.src} ${item.alt}`).join('\n').toLowerCase();
assert(/pwa|favicon|logo|wordmark|lockup|brand/.test(assets), 'brand_assets_not_observed');
assert(kinds.has('medallion') || /medallion|token/.test(assets), 'medallions_not_observed');
assert(c.pages.some((page) => page.representativeRoute === '/'), 'home_archetype');
assert(c.pages.some((page) => page.routes.some((route) => route.startsWith('/sobytiya/'))), 'event_archetype');
console.log(JSON.stringify({ ok: true, source: expectedSha, counts: c.counts, kinds: [...kinds].sort() }, null, 2));
NODE

git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git add "$ROOT/scripts/build-runtime-catalog.mjs" "$ROOT/catalog"
git diff --cached --quiet || git commit -m 'runtime-derived 005: capture newest built pages and components'
CATALOG_COMMIT="$(git rev-parse HEAD)"
CATALOG_SHA="$(node -e "const c=require('./$ROOT/catalog/catalog.json');process.stdout.write(c.catalogSha256)")"

sed \
  -e "s/__UI_COMMIT__/$CATALOG_COMMIT/g" \
  -e "s/__CATALOG_COMMIT__/$CATALOG_COMMIT/g" \
  -e "s/__CATALOG_SHA__/$CATALOG_SHA/g" \
  "$ROOT/src/plugin.js.template" > "$ROOT/dist/plugin.js"
node --check "$ROOT/dist/plugin.js"
python3 - <<'PY'
from pathlib import Path
html = Path('prototypes/penpot-runtime-derived-005/dist/ui.html').read_text(encoding='utf-8')
Path('/tmp/rg005-ui.js').write_text(html.split('<script>',1)[1].split('</script>',1)[0], encoding='utf-8')
PY
node --check /tmp/rg005-ui.js
python3 -m json.tool "$ROOT/dist/manifest.json" >/dev/null

node - "$ROOT" <<'NODE'
const fs = require('node:fs'); const path = require('node:path'); const root = process.argv[2];
const p = fs.readFileSync(path.join(root,'dist/plugin.js'),'utf8');
const u = fs.readFileSync(path.join(root,'dist/ui.html'),'utf8');
const m = JSON.parse(fs.readFileSync(path.join(root,'dist/manifest.json'),'utf8'));
const c = JSON.parse(fs.readFileSync(path.join(root,'catalog/catalog.json'),'utf8'));
const a=(v,x)=>{if(!v)throw new Error(x)};
for(const x of ['renderLayoutTree','reconcileComponents','component.instance()','reconcilePatterns','reconcileArchetypes','reconcileEvidence','reconcileBrandAssets','reconcileIcons','cleanupLegacyPages',"mode === 'selected'","mode === 'full'","message.type === 'update'",'old_design_system_source_forbidden','manual_allowlist_forbidden']) a(p.includes(x),`plugin:${x}`);
for(const x of ['Быстро: только изменившееся','Выбранное + зависимости','Полная пересборка и очистка']) a(u.includes(x),`ui:${x}`);
a(m.version===2,'manifest'); for(const x of ['content:read','content:write','library:write','comment:read']) a(m.permissions.includes(x),`permission:${x}`);
a(c.contract.oldDesignSystemUsedAsSource===false,'old_ds'); a(c.contract.manualComponentAllowlistUsed===false,'allowlist');
NODE

mkdir -p penpot/candidate
cp "$ROOT/dist/manifest.json" penpot/candidate/manifest.json
cp "$ROOT/dist/plugin.js" penpot/candidate/plugin.js
cp "$ROOT/dist/icon.svg" penpot/candidate/icon.svg
cat > penpot/candidate/README.md <<'EOF2'
# Penpot candidate channel

Current candidate: Runtime-Derived Design System 005.
Source: exact newest built events-bot-new pages. `/lab/design-system` and manual component allowlists are not inventory sources.
EOF2

git add "$ROOT/dist/plugin.js" penpot/candidate
git diff --cached --quiet || git commit -m 'runtime-derived 005: publish plugin and candidate channel'
FINAL_SHA="$(git rev-parse HEAD)"
git push origin HEAD:prototype/runtime-derived-005-latest-pages
git push --force origin HEAD:runtime-derived-005-live

WORK="$RUNNER_TEMP/rg005-public"
mkdir -p "$WORK"
fetch_public(){ for attempt in $(seq 1 15); do curl --fail --silent --show-error --location --connect-timeout 10 --max-time 120 -D "$3" -o "$2" "$1" && return 0; sleep 5; done; return 1; }
assert_cors(){ tr -d '\r' < "$1" | grep -Eiq '^access-control-allow-origin:[[:space:]]*\*$'; }
CDN="https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@${FINAL_SHA}/${ROOT}/dist"
fetch_public "$CDN/manifest.json" "$WORK/manifest.json" "$WORK/manifest.headers"
fetch_public "$CDN/plugin.js" "$WORK/plugin.js" "$WORK/plugin.headers"
fetch_public "$CDN/icon.svg" "$WORK/icon.svg" "$WORK/icon.headers"
fetch_public "https://raw.githack.com/onedayonemasterpiece/lovekgd-design-system/${CATALOG_COMMIT}/${ROOT}/dist/ui.html" "$WORK/ui.html" "$WORK/ui.headers"
fetch_public "https://raw.githack.com/onedayonemasterpiece/lovekgd-design-system/${CATALOG_COMMIT}/${ROOT}/catalog/catalog.json" "$WORK/catalog.json" "$WORK/catalog.headers"
SAMPLE="$(node -e 'const c=require(process.argv[1]);process.stdout.write(c.pages[0].viewports[0].screenshot)' "$WORK/catalog.json")"
fetch_public "https://raw.githack.com/onedayonemasterpiece/lovekgd-design-system/${CATALOG_COMMIT}/${ROOT}/catalog/${SAMPLE}" "$WORK/sample.png" "$WORK/sample.headers"
for file in manifest plugin icon ui catalog sample; do assert_cors "$WORK/$file.headers"; done
node --check "$WORK/plugin.js"

node - "$WORK" "$CATALOG_COMMIT" <<'NODE'
const fs=require('node:fs'),path=require('node:path'); const [w,commit]=process.argv.slice(2);
const m=JSON.parse(fs.readFileSync(path.join(w,'manifest.json'),'utf8')); const p=fs.readFileSync(path.join(w,'plugin.js'),'utf8'); const u=fs.readFileSync(path.join(w,'ui.html'),'utf8'); const c=JSON.parse(fs.readFileSync(path.join(w,'catalog.json'),'utf8')); const a=(v,x)=>{if(!v)throw new Error(x)};
a(m.name.includes('latest pages 005'),'name'); a(p.includes(`const CATALOG_COMMIT = '${commit}'`),'commit'); a(p.includes(`const CATALOG_SHA = '${c.catalogSha256}'`),'hash'); a(u.includes('Старый <code>/lab/design-system</code> источником не является'),'source_truth'); a(c.contract.oldDesignSystemUsedAsSource===false,'old_ds'); a(c.contract.manualComponentAllowlistUsed===false,'allowlist'); a(c.counts.failures===0,'failures');
NODE

if test -n "${GITHUB_STEP_SUMMARY:-}"; then
  {
    echo '### Runtime-Derived Design System 005: PASS'
    echo "- exact source: $PRODUCT_SHA"
    echo "- generated routes: $(node -e 'const c=require(process.argv[1]);process.stdout.write(String(c.counts.generatedRoutes))' "$WORK/catalog.json")"
    echo "- page archetypes: $(node -e 'const c=require(process.argv[1]);process.stdout.write(String(c.counts.structuralClusters))' "$WORK/catalog.json")"
    echo "- runtime components: $(node -e 'const c=require(process.argv[1]);process.stdout.write(String(c.counts.runtimeComponents))' "$WORK/catalog.json")"
    echo "- Astro components imported by actual pages: $(node -e 'const c=require(process.argv[1]);process.stdout.write(String(c.counts.importedAstroComponents))' "$WORK/catalog.json")"
    echo "- runtime patterns: $(node -e 'const c=require(process.argv[1]);process.stdout.write(String(c.counts.runtimePatterns))' "$WORK/catalog.json")"
    echo "- icons: $(node -e 'const c=require(process.argv[1]);process.stdout.write(String(c.counts.icons))' "$WORK/catalog.json")"
    echo "- assets: $(node -e 'const c=require(process.argv[1]);process.stdout.write(String(c.counts.assets))' "$WORK/catalog.json")"
    echo '- old design-system source: false'
    echo '- manual component allowlist: false'
    echo "- immutable manifest: https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@${FINAL_SHA}/${ROOT}/dist/manifest.json"
  } >> "$GITHUB_STEP_SUMMARY"
fi
