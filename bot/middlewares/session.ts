import { session, Composer } from "grammy";
import { MongoDBAdapter, ISession } from "grammyMongoStorage";

import { BotContext } from "/types/mod.ts";
import db from "/db/index.ts";

import { initial } from "/bot/middlewares/helpers.ts";

const collection = db.collection<ISession>("sessions");

const composer = new Composer<BotContext>();

composer.use(
  session({
    initial,
    storage: new MongoDBAdapter({ collection }),
  })
);

export default composer;
