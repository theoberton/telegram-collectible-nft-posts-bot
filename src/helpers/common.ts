import { BotContext } from "/src/types/mod.ts";
import { logger } from "/src/utils/mod.ts";

export async function removeMessageOnceResolved<
  T extends (...args: any) => Promise<string>
>(func: T, ctx: BotContext, waitingText: string) {
  const message = await ctx.reply(waitingText);

  let result;
  try {
    result = await func();

    await ctx.api.deleteMessage(ctx.chat?.id!, message.message_id);
  } catch (error) {
    logger.error(error);
  }

  return result;
}
