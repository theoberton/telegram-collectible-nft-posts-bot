import mongoose, { Connection, ConnectOptions } from "mongoose";
import log4js from "log4js";

import { idPlugin } from "/db/plugins/id.ts";
import { OdmConnectionParams } from "/types/mod.ts";

const logger = log4js.getLogger();

export function initDb(uri: string, options?: ConnectOptions) {
  const odmConnectingParams: OdmConnectionParams = { uri, options };
  console.log("uri", uri);

  const odm = mongoose.createConnection(uri, options);

  const firstConnectionErrorHandler = initFistErrorHandler();

  mongoose.connection.on("error", (err: any) => {
    logger.info("Mongoose level error");
    logger.error(err);
  });

  odm.on("connecting", () =>
    logger.info(`MongoDB connecting to ${odm.host}:${odm.port}`)
  );

  odm.on("error", (err: any) => {
    console.log("error mongo");
    firstConnectionErrorHandler(err, odm, odmConnectingParams);
  });

  odm.on("close", (err: any) => {
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

  odm.on("disconnected", () =>
    logger.warn(`MongoDB connection lost to ${odm.host}:${odm.port}.`)
  );

  mongoose.plugin((schema) => schema.set("timestamps", true));

  mongoose.plugin(idPlugin);

  mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, converted) => {
      delete converted._id;
      delete converted.__v;
    },
  });

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
        process.exit(1);
      }
    } else {
      // Some other error occurred.  Log it.
      logger.error(err);
    }
  };
}
