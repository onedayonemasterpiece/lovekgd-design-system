# Penpot linked renderer integrity: free collection / event.real.8006

1. Open file `3be9e5e1-190f-8090-8008-713c0fbe6260`, page `fb44de8f-cd63-8060-8008-8f839b2fe1df`.
2. Install `scripts/round-trip-reconstruction/penpot-free-collection-renderer-matrix-repro.js` and call `installFreeCollectionRendererRepro(penpot, penpotUtils, storage)`.
3. Call `storage.freeCollectionRendererMatrixRepro.readback()`; both B and C report the exact title and `validate()=[]`.
4. Call `exportCase('B')` and `exportCase('C')`, decode the stored PNG, and compare to each directory's immutable `astro.png` at native 340×661.
5. B proves the stale SHA changes and exact title renders, but still returns a full content-region diff with exact source media bytes and identical cover geometry. C renders the projection-main title but loses feedback counts and uses stale canonical action/media geometry.

No detached copies, page-local EventCard visual roots, screenshots-as-cards, or route-local visual patches are used.
