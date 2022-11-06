import { copy, mkdir, rename, rmdir, run } from "./base.js";
import path from "path";

const BUILD_CACHE_DIR = "build-cache";
const DIST_DIR = "dist";

const ESM_DIR = path.join(BUILD_CACHE_DIR, "esm");
const CJS_DIR = path.join(BUILD_CACHE_DIR, "cjs");
const TYPES_DIR = path.join(BUILD_CACHE_DIR, "types");

const TYPES_FILE_NAME = "index.d.ts";
const TYPES_FILE_SOURCE = path.join(ESM_DIR, TYPES_FILE_NAME);
const TYPES_FILE_TARGET = path.join(TYPES_DIR, TYPES_FILE_NAME);

const COMPILE_ESM_COMMAND = "yarn tsc";
const COMPILE_CJS_COMMAND = "yarn tsc --project ./devops/tsconfig.json";

try {
    // remove previous build directory (if it exists)
    await rmdir(BUILD_CACHE_DIR, { recursive: true, force: true });
    
    // create build cache directory
    await mkdir(BUILD_CACHE_DIR);
    
    // compile for esm
    await run(COMPILE_ESM_COMMAND);
    
    // compile for cjs
    await run(COMPILE_CJS_COMMAND);
    
    // create types directory
    await mkdir(TYPES_DIR);
    
    // copy types into types directory
    await copy(TYPES_FILE_SOURCE, TYPES_FILE_TARGET);
    
    // remove previous dist directory (if it exists)
    await rmdir(DIST_DIR, { recursive: true, force: true });
    
    // rename the build cache dir to dist
    await rename(BUILD_CACHE_DIR, DIST_DIR);
} finally {
    // remove the build directory (if it exists)
    await rmdir(BUILD_CACHE_DIR, { recursive: true, force: true });
}
