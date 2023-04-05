import { BOT_COMMANDS } from "/types/mod.ts";
import { Composer } from "grammy";
import listChannels from "/bot/menus/listChannels/mod.ts";

const composer = new Composer();

composer.command(BOT_COMMANDS.MY_CHANNELS, (ctx) =>
  listChannels.replyToContext(ctx)
);

export default composer;
