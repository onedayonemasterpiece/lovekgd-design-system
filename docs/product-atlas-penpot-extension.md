# Product Atlas Penpot delivery — superseded path

> **Status:** superseded on 2026-08-25.  
> **Active contract:** [`product-atlas-penpot-mcp.md`](product-atlas-penpot-mcp.md).

The previous delivery design at this path is no longer an active architecture or operating instruction. Git history preserves the historical experiment and its evidence.

Current flow:

```text
reviewed Product Atlas Git SoT
→ corrected UI foreign-key projection
→ explicit scoped Penpot MCP materialization
→ exact read-back
→ versioned Git receipt
→ owner review
```

No automatic or background synchronization is supported. Product definitions remain in `events-bot-new`; this repository stores only UI context and foreign keys.