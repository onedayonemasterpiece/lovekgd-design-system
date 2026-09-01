import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../..");
const CATALOG = path.join(REPO, "catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c");
export const loadPackage = () => JSON.parse(fs.readFileSync(path.join(CATALOG, "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR.package.v1.json"), "utf8"));
const source = (name) => fs.readFileSync(path.join(CATALOG, name), "utf8");

class Shape {
  constructor(row, tracker, type = "text") {
    this.id = row.id;
    this.name = row.name ?? row.id;
    this.type = type;
    this.x = row.frame?.[0] ?? 0;
    this.y = row.frame?.[1] ?? 0;
    this.width = row.frame?.[2] ?? 10;
    this.height = row.frame?.[3] ?? 10;
    this.textBounds = row.text_bounds ? { x: row.text_bounds[0], y: row.text_bounds[1], width: row.text_bounds[2], height: row.text_bounds[3] } : null;
    this.fontSize = Number(row.font_size ?? 13.12);
    this.lineHeight = Number(row.line_height ?? 1.25);
    this._characters = row.characters ?? "";
    this._growType = row.grow_type ?? "fixed";
    this._plugin = new Map();
    if (row.marker) this._plugin.set("kenigevents-g19-child-marker", row.marker);
    this.children = [];
    this.parent = null;
    this._tracker = tracker;
    this._tracking = false;
    this._settle = true;
    this._pending = false;
  }
  enableTracking() { this._tracking = true; for (const child of this.children) child.enableTracking(); }
  append(child) { child.parent = this; this.children.push(child); return child; }
  get characters() { return this._characters; }
  set characters(value) { this._characters = value; this._pending = true; if (this._tracking) this._tracker.push({ id: this.id, property: "characters" }); }
  get growType() { return this._growType; }
  set growType(value) { this._growType = value; this._pending = true; if (this._tracking) this._tracker.push({ id: this.id, property: "growType" }); }
  getPluginData(key) { return this._plugin.get(key) ?? ""; }
  setPluginData(key, value) { this._plugin.set(key, value); if (this._tracking) this._tracker.push({ id: this.id, property: `plugin:${key}` }); }
  async waitForLayoutUpdate() {
    if (this._pending && this._settle && this._growType === "auto-width") {
      const nextWidth = Math.max(14, this._characters.length * 6.9);
      this.width = nextWidth;
      this.textBounds = { x: this.x + 0.1, y: this.y + 0.3, width: nextWidth - 0.2, height: Math.min(13.4, this.height - 0.4) };
      this._pending = false;
    }
  }
}

const walk = (shape) => [shape, ...shape.children.flatMap(walk)];

