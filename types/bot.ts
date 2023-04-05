import { Context as GrammyContext, SessionFlavor } from "grammy";

import {
  type Conversation,
  type ConversationFlavor,
  conversations,
} from "grammy-conversation";

export enum BOT_COMMANDS {
  START = "start",
  MY_CHANNELS = "mychannels",
  ADD_CHANNEL = "addchannel",
  ADD_CHANNEL_MESSAGE = "addchannelmessage",
  CREATE_EDITION_FROM_POST = "/createeditionfrompost",
}

export interface SessionData {
  currentCommand: string;
}

export type BotContext = GrammyContext &
  SessionFlavor<SessionData> &
  ConversationFlavor;

export interface TelegramBotInfo {
  id: number;
  isBot: boolean;
  firstName: string;
  username: string;
  canJoinGroups: boolean;
  canReadAllGroupMessages: boolean;
  supportsInlineQueries: boolean;
}

export enum TelegramGroupBotMemberRole {
  adminitstrator = "administrator",
  left = "left",
  creator = 'creator',
  kicked = 'kicked'
}

export interface TelegramGroupMemberInfo {
  chatId: number;
  title: string;
  username: string;
  status: TelegramGroupBotMemberRole;
  date: Date;
  canPostMessages: boolean;
  canEditMessages: boolean;
  canDeleteMessages: boolean;
}

export interface TelegramChatMember {
  user: {
    id: number;
    isBot: boolean;
    firstName: string;
    username: string;
  };
  status: TelegramGroupBotMemberRole;
  canBeEdited: boolean;
  canManageChat: boolean;
  canChangeInfo: boolean;
  canPostMessages: boolean;
  canEditMessages: boolean;
  canDeleteMessages: boolean;
  canInviteUsers: boolean;
  canRestrictMembers: boolean;
  canPromoteMembers: boolean;
  canManageVideoChats: boolean;
  isAnonymous: boolean;
  canManageVoiceChats: boolean;
}

export interface TelegramForwardedFromChat {
  id: number;
  title: string;
  type: string;
  username: string;
}

export interface TelegramBotMessage {
  messageId: number;
  forwardFromChat: TelegramForwardedFromChat;
  forwardFromMessageId: number;
  forwardDate: number;
  from: {
    id: number;
    isBot: boolean;
    firstName: string;
    lastName: string;
    username: string;
    languageCode: string;
  };
  chat: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    type: string;
  };
  date: number;
  text: string;
  entities: [
    {
      offset: number;
      length: number;
      type: string;
    }
  ];
}

export interface TelegamWebhookEvent {
  updateId: number;
  myChatMember: {
    chat: {
      username: string;
      id: number;
      title: string;
      type: string;
    };
    from: {
      id: number;
      isBot: false;
      firstName: string;
      lastName: string;
      username: string;
      languageCode: string;
    };
    date: number;
    oldChatMember?: TelegramChatMember;
    newChatMember?: TelegramChatMember;
  };
  message: TelegramBotMessage;
}
