import { BotContext, BotConversation } from "/src/types/mod.ts";
import { EDITION_DEFAULT_SETTINGS_REPLIES_MAP } from "/src/bot/replies.ts";

import { convertToBounceableAddress } from "/src/utils/mod.ts";
import { getConversationTextReply } from "/src/bot/conversations/utils.ts";
import { Keyboard } from "grammy";
import userService from "/src/modules/user/service.ts";

export async function getPayoutAddress(
  conversation: BotConversation,
  ctx: BotContext,
  conversationName: string,
  userId: number
) {
  let payoutAddress = null;

  const user = await conversation.external(() => userService.findUser(userId));

  if (user.editionSettings?.payoutAddress) {
    const { payoutAddress } = user.editionSettings;
    const keyboard = new Keyboard()
      .text(payoutAddress)
      .row()
      .resized()
      .oneTime();

    await ctx.api.sendMessage(
      userId,
      EDITION_DEFAULT_SETTINGS_REPLIES_MAP.ENTER_PAYOUT_ADDRESS,
      {
        reply_markup: keyboard,
      }
    );
  } else {
    await ctx.api.sendMessage(
      userId,
      EDITION_DEFAULT_SETTINGS_REPLIES_MAP.ENTER_PAYOUT_ADDRESS,
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  }

  do {
    const payoutAddressMessage = await getConversationTextReply(
      conversation,
      ctx,
      conversationName
    );

    const messagePayoutAddress = payoutAddressMessage?.text!;

    payoutAddress = convertToBounceableAddress(messagePayoutAddress);

    if (!payoutAddress) {
      await ctx.api.sendMessage(
        userId,
        EDITION_DEFAULT_SETTINGS_REPLIES_MAP.PAYOUT_ADDRESS_WARNING
      );
    }
  } while (!payoutAddress);

  ctx.session.editionDraft.payoutAddress = payoutAddress;
}