export function createHarness({ settle = true, authorized = true } = {}) {
  const pkg = loadPackage();
  const tracker = [];
  const pageRoot = new Shape({ id: "harness-page-root", name: "page-root", frame: [0, 0, 3000, 3000] }, tracker, "root");
  const board = pageRoot.append(new Shape({ id: pkg.penpot_target.accepted_root_id, name: "Free collection accepted root", frame: [0, 0, 2500, 2500] }, tracker, "board"));
  const cards = new Map();
  const cardFrames = {
    "313fb1ed-0d5c-8095-8008-912c45090653": [0, 800, 1500, 190],
    "313fb1ed-0d5c-8095-8008-914c76615924": [0, 500, 1500, 200],
    "313fb1ed-0d5c-8095-8008-916b340de148": [0, 1550, 1500, 230],
    "313fb1ed-0d5c-8095-8008-916bd0ab6c98": [0, 1400, 1500, 200],
  };
  for (const id of pkg.accepted_card_root_ids) {
    cards.set(id, board.append(new Shape({ id, name: `card:${id}`, frame: cardFrames[id] }, tracker, "board")));
  }
  for (let i = 0; i < 14; i += 1) board.append(new Shape({ id: `harness-board-child-${String(i).padStart(2, "0")}`, frame: [0, 0, 10, 10] }, tracker, "board"));

  const addText = (row) => {
    const card = cards.get(row.root_id);
    if (!card) throw new Error(`missing harness card ${row.root_id}`);
    let parent = card;
    if (row.parent_id !== row.root_id) {
      parent = walk(card).find((shape) => shape.id === row.parent_id);
      if (!parent) parent = card.append(new Shape({ id: row.parent_id, name: row.parent_name, frame: [0, 0, 2200, 2200] }, tracker, "board"));
    }
    const shape = parent.append(new Shape(row, tracker));
    shape._settle = settle;
    return shape;
  };
  pkg.targets.forEach(addText);
  pkg.protected_untargeted_offenders.forEach(addText);
  pkg.proof_targets.forEach((proof, index) => {
    const root = cards.get(proof.root_id);
    return addText({
    id: proof.id, root_id: proof.root_id, parent_id: proof.root_id, name: "proof-label", characters: proof.characters,
    grow_type: "auto-width", font_size: "11.52", line_height: "1.2", frame: [20 + index * 100, root.y + 20, 70, 14], text_bounds: [20.1 + index * 100, root.y + 20.3, 60, 13.4],
    marker: `harness:proof:${proof.id}`,
    });
  });
  const cardList = [...cards.values()];
  for (let i = 0; i < 14; i += 1) {
    const root = cardList[i % 4];
    addText({
    id: `harness-contained-text-${String(i).padStart(2, "0")}`, root_id: root.id, parent_id: root.id,
    name: "already-contained", characters: `contained-${i}`, grow_type: "fixed", font_size: "12", line_height: "1.2",
    frame: [40 + i * 10, root.y + 40, 100, 18], text_bounds: [41 + i * 10, root.y + 41, 90, 14], marker: `harness:contained:${i}`,
    });
  }
  while (walk(board).length - 1 < pkg.baseline_census.accepted_root_descendants) {
    board.children[4].append(new Shape({ id: `harness-descendant-${walk(board).length - 1}`, frame: [0, 0, 1, 1] }, tracker, "rect"));
  }
  if (walk(board).length - 1 !== pkg.baseline_census.accepted_root_descendants) throw new Error("harness descendant overrun");

  const components = Array.from({ length: 18 }, (_, index) => ({ id: `harness-component-${String(index).padStart(2, "0")}`, name: `component/${index}` }));
  const shared = new Map();
  shared.set("kenigevents:asp-active-run-v1", JSON.stringify({ schema: "kenigevents.asp-run-control.v1", state: "ACTIVE", writer_id: "/root/publish_r2", run_id: "harness-run" }));
  const executionAuth = { schema_version: "kenigevents.mat-execution-authorization.v1", package_id: pkg.package_id, package_sha256: pkg.package_sha256, stage: "EXECUTE", authorized, qa_exact_bytes_pass: true, integrate_same_tuple_pass: true, authorization_nonce: "harness-nonce", writer_id: "/root/publish_r2", run_id: "harness-run" };
  const readbackAuth = { schema_version: "kenigevents.mat-readback-authorization.v1", package_id: pkg.package_id, package_sha256: pkg.package_sha256, stage: "DISTINCT_LATER_READBACK", authorized: true, execution_terminal_state: "MUTATED_PENDING_DISTINCT_LATER_READBACK", authorization_nonce: "harness-nonce" };
  const penpot = {
    currentFile: { id: pkg.penpot_target.file_id, revn: pkg.penpot_target.expected_revision, validate: () => [], getSharedPluginData: (ns, key) => shared.get(`${ns}:${key}`) ?? "" },
    currentPage: { id: pkg.penpot_target.page_id, root: pageRoot },
    library: { local: { components } },
    history: { undoBlockBegin: () => ({ id: "harness-undo" }), undoBlockFinish: () => {} },
    waitForLayoutUpdate: async () => { for (const shape of walk(board)) if (shape.type === "text") await shape.waitForLayoutUpdate(); },
  };
  board.enableTracking();
  return {
    pkg, tracker, board, cards, components, penpot,
    storage: { matEventcardTextR11cPackage: pkg, matEventcardTextR11cExecutionAuthorization: JSON.stringify(executionAuth), matEventcardTextR11cReadbackAuthorization: JSON.stringify(readbackAuth) },
    text: (id) => walk(board).find((shape) => shape.id === id),
  };
}

export async function runArtifact(name, harness) {
  const context = vm.createContext({ storage: harness.storage, penpot: harness.penpot, console, JSON, Number, Math, Array, Set, Map, Error });
  return await vm.runInContext(`(async()=>{${source(name)}\n})()`, context, { filename: name, timeout: 10000 });
}

export async function runSuccess() {
  const harness = createHarness();
  const execution = await runArtifact("native-repair-executor.v1.js", harness);
  const readback = await runArtifact("distinct-later-readback.v1.js", harness);
  return { harness, execution, readback };
}

if (process.argv.includes("--all")) {
  const { harness, execution, readback } = await runSuccess();
  const writtenIds = [...new Set(harness.tracker.map((row) => row.id))].sort();
  console.log(JSON.stringify({ execution: execution.terminal_state, readback: readback.terminal_state, written_ids: writtenIds, state: harness.pkg.state }));
}
