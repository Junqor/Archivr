import tmp from "tmp";

tmp.setGracefulCleanup();

export const tmpDir = tmp.dirSync({prefix:"ARCHIVR"});

console.log("Opened temp directory at "+tmpDir.name);