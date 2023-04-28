import { Keyboard } from "grammy";
import { BotContext, BotConversation } from "/src/types/mod.ts";
import { EDITION_DEFAULT_SETTINGS_REPLIES_MAP } from "/src/bot/replies.ts";
import { getConversationTextReply } from "/src/bot/conversations/utils.ts";
import userService from "/src/modules/user/service.ts";

export async function getButtonName(
  conversation: BotConversation,
  ctx: BotContext,
  conversationName: string,
  userId: number
) {
  const user = await conversation.external(() => userService.findUser(userId));

  const defaultButtonName =
    user.editionSettings?.buttonName ||
    EDITION_DEFAULT_SETTINGS_REPLIES_MAP.DEFAULT_COLLECT_BUTTON_NAME;

  const keyboard = new Keyboard()
    .text(defaultButtonName)
    .row()
    .resized()
    .oneTime();

  await ctx.api.sendMessage(userId, EDITION_DEFAULT_SETTINGS_REPLIES_MAP.ENTER_BUTTON_NAME, {
    reply_markup: keyboard,
  });

  const message = await getConversationTextReply(
    conversation,
    ctx,
    conversationName
  );

  ctx.session.editionDraft.buttonName = message?.text;
}
