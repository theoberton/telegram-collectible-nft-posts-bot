import { BOT_COMMANDS } from "/types/mod.ts";
import { BOT_REPLIES_MAP } from "/bot/replies.ts";
import { Composer } from "grammy";

const composer = new Composer();

composer.command(BOT_COMMANDS.ADD_CHANNEL, (ctx) => {
  ctx.reply(BOT_REPLIES_MAP.ADD_CHANNEL);
});

export default composer;
