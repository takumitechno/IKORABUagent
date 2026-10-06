/** src/lib/illustrations/motifs.ts のイラストを CSS（data URI）に書き出す */
import fs from "node:fs";
import path from "node:path";
import { motifsCss } from "../src/lib/illustrations/motifs";

const out = path.resolve(__dirname, "../src/app/motifs.css");
fs.writeFileSync(out, motifsCss());
console.log(`wrote ${path.relative(process.cwd(), out)} (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
