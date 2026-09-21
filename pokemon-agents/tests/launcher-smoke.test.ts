import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const startPath = resolve(repoRoot, "scripts/start-agent-os.ps1");
const statusPath = resolve(repoRoot, "scripts/status-agent-os.ps1");
const startSource = readFileSync(startPath, "utf8");
const statusSource = readFileSync(statusPath, "utf8");

function parsePowerShell(path: string): void {
  const shell = Bun.which("powershell.exe") ?? Bun.which("pwsh");
  expect(shell).not.toBeNull();
  const literalPath = path.replaceAll("'", "''");
  const command = [
    "$tokens = $null",
    "$errors = $null",
    `[System.Management.Automation.Language.Parser]::ParseFile('${literalPath}', [ref]$tokens, [ref]$errors) > $null`,
    "if ($errors.Count -gt 0) { $errors | ForEach-Object { [Console]::Error.WriteLine($_.Message) }; exit 1 }",
  ].join("; ");
  const parsed = Bun.spawnSync([shell!, "-NoProfile", "-NonInteractive", "-Command", command]);
  expect(new TextDecoder().decode(parsed.stderr)).toBe("");
  expect(parsed.exitCode).toBe(0);
}

describe("Agent OS PowerShell launcher smoke", () => {
  test("both launcher scripts parse without syntax errors", () => {
    parsePowerShell(startPath);
    parsePowerShell(statusPath);
  });

  test("keeps canonical ports and rejects duplicate listeners", () => {
    expect(startSource).toMatch(/\[int\]\$BridgePort\s*=\s*8000/);
    expect(startSource).toMatch(/\[int\]\$DashboardPort\s*=\s*5733/);
    expect(statusSource).toMatch(/\[int\]\$BridgePort\s*=\s*8000/);
    expect(statusSource).toMatch(/\[int\]\$DashboardPort\s*=\s*5733/);
    expect(startSource).toContain("elseif ($bridge.Listening)");
    expect(startSource).toContain("elseif ($dashboard.Listening)");
    expect(startSource).toContain("Local\\IKORABUagent.AgentOS.Launcher");
    expect(statusSource).toContain("-StatusOnly");
  });

  test("contains no literal Bridge API secret", () => {
    expect(startSource).not.toMatch(/AUTOPILOT_BRIDGE_API_KEY\s*=\s*["'][^"'$]+["']/);
    expect(startSource).not.toMatch(/THREADS_BRIDGE_API_KEY\s*=\s*["'][^"'$]+["']/);
    expect(statusSource).not.toContain("API_KEY");
  });

  test("validates or generates and launches only the ignored runtime demo database", () => {
    expect(startSource).toContain('".runtime/db/agents-demo.db"');
    expect(startSource).toContain("ensure-runtime-db.ts");
    expect(startSource).toContain("AGENTS_DB_PATH = $runtimeDbRelative");
    expect(startSource).toContain('POKEMON_AGENTS_SCHEDULER = "off"');
    expect(startSource).not.toContain('AGENTS_DB_PATH = ".claude/db/agents-demo.db"');
  });
});
