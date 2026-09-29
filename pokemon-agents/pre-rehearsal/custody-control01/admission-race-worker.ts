import { existsSync, readFileSync } from "node:fs";
import { CustodyController, TestOnlySqliteContinuityWitness } from "./controller";

const [controllerPath, witnessPath, bindingPath, keyPath, candidatePath, gatePath, operationId] = process.argv.slice(2);
if (![controllerPath, witnessPath, bindingPath, keyPath, candidatePath, gatePath, operationId].every(Boolean)) process.exit(2);
while (!existsSync(gatePath!)) await Bun.sleep(2);
const binding = JSON.parse(readFileSync(bindingPath!, "utf8"));
const key = JSON.parse(readFileSync(keyPath!, "utf8"));
const candidate = JSON.parse(readFileSync(candidatePath!, "utf8"));
const witness = new TestOnlySqliteContinuityWitness(witnessPath!);
const controller = new CustodyController(controllerPath!, witness, binding);
try {
  controller.beginCustodianAdmission(key, candidate, Date.now() + 60_000, operationId!);
  process.stdout.write("ADMITTED\n");
} catch (error) {
  process.stdout.write(`BLOCKED:${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
} finally {
  controller.close();
  witness.close();
}
