import util from "util";
import cd from "child_process";
import fs from "fs";

export const mkdir = util.promisify(fs.mkdir);
export const rmdir = util.promisify(fs.rm);

export const copy = util.promisify(fs.copyFile);
export const rename = util.promisify(fs.rename);

export const run = util.promisify(cd.exec);

export const access = util.promisify(fs.access);

/**
 * @param {fs.PathLike} path 
 * @returns 
 */
export const exists = async (path) => {
    let exists = true;
    await access(path).catch(() => exists = false);
    return exists;
};
