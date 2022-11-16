import { LogLevels, Scribe } from "./index.js";

const scribe = new Scribe({ level: LogLevels.All, pretty: true });

scribe.error("prefix", "error");
scribe.warn("prefix", "warn");
scribe.info("prefix", "info");
scribe.trace("prefix", "trace");
scribe.inspect("prefix", "inspect");
