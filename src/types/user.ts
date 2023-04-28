// import { IPersonalBot } from '@/modules/personal-bot/model';
import {
  TelegramGroupChannelInfo,
  PostEditionSettings,
} from "/src/types/mod.ts";
import { Document } from "mongoose";

export interface IUserData {
  userId: number;
  editionSettings?: PostEditionSettings;
  channels?: TelegramGroupChannelInfo;
}

export interface IUser extends Document {
  userId: number;
  editionSettings: PostEditionSettings;
  channels: TelegramGroupChannelInfo[];
}
