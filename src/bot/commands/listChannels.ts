import { BOT_COMMANDS, BotContext } from "/src/types/mod.ts";

import { Composer } from "grammy";
import menu from "/src/bot/menus/mod.ts";

const composer = new Composer<BotContext>();

composer.command(BOT_COMMANDS.MY_CHANNELS, (ctx) => {
  return menu.replyToContext(ctx, "/channels/");
});

export default composer;
