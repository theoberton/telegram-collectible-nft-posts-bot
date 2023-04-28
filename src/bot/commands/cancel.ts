import { BOT_COMMANDS, BotContext } from "/src/types/mod.ts";

import { BOT_REPLIES_MAP } from "/src/bot/replies.ts";
import { Composer } from "grammy";

const composer = new Composer<BotContext>();

composer.command(BOT_COMMANDS.CANCEL, (ctx) => {
  return ctx.reply(BOT_REPLIES_MAP.OPERATION_CANCELED, {
    reply_markup: {
      remove_keyboard: true,
    },
  });
});

export default composer;
