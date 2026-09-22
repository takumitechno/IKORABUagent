# NIGHT04 hidden runner deployment

`scripts/register-night-runner.ps1` is an idempotent preparation tool. It is a
dry run unless `-Apply` and the exact `-Confirm APPLY:<task-name>` value are
both supplied. `-Inspect` prints expected/current settings without mutation.

The task action uses `pythonw.exe`, a windowless launcher, `Hidden=True`,
`MultipleInstances=IgnoreNew`, `StartWhenAvailable=True`, and `WakeToRun=True`.
It retains the prior battery-safe scheduling behavior: starting and continuing
the runner are allowed while the host is on battery power.
Its trigger repeats every five minutes with no repetition duration and no end
boundary, so future approved NIGHT items do not require task re-registration.
Safe runner output is appended to `.runtime/logs/night-runner.log`; credentials,
tokens, and email are never passed on the command line or written by the
launcher.

Deployment must be performed only after the current NIGHT item is terminal and
no publication is ambiguous. Record the current task action, trigger, settings,
principal, and exported task XML first. `-SnapshotPath` writes that XML before
an apply. Run inspect, review the diff, then apply.

Rollback: stop scheduling new work, restore the exported task XML with the same
task name and principal, inspect again, and verify the prior action/settings.
Do not kill a running instance and do not edit NIGHT batch rows during rollback.
