import mongoose, { Document } from "mongoose";
import db from "/db/index.ts";
import {
  PostEditionSettings,
  TelegramBotInfo,
  TelegramGroupBotMemberRole,
  TelegramGroupMemberInfo,
} from "/types/mod.ts";

const modelName = "PersonalBot";
const collectionName = "personal_bots";

export interface IPersonalBot extends Document {
  botToken: string;
  userId: number;
  postEditionSettings: PostEditionSettings;
  botInfo: TelegramBotInfo;
  botChannels: TelegramGroupMemberInfo[];
}

const BotInfoSchema = new mongoose.Schema<TelegramBotInfo>({
  id: { type: Number, required: true },
  isBot: { type: Boolean, required: true },
  firstName: { type: String, required: true },
  username: { type: String, required: true },
  canJoinGroups: { type: Boolean, required: true },
  canReadAllGroupMessages: { type: Boolean, required: true },
  supportsInlineQueries: { type: Boolean, required: true },
});

const PostEditionSettingsSchema = new mongoose.Schema<PostEditionSettings>({
  payoutAddress: { type: String, required: true },
  royalty: { type: String, required: true },
});

const BotChannelsSchema = new mongoose.Schema<TelegramGroupMemberInfo>({
  status: {
    type: String,
    enum: [TelegramGroupBotMemberRole.adminitstrator],
    required: true,
  },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  username: { type: String, required: true },
  chatId: { type: Number, required: true },
  canPostMessages: { type: Boolean, required: true },
  canEditMessages: { type: Boolean, required: true },
  canDeleteMessages: { type: Boolean, required: true },
});

const PersonalBotSchema = new mongoose.Schema<IPersonalBot>({
  userId: { type: Number, required: true },
  postEditionSettings: PostEditionSettingsSchema,
  botToken: { type: String, required: true },
  botInfo: BotInfoSchema,
  botChannels: [BotChannelsSchema],
});

PersonalBotSchema.index({ botToken: 1 }, { unique: true });
PersonalBotSchema.index({ "botChannels.chatId": 1 }, { unique: true });

export default db.model(modelName, PersonalBotSchema, collectionName);
