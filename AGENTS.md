# Task ownership boundary

This repository owns only the `IKORABU-Operator-UI` Windows task.

- UI/dashboard maintenance must use `scripts/restart-operator-ui-task.ps1`.
- Never disable, delete, register, replace, or rewrite a Threads publication task.
- Never enumerate Windows tasks and mutate matches discovered by name or wildcard.
- `Threads-NightBatch-*` and tasks whose metadata owner is
  `threads.finite-publication` belong to the Threads publication control plane.
- A publication task may be changed only through that control plane's canonical
  finite-task manager after its DB-bound safety checks pass.

