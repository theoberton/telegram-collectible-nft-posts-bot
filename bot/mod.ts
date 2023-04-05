import { Bot } from "grammy";
import config from "config";

import db from "/db/index.ts";
import { BOT_COMMANDS, BotContext } from "/types/mod.ts";
import Middlewares from "/bot/middlewares/mod.ts";
import Commands from "/bot/commands/mod.ts";
import Handlers from "/bot/handlers/mod.ts";
import Events from "/bot/events/mod.ts";

const tokenValue = config.get("telegram.collectibleBot.token");

const bot = new Bot<BotContext>(tokenValue);

bot.use(Middlewares, Commands, Handlers, Events);

// bot.on("message", (ctx: BotContext) => {
//   console.log("ctx.chat?.id", ctx.chat?.id);
//   console.log("ctx.session.currentCommand", ctx.session.currentCommand);

//   ctx.session.currentCommand = BOT_COMMANDS.ADD_CHANNEL_MESSAGE;
//   ctx.reply("Heeeelo");
// });

bot.catch((err) => {
  console.error(`Error while handling update ${err.ctx.update.update_id}:`);
  console.error(err.error);
});

export default bot;
