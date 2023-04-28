import { Bot, GrammyError, HttpError } from "grammy";
import config from "config";

import { BotContext } from "/src/types/mod.ts";
import Middlewares from "/src/bot/middlewares/mod.ts";
import Commands from "/src/bot/commands/mod.ts";
import Events from "/src/bot/events/mod.ts";

const tokenValue = config.get("telegram.collectibleBot.token");

const bot = new Bot<BotContext>(tokenValue);

bot.use(Middlewares, Commands, Events);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

export default bot;
