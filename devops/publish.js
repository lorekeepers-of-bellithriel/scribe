import { run } from "./base.js";
import "./build.js";

const PUBLISH_COMMAND = "yarn npm publish --access public";

await run(PUBLISH_COMMAND);
