# Current UI component decoder snapshots

Здесь хранятся только компактные, diffable и проверяемые снимки реконструкции текущего UI.

## Актуальный снимок

- [`decoder-v1-snapshot-20260808T124842-4786ac53bc/`](decoder-v1-snapshot-20260808T124842-4786ac53bc/)
- source: `events-bot-new@ef7aa62e45c60f7a12da6160f490719c0721ec03`
- decoder: `events-bot-new@ad2fb5a9c565b95aa746d7e6031edfe6e901d929`
- Actions run: [`31291052330`](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/31291052330)
- permanent heavy evidence: [GitHub Release](https://github.com/onedayonemasterpiece/events-bot-new/releases/tag/current-ui-decoder-v1-snapshot-20260808T124842-4786ac53bc)
- verdict: `GO_FOR_FAMILY_SCOPED_DEFRAGMENTATION`

Этот verdict разрешает только следующий **аналитический** этап по отдельным семействам. Он не принимает candidate contracts, не объединяет компоненты, не нормализует цвета/типографику, не создаёт токены и не мутирует Penpot или Astro.

Проверка:

```bash
node scripts/validate-component-decoder-snapshot.mjs \
  catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc
```
