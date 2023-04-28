import { session, Composer } from "grammy";
import { MongoDBAdapter, ISession } from "grammyMongoStorage";

import { BotContext } from "/src/types/mod.ts";
import db from "/src/db/index.ts";
import { initialSession } from "/src/bot/middlewares/helpers.ts";

const collection = db.collection<ISession>("sessions");

const composer = new Composer<BotContext>();

composer.use(
  session({
    initial: initialSession,
    storage: new MongoDBAdapter({ collection }),
  })
);

export default composer;
