import {
  TelegamChatMember,
  TelegramGroupBotMemberRole,
  ChatMemberEvents,
} from "/src/types/mod.ts";

import userService from "/src/modules/user/service.ts";

const leaveStatuses = [
  TelegramGroupBotMemberRole.left,
  TelegramGroupBotMemberRole.kicked,
];

export const getEventType = async (chatMemberData: TelegamChatMember) => {
  let eventType: ChatMemberEvents = ChatMemberEvents.ADD;

  const user = await userService.findUserByChannelId(chatMemberData.chat.id);

  const isAddOperation =
    chatMemberData.newChatMember.status ===
    TelegramGroupBotMemberRole.adminitstrator;
  const isRemoveOperation = Boolean(
    leaveStatuses.includes(chatMemberData.newChatMember.status) && user
  );

  switch (true) {
    case isAddOperation:
      eventType = ChatMemberEvents.ADD;
      break;
    case isRemoveOperation:
      eventType = ChatMemberEvents.REMOVE;
      break;
    default:
      throw new Error("Operation not defined");
  }

  return eventType;
};
