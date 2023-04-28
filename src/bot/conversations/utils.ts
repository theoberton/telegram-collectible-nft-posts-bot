import { BotError, NextFunction } from "grammy";
import { BotContext, BotConversation, BOT_COMMANDS } from "/src/types/mod.ts";

export function conversactionErrorHandler(err: BotError, next: NextFunction) {
  next();
}

export async function getConversationTextReply(
  conversation: BotConversation,
  ctx: BotContext,
  conversationName: string
) {
  let textValue: undefined | string;
  let resultMessage: typeof ctx.update.message;

  do {
    const { message } = await conversation.wait();

    if (message?.text === `/${BOT_COMMANDS.CANCEL}`) {
      await ctx.conversation.exit(conversationName);
    }

    if (message?.text) {
      resultMessage = message;
    }
    textValue = message?.text;
  } while (!textValue);

  return resultMessage;
}
