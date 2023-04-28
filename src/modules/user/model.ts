import mongoose from "mongoose";
import db from "/src/db/index.ts";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import {
  PostEditionSettings,
  TelegramGroupBotMemberRole,
  TelegramGroupChannelInfo,
  IUser,
} from "/src/types/mod.ts";

const modelName = "User";
const collectionName = "users";

const EditionSettingsSchema = new mongoose.Schema<PostEditionSettings>({
  buttonName: { type: String, default: "Collect" },
  payoutAddress: { type: String, default: null },
  price: { type: String, default: null },
  royalty: { type: String, default: null },
});

const ChannelSchema = new mongoose.Schema<TelegramGroupChannelInfo>({
  status: {
    type: String,
    enum: [
      TelegramGroupBotMemberRole.adminitstrator,
      TelegramGroupBotMemberRole.left,
      TelegramGroupBotMemberRole.creator,
      TelegramGroupBotMemberRole.kicked,
    ],
    required: true,
  },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  username: { type: String, required: true },
  chatId: { type: Number, required: true },
  canEditMessages: { type: Boolean, required: true },
  autoEditionLinkCreation: {
    type: Boolean,
    default: false,
    required: false,
  }, // TO DO: Think for the future with manual case
});

const UserSchema = new mongoose.Schema<IUser>({
  userId: { type: Number, required: true },
  editionSettings: {
    type: EditionSettingsSchema,
    required: false,
  },
  channels: {
    type: [ChannelSchema],
    required: false,
  },
});

UserSchema.index({ userId: 1 }, { unique: true });

UserSchema.plugin(aggregatePaginate);

export const User = db.model<IUser>(modelName, UserSchema, collectionName);
