import { BotContext } from "/src/types/mod.ts";

export function extractPostData(ctx: BotContext) {
  const postData = ctx.match?.[1]!;
  const [channelId, postId] = postData.split(":");

  return {
    channelId: Number(channelId),
    postId: Number(postId),
    userId: ctx.chat?.id!,
  };
}

export function extractChannelData(_ctx: BotContext, key: string) {
  const [channelId] = key.split(":");

  return Number(channelId);
}
