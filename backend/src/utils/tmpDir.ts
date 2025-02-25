import tmp from "tmp";

tmp.setGracefulCleanup();

export const tmpDir = tmp.dirSync();

console.log("opened tmp dir at "+tmpDir.name);