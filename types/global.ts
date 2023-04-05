import { MongoConfigOptions, MongoDbSSLSettings } from "./db.ts";

export type GlobalConfig = {
  mongoDB: MongoConfigOptions;
  security: {
    mongoDBSSL: MongoDbSSLSettings;
  };
  telegram: {
    collectibleBot: {
      token: string;
    };
  };
  host: {
    port: string;
  };
};
