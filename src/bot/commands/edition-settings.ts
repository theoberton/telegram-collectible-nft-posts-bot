import { BOT_COMMANDS, BotContext, Conversations } from "/src/types/mod.ts";
import { Composer } from "grammy";

const composer = new Composer<BotContext>();

export const editionSettingMiddleware = async (
  ctx: BotContext
) => {
  await ctx.conversation.enter(Conversations.EDITION_SETTINGS);
};

composer.command(BOT_COMMANDS.EDITION_SETTINGS, editionSettingMiddleware);

export default composer;
