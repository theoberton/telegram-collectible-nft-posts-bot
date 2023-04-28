import { Composer } from "grammy";

import { BOT_COMMANDS, BotContext } from "/src/types/mod.ts";
import { BOT_REPLIES_MAP } from "/src/bot/replies.ts";

import userService from "/src/modules/user/service.ts";

const composer = new Composer<BotContext>();

composer.command(BOT_COMMANDS.START, async (ctx) => {
  const user = await userService.findUser(ctx.chat.id);

  if (!user) {
    await userService.createUser({ userId: ctx.chat.id });
  }
  return ctx.reply(BOT_REPLIES_MAP.START);
});

export default composer;
