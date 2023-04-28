import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import db from "/src/db/index.ts";
import { IPost } from "/src/types/mod.ts";

const modelName = "Post";
const collectionName = "posts";

const PostSchema = new mongoose.Schema<IPost>({
  text: { type: String, default: "", required: false },
  messageId: { type: Number, required: true },
  channelId: { type: Number, required: true },
  date: { type: Date, required: true },
});

PostSchema.plugin(aggregatePaginate);

PostSchema.index({ channelId: 1, messageId: 1 }, { unique: true });

export const Post = db.model<IPost>(modelName, PostSchema, collectionName);
