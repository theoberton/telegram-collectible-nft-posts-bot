import { Composer } from "grammy";
import { BotContext, BOT_COMMANDS, Conversations } from "/src/types/mod.ts";

import { conversations, createConversation } from "grammy-conversation";
import conversationHanlders from "/src/bot/conversations/mod.ts";
import { conversactionErrorHandler } from "/src/bot/conversations/utils.ts";

const composer = new Composer<BotContext>();

const protecedComposer = composer.errorBoundary(conversactionErrorHandler);

protecedComposer.use(conversations());

conversationHanlders.forEach((handler) =>
  protecedComposer.use(createConversation(handler, handler.name))
);

protecedComposer.command(BOT_COMMANDS.EDITION_SETTINGS, async (ctx) => {
  await ctx.conversation.enter(Conversations.EDITION_SETTINGS);
});

export default composer;
