import { createApp } from "./app/app.js";
import { config } from "./app/config.js";
import { logger } from "./infra/logger/logger.js";

const app = createApp();

app.listen(config.PORT, () => {
  logger.info({ port: config.PORT }, "NearStay API server started");
});
