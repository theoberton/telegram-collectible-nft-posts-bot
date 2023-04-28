import { Agenda } from "agenda";
import { MongoConfigOptions } from "/src/types/mod.ts";
import { getMongoConnectionString } from "/src/db/utils.ts";
import config from "config";

const mongoDbConfig = config.get("mongoDB") as MongoConfigOptions;
const connectionUrl = getMongoConnectionString(mongoDbConfig);

const agenda = new Agenda({
  name: "scheduler",
  db: { address: connectionUrl },
  defaultLockLifetime: 5000,
});

(async function () {
  // IIFE to give access to async/await
  await agenda.start();
})();

export default agenda;
