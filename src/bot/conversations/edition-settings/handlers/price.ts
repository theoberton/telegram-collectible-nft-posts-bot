import { Keyboard } from "grammy";
import { BotContext, BotConversation } from "/src/types/mod.ts";
import { EDITION_DEFAULT_SETTINGS_REPLIES_MAP } from "/src/bot/replies.ts";
import { getConversationTextReply } from "/src/bot/conversations/utils.ts";
import { isNumeric } from "/src/utils/mod.ts";
import userService from "/src/modules/user/service.ts";

export async function getPrice(
  conversation: BotConversation,
  ctx: BotContext,
  conversationName: string,
  userId: number
) {
  const user = await conversation.external(() => userService.findUser(userId));

  const defaultPrice = user.editionSettings?.price || "1";
  const keyboard = new Keyboard().text(defaultPrice).row().resized().oneTime();

  await ctx.api.sendMessage(
    userId,
    EDITION_DEFAULT_SETTINGS_REPLIES_MAP.ENTER_EDITION_PRICE,
    {
      reply_markup: keyboard,
    }
  );

  let price: string;

  do {
    const priceMessage = await getConversationTextReply(
      conversation,
      ctx,
      conversationName
    );

    price = priceMessage?.text!;

    if (!isNumeric(price)) {
      await ctx.api.sendMessage(
        userId,
        EDITION_DEFAULT_SETTINGS_REPLIES_MAP.PRICE_SHOULD_BE_NUMBER
      );
    }
  } while (!isNumeric(price));

  ctx.session.editionDraft.price = price;
}
