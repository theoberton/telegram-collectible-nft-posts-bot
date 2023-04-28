import {
  BotContext,
  BotConversation,
  ConversationHandler,
} from "/src/types/mod.ts";
import { EDITION_DEFAULT_SETTINGS_REPLIES_MAP } from "/src/bot/replies.ts";
import Promise from "bluebird";
import _ from "lodash";
import {
  getPayoutAddress,
  getRoyaltyAmount,
  getButtonName,
  getPrice,
} from "/src/bot/conversations/edition-settings/handlers/mod.ts";
import editionService from "/src/modules/edition/service.ts";

import userService from "/src/modules/user/service.ts";

async function editionSettings(conversation: BotConversation, ctx: BotContext) {
  const chatId = ctx.chat?.id!;

  const user = await conversation.external(() => userService.findUser(chatId));
  const conversationName = editionSettings.name;

  const fieldsHandlers = [
    getButtonName,
    getPayoutAddress,
    getRoyaltyAmount,
    getPrice,
  ];

  await Promise.mapSeries(fieldsHandlers, (handler: ConversationHandler) =>
    handler(conversation, ctx, conversationName, chatId)
  );

  await userService.updateUserEditionSettings(
    ctx.chat?.id!,
    ctx.session.editionDraft
  );

  await ctx.reply(EDITION_DEFAULT_SETTINGS_REPLIES_MAP.SETTINGS_UPDATED, {
    reply_markup: {
      remove_keyboard: true,
    },
  });

  if (_.isEmpty(user.channels)) {
    await Promise.delay(1000);
    await ctx.reply(EDITION_DEFAULT_SETTINGS_REPLIES_MAP.START_ADDING_CHANNEL);
  }

  const existingEdition = await editionService.findExistingUserEdition(
    user.userId
  );

  if (!_.isEmpty(user.channels) && !existingEdition) {
    await ctx.reply(EDITION_DEFAULT_SETTINGS_REPLIES_MAP.START_FORWARD_MESSAGE);
  }

  ctx.session.editionDraft = {};
}

export default editionSettings;
