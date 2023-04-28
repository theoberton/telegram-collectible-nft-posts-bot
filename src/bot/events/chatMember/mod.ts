import {
  TelegamChatMember,
  ChatMemberEvents,
  BotContext,
} from "/src/types/mod.ts";

import { Composer, NextFunction } from 'grammy';

import { renameKeysToCamelCase } from "/src/utils/mod.ts";
import {
  handleAddBotToChannel,
  handleRemoveBotFromChannel,
} from "/src/bot/events/chatMember/handlers.ts";
import { getEventType } from "/src/bot/events/chatMember/helpers.ts";

const composer = new Composer<BotContext>();

const eventsHandlersMap = {
  [ChatMemberEvents.ADD]: handleAddBotToChannel,
  [ChatMemberEvents.REMOVE]: handleRemoveBotFromChannel,
};

composer.on("my_chat_member", async (ctx, next: NextFunction) => {
  const chatMember = ctx.myChatMember;
  const chatMemberData: TelegamChatMember = renameKeysToCamelCase(chatMember);

  // Currently public channels support only
  if (!chatMemberData.chat.username) {
    throw new Error("Only public allowed");
  }

  const event = await getEventType(chatMemberData);
  const eventHandler = eventsHandlersMap[event];

  return eventHandler(ctx, chatMemberData, next);
});

export default composer;
