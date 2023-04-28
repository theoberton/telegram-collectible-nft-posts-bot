import { Context as GrammyContext, SessionFlavor, Keyboard } from "grammy";
import { PostEditionSettings } from "./edition.ts";

import {
  type Conversation,
  type ConversationFlavor,
} from "grammy-conversation";
import { IUser } from "./mod.ts";

export enum BOT_COMMANDS {
  START = "start",
  EDITION_SETTINGS = "postsettings",
  CANCEL = "cancel",
  MY_CHANNELS = "mychannels",
  ADD_CHANNEL = "addchannel",
  SUPPORT = "support",
  LIST_POSTS = "posts",
  HELP = "help",
}

export enum TRANSACTION_REQUEST {
  EDITION = "edition",
  MINT = "mint",
}

export type ReplyInlineKeyboardOptions = {
  reply_markup: {
    remove_keyboard?: boolean;
    inline_keyboard?: Keyboard;
  };
};

export type ConversationHandler = (
  conversation: BotConversation,
  ctx: BotContext,
  conversationName: string,
  chatId: number,
) => Promise<void>;

export interface SessionData {
  page: number;
  userId: number | null;
  editionDraft: Partial<PostEditionSettings>;
}

export type BotContext = GrammyContext &
  SessionFlavor<SessionData> &
  ConversationFlavor;

export type BotConversation = Conversation<BotContext>;

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
  creator = "creator",
  kicked = "kicked",
}

export enum ChatMemberEvents {
  ADD = "add",
  REMOVE = "remove",
}

export interface TelegramGroupChannelInfo {
  chatId: number;
  title: string;
  username: string;
  status: TelegramGroupBotMemberRole;
  date: Date;
  canEditMessages: boolean;
  autoEditionLinkCreation?: boolean;
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

export interface TelegamChatMember {
  chat: {
    username?: string;
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
  newChatMember: TelegramChatMember;
}

export interface TelegramChannelPost {
  messageId: number;
  senderChat: {
    id: number;
    title: string;
    username: string;
    type: string;
  };
  chat: {
    id: number;
    title: string;
    username: string;
    type: string;
  };
  date: number;
  text: string;
  photo: TelegramPhotoItem;
  caption: string;
}

type TelegramPhotoItem = {
  fileId: string;
  fileUniqueId: string;
  fileSize: number;
  width: number;
  height: number;
};

export interface TelegramChannelPostUpdate {
  updateId: number;
  editedChannelPost: TelegramChannelPost;
}

export enum Conversations {
  EDITION_SETTINGS = "editionSettings",
}
