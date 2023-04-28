import {
  TelegamChatMember,
  TelegramGroupBotMemberRole,
  BotContext,
} from "/src/types/mod.ts";

import { BOT_REPLIES_MAP } from "/src/bot/replies.ts";

import userService from "/src/modules/user/service.ts";
import { fromUnixToDate } from "/src/utils/mod.ts";
import { DEFAULT_MESSAGE_OPTIONS } from "/src/constants/mod.ts";
import { NextFunction } from "grammy";

const leaveStatuses = [
  TelegramGroupBotMemberRole.left,
  TelegramGroupBotMemberRole.kicked,
];

export async function handleAddBotToChannel(
  ctx: BotContext,
  chatMemberData: TelegamChatMember,
  next: NextFunction
) {
  const { newChatMember } = chatMemberData;

  const channel = await userService.findChannel({
    chatId: chatMemberData.chat.id,
  });

  if (!channel) {
    await userService.addUserChannel(chatMemberData.from.id, {
      chatId: chatMemberData.chat.id,
      title: chatMemberData.chat.title,
      username: chatMemberData.chat.username!,
      status: newChatMember.status,
      date: fromUnixToDate(chatMemberData.date),
      canEditMessages: newChatMember.canEditMessages,
    });
  }

  if (!newChatMember.canEditMessages) {
    await ctx.api.sendMessage(
      chatMemberData.from.id,
      BOT_REPLIES_MAP.NEED_POST_EDIT_PERMISSION_TO_START_WORKING,
      DEFAULT_MESSAGE_OPTIONS
    );
  } else {
    await ctx.api.sendMessage(
      chatMemberData.from.id,
      BOT_REPLIES_MAP.CHANNEL_HAS_BEEN_SUCCESSFULLY_ADDED(
        chatMemberData.chat.title
      ),
      DEFAULT_MESSAGE_OPTIONS
    );
  }

  const user = await userService.findUser(chatMemberData.from.id);

  if (!user.editionSettings) {
    await ctx.api.sendMessage(
      chatMemberData.from.id,
      BOT_REPLIES_MAP.SETUP_EDITION_SETTINGS
    );
    next();
  }
}

export async function handleRemoveBotFromChannel(
  ctx: BotContext,
  chatMemberData: TelegamChatMember,
  _next: NextFunction
) {
  const user = await userService.findUserByChannelId(chatMemberData.chat.id);

  if (leaveStatuses.includes(chatMemberData.newChatMember.status) && user) {
    await userService.deleteUserChannel(chatMemberData.chat.id);

    await ctx.api.sendMessage(
      user.userId,
      BOT_REPLIES_MAP.REMOVED_FROM_CHANNEL(chatMemberData.chat.title),
      DEFAULT_MESSAGE_OPTIONS
    );
  }
}
