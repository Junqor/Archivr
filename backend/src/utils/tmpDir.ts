import tmp from "tmp";
import { logger } from "../configs/logger.js";

tmp.setGracefulCleanup();

export const tmpDir = tmp.dirSync({ prefix: "ARCHIVR" });

logger.info("Opened temp directory at " + tmpDir.name);
