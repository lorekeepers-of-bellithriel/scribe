import { LogLevels, Scribe } from "./main.js";

Scribe.configure({ level: LogLevels.All });

console.log("skata");

// console.time("kappa default-error");
// for (let i = 0; i < 1000; i++) console.error("error");
// console.timeEnd("kappa default-error");

// console.time("kappa default-warn");
// for (let i = 0; i < 1000; i++) console.warn("warning");
// console.timeEnd("kappa default-warn");

// console.time("kappa default-log");
// for (let i = 0; i < 1000; i++) console.log("log");
// console.timeEnd("kappa default-log");

// console.time("kappa scribe-warn");
// for (let i = 0; i < 1000; i++) Scribe.warn("warn");
// console.timeEnd("kappa scribe-warn");

// console.time("kappa scribe-error");
// for (let i = 0; i < 1000; i++) Scribe.error("error");
// console.timeEnd("kappa scribe-error");

// console.time("kappa scribe-info");
// for (let i = 0; i < 1000; i++) Scribe.info("info");
// console.timeEnd("kappa scribe-info");

// console.time("kappa scribe-trace");
// for (let i = 0; i < 1000; i++) Scribe.trace("trace");
// console.timeEnd("kappa scribe-trace");

// console.time("kappa scribe-inspect");
// for (let i = 0; i < 1000; i++) Scribe.inspect("inspect");
// console.timeEnd("kappa scribe-inspect");
