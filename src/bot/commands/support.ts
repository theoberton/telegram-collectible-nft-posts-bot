import { BOT_COMMANDS, BotContext } from "/src/types/mod.ts";
import { DEFAULT_MESSAGE_OPTIONS } from "/src/constants/mod.ts";

import { BOT_REPLIES_MAP } from "/src/bot/replies.ts";
import { Composer } from "grammy";

const composer = new Composer<BotContext>();

composer.command(BOT_COMMANDS.SUPPORT, (ctx: BotContext) => {
  return ctx.reply(BOT_REPLIES_MAP.SUPPORT, DEFAULT_MESSAGE_OPTIONS);
});

export default composer;
