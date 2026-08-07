# Prototype 003.2 — host-safe resumable Penpot synchronization

This revision addresses the real Penpot host crash captured on 2026-08-07:

- Penpot Cloud `2.17.1-RC5`;
- React production error `#185` (`Maximum update depth exceeded`);
- the trace showed repeated page navigation, position/dimension updates, comment-frame movement and plugin-data writes in one update chain.

## Root cause addressed

Prototype 003.1 opened a Penpot page for every board and performed upload, board creation, reparenting, position, resize and metadata mutations interleaved in one long loop. The host crash bypassed plugin-level error handling because the Penpot workspace itself failed.

003.2 changes the mutation model:

1. all media are uploaded first without page navigation or board creation;
2. elements are grouped by target Penpot page;
3. each page is opened at most once per phase;
4. redundant `page.root.appendChild(board)` is removed;
5. board/child mutations are grouped into Penpot undo blocks;
6. only four boards are mutated before an explicit settle barrier;
7. newly created boards are staged directly at their final slot, avoiding a second move/resize pass;
8. durable local checkpoints record phase, page, element and index;
9. interrupted `lane=staging` boards from a host crash are detected and removed safely before retry;
10. old boards moved out of current are explicitly marked `lane=trash`, avoiding duplicate-current verification failures.

## Error evidence

The user-supplied Penpot report is preserved in the conversation evidence. It identified React error `#185` and a workspace event burst ending in page navigation and shape/plugin-data updates.

## Source and feedback contracts retained

- canonical source remains the exact Playwright screenshot from the recorded `events-bot-new` SHA;
- source and transport hashes remain separate;
- native Penpot comments stay attached to managed boards;
- changed commented boards are retained as review evidence;
- the comment-to-prompt flow remains deterministic;
- the plugin does not write to GitHub, Supabase or the product database.

## Recovery behavior

On opening the plugin after an interrupted run, the UI shows:

- the last durable phase;
- page and element;
- index/total;
- the number of interrupted staging boards.

The next sync removes only managed `lane=staging` boards before applying the current Git catalog. Foreign boards and technical-test boards are not deleted.
