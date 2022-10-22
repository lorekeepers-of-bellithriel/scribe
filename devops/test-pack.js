import path from "path";
import { exists, mkdir, run } from "./base.js";

const TEST_PACKS_DIR = "test-packs";

const PACK_FILE = path.join(TEST_PACKS_DIR, "%s-%v.tgz");

const PACK_COMMAND = `yarn pack --out ${PACK_FILE}`;

const ex = await exists(TEST_PACKS_DIR);

if (!ex) await mkdir(TEST_PACKS_DIR);

await run(PACK_COMMAND);
