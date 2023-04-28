// import {Types} from 'mongoose';

import { MongoConfigOptions } from "/src/types/mod.ts";

export function getMongoConnectionString(config: MongoConfigOptions) {
  const authStr = config.auth
    ? `${config.auth.username}:${config.auth.password}@`
    : "";

  return `mongodb://${authStr}${config.host}:${config.port}/${config.dbName}`;
}
