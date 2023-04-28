import { EDITION_DEFAULT_SETTINGS_REPLIES_MAP } from "/src/bot/replies.ts";
import _ from "lodash";
import { BotContext, BotConversation } from "/src/types/mod.ts";
import { getConversationTextReply } from "/src/bot/conversations/utils.ts";
import { Keyboard } from "grammy";
import userService from "/src/modules/user/service.ts";

export async function getRoyaltyAmount(
  conversation: BotConversation,
  ctx: BotContext,
  conversationName: string,
  userId: number
) {
  let royalty: number | null = null;
  const user = await conversation.external(() => userService.findUser(userId));

  if (user.editionSettings?.royalty) {
    const { royalty } = user.editionSettings;
    const keyboard = new Keyboard()
      .text(String(royalty))
      .row()
      .resized()
      .oneTime();

    await ctx.api.sendMessage(
      userId,
      EDITION_DEFAULT_SETTINGS_REPLIES_MAP.WHAT_IS_ROYALTY,
      {
        reply_markup: keyboard,
      }
    );
  } else {
    await ctx.api.sendMessage(
      userId,
      EDITION_DEFAULT_SETTINGS_REPLIES_MAP.WHAT_IS_ROYALTY,
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  }

  do {
    const royaltyMessage = await getConversationTextReply(
      conversation,
      ctx,
      conversationName
    );

    const messageRoyalty = Number(royaltyMessage?.text);

    royalty = isValidRoyalty(messageRoyalty) ? messageRoyalty : null;

    if (royalty === null) {
      await ctx.api.sendMessage(
        userId,
        EDITION_DEFAULT_SETTINGS_REPLIES_MAP.ROYALTY_WARNING
      );
    }
  } while (royalty == null);

  ctx.session.editionDraft.royalty = String(royalty);
}

function isValidRoyalty(royalty: number) {
  return royalty >= 0 && royalty <= 100 && _.isInteger(royalty);
}
