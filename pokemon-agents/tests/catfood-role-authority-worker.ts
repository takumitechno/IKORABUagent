import { createInterface } from "node:readline";
import { canonicalJson } from "../web/lib/catfood-harness";
import { CatfoodRoleAuthority, type RoleChannelBinding } from "../web/lib/catfood-role-channel";
import type { ThreadsHttpTransport } from "../web/lib/catfood-threads-http";

const input = createInterface({ input: process.stdin, crlfDelay: Infinity })[Symbol.asyncIterator](), first = await input.next();
if (first.done) process.exit(2);
const command = JSON.parse(first.value) as { path: string; binding: RoleChannelBinding; private_key_pem: string; now_ms: number; request: Parameters<ThreadsHttpTransport>[0] }, authority = new CatfoodRoleAuthority(command.path, command.binding, command.private_key_pem, () => command.now_ms);
process.stdout.write(canonicalJson({ type: "ready" }) + "\n");
await input.next();
try { process.stdout.write(canonicalJson({ type: "result", response: authority.transport(command.request) }) + "\n"); }
catch (error) { process.stdout.write(canonicalJson({ type: "error", code: error instanceof Error ? error.message : String(error) }) + "\n"); }
finally { authority.close(); }
