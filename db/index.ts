import { initDb } from "/db/init.ts";
import { getMongoConnectionString } from "/db/utils.ts";
import { MongoConfigOptions, MongoDbSSLSettings } from "/types/mod.ts";
import { ConnectOptions } from "mongoose";
import config from "config";

const mongoDbConfig = config.get("mongoDB") as MongoConfigOptions;
const mongoDbSSLConfig = config.get(
  "security.mongoDBSSL"
) as MongoDbSSLSettings;

function getMongoConfig(): ConnectOptions {
  let mongoOptions: ConnectOptions = {};

  if (mongoDbConfig.sslEnabled) {
    mongoOptions = {
      ssl: true,
      tlsCertificateFile: `${mongoDbSSLConfig.folderPath}/${mongoDbSSLConfig.certFileName}`,
      tlsCertificateKeyFile: `${mongoDbSSLConfig.folderPath}/${mongoDbSSLConfig.keyFileName}`,
      tlsCAFile: `${mongoDbSSLConfig.folderPath}/${mongoDbSSLConfig.caFileName}`,
    };
  }

  return mongoOptions;
}

export default initDb(
  getMongoConnectionString(mongoDbConfig),
  getMongoConfig()
);
