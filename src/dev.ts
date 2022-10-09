import { LogLevels, Scribe } from "./main.js";

Scribe.configure({ level: LogLevels.All });

Scribe.error("error");
Scribe.warn("warn");
Scribe.info("info");
Scribe.trace("trace");
Scribe.inspect("inspect");
