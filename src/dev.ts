import { LogLevels, Scribe } from "./index.js";

const scribe = new Scribe({ level: LogLevels.All, pretty: true });

scribe.error("prefix", "error");
scribe.warn("prefix", "warn");
scribe.info("prefix", "info");
scribe.trace("prefix", "trace");
scribe.inspect("prefix", "inspect");

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
// for (let i = 0; i < 1000; i++) scribe.warn("warn");
// console.timeEnd("kappa scribe-warn");

// console.time("kappa scribe-error");
// for (let i = 0; i < 1000; i++) scribe.error("error");
// console.timeEnd("kappa scribe-error");

// console.time("kappa scribe-info");
// for (let i = 0; i < 1000; i++) scribe.info("info");
// console.timeEnd("kappa scribe-info");

// console.time("kappa scribe-trace");
// for (let i = 0; i < 1000; i++) scribe.trace("trace");
// console.timeEnd("kappa scribe-trace");

// console.time("kappa scribe-inspect");
// for (let i = 0; i < 1000; i++) scribe.inspect("inspect");
// console.timeEnd("kappa scribe-inspect");
