import mongoose from "mongoose";

import db from "/src/db/index.ts";
import { IEdition } from "/src/types/mod.ts";

const modelName = "Edition";
const collectionName = "editions";

const EditionSchema = new mongoose.Schema<IEdition>({
  id: { type: String },
  title: { type: String, default: "", required: false },
  channelId: { type: Number, required: true },
  messageId: { type: Number, required: true },
  price: { type: Number, required: true },
  royalty: { type: Number, required: true },
  address: { type: String, default: null, required: false },
  mintLink: { type: String, default: null, required: false },
  isButtonShown: { type: Boolean, default: true },
  isMintCounterShown: { type: Boolean, default: true },
  payoutAddress: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  userId: { type: Number, required: true },
});

export default db.model<IEdition>(modelName, EditionSchema, collectionName);
