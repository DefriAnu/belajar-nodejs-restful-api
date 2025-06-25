import { logger } from "./application/logging.js";
import {web} from "./application/web.js";
import https from "https";
import fs from "fs";

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, web).listen(3000, () => {
    logger.info("App start");
});