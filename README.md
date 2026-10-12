# MakeCareer SEO handoff — latest local files

This branch contains a handoff ZIP, not the application's source tree. Do not use it as a development checkout or merge it into the application.

The user explicitly authorized uploading this ZIP to the public repository on 2026-10-12. This does not authorize publishing the website, enabling indexing, or real outbound links.

- ZIP: `handoff/makecareer-handoff.zip`
- SHA256: `e0204b23d103064550cfd654ad876b2d2287ac4df6157008541722a873bc9f46`
- Original local base HEAD: `d5260a3bea0b566b491b0d7a99d938dcafb43649`
- Local source branch: `codex/makecareer-meeting-corrections`
- The ZIP includes uncommitted and untracked changes beyond that base HEAD.

Read `handoff/HANDOFF_START.md`, verify the ZIP and `manifest.json`, then import its `career-media/` directory into the designated Claude development branch while protecting existing work.

The ZIP has all 112 manuscripts, existing images, latest documentation, and prior verification evidence. Maintain current UI and assets; use `handoff/asset-lock.json` to compare them. Keep noindex, non-production, and real outbound OFF.

## Retrieve without checking out this handoff branch

Fetch `refs/heads/handoff/makecareer-zip` into a separate reference, then use `git show <verified-handoff-commit>:handoff/makecareer-handoff.zip` redirected to a file. Check the ZIP SHA256 before extraction. Read the ZIP in binary mode; do not pass its contents through text conversion.

Prior test logs are evidence from the previous delivery. Re-run relevant checks after new edits. The local source worktree, its index, HEAD, and branch were not changed by preparing this upload.
