import { Document } from "mongoose";
import { TelegramGroupChannelInfo } from "./bot.ts";

export interface IPostData {
  text?: string;
  messageId: number;
  channelId: number;
  date: Date;
}

export interface IPostDataFull extends IPostData {
  channel: TelegramGroupChannelInfo,
}

export interface IPostQuery {
  messageId: number;
  channelId: number;
}

export interface IPost extends Document {
  text?: string;
  messageId: number;
  channelId: number;
  date: Date;
}

export interface IPostChannels extends IPost {
  channel: TelegramGroupChannelInfo;
}
