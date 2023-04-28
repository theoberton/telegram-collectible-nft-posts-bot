import mongoose, { Connection, ConnectOptions } from "mongoose";
import { logger } from "/src/utils/mod.ts";
import { idPlugin } from "/src/db/plugins/id.ts";
import { toJSON } from "/src/db/plugins/toJson.ts";
import { OdmConnectionParams } from "/src/types/mod.ts";

export function initDb(uri: string, options?: ConnectOptions) {
  const odmConnectingParams: OdmConnectionParams = { uri, options };

  const odm: Connection = mongoose.createConnection(uri, options);

  const firstConnectionErrorHandler = initFistErrorHandler();

  odm.on("connecting", () =>
    logger.info(`MongoDB connecting to ${odm.host}:${odm.port}`)
  );

  odm.on("error", (err: Error) => {
    firstConnectionErrorHandler(err, odm, odmConnectingParams);
  });

  odm.on("close", (err) => {
    logger.info("MongoDB connection closed");
    logger.error(err);
  });

  odm.on("connected", () => {
    logger.info(`MongoDB connected successfully to ${odm.host}:${odm.port}`);
  });

  odm.once("open", () =>
    logger.info(`MongoDB opened successfully on ${odm.host}:${odm.port}`)
  );

  odm.on("reconnected", () =>
    logger.info(`MongoDB reconnected to ${odm.host}:${odm.port}.`)
  );

  odm.on("timeout", () =>
    logger.warn(`MongoDB timeout on ${odm.host}:${odm.port}.`)
  );

  odm.on("disconnected", () => logger.warn(`MongoDB connection lost .`));

  mongoose.plugin((schema: any) => schema.set("timestamps", true));

  mongoose.plugin(idPlugin);

  mongoose.plugin(toJSON);

  return odm;
}

function initFistErrorHandler(reconnectTries = 20000, reconnectInterval = 10) {
  let reconnectCounter = 0;

  return function handleFirstConnectionError(
    err: Error,
    odm: Connection,
    odmConnectingParams: OdmConnectionParams
  ) {
    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    if (
      err.message &&
      err.message.match(/failed to connect to server .* on first connect/)
    ) {
      logger.warn(err.message);

      if (reconnectCounter < reconnectTries) {
        reconnectCounter++;
        // Wait for a bit, then try to connect again
        setTimeout(() => {
          logger.warn("Retrying first connect...");

          odm
            .openUri(odmConnectingParams.uri, odmConnectingParams.options)
            .catch(() => {
              logger.error("Error occured");
            });
        }, reconnectInterval);
      } else {
        logger.error("Failed to establish initial connection");
        Deno.exit(1);
      }
    } else {
      // Some other error occurred.  Log it.
      logger.error(err);
    }
  };
}
