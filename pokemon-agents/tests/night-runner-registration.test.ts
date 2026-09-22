import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const registration = readFileSync(resolve(root, "scripts/register-night-runner.ps1"), "utf8");
const launcher = readFileSync(resolve(root, "scripts/night-runner-launcher.py"), "utf8");

describe("NIGHT04 registration preparation", () => {
  test("is dry-run by default and requires an exact apply confirmation", () => {
    expect(registration).toContain('Mode = "dry-run"');
    expect(registration).toContain('$expectedConfirm = "APPLY:$TaskName"');
    expect(registration).toContain("if ($Inspect -or -not $Apply)");
  });
  test("uses hidden pythonw with IgnoreNew and recovery settings", () => {
    expect(registration).toContain("pythonw.exe");
    expect(registration).toContain("-Hidden -MultipleInstances IgnoreNew");
    expect(registration).toContain("-StartWhenAvailable -WakeToRun");
    expect(launcher).toContain("CREATE_NO_WINDOW");
  });
  test("redirects output to a persistent log without command secrets", () => {
    expect(registration).toContain(".runtime\\logs\\night-runner.log");
    expect(launcher).toContain("stdout=log, stderr=log");
    expect(registration).not.toContain("AUTOPILOT_BRIDGE_API_KEY");
    expect(launcher).not.toContain("access_token");
  });
});
