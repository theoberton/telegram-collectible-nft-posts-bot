import { BotContext } from "/src/types/mod.ts";

import postService from "/src/modules/post/service.ts";
import userService from "/src/modules/user/service.ts";

import { MY_POSTS_REPLIES_MAP } from "/src/bot/replies.ts";
import { extractPostData } from "/src/bot/menus/posts/utils.ts";
import { composeTextMessage } from "/src/utils/mod.ts";

export const postSettingsHandlers = {
  entry: postSetting,
  main: postList,
};

async function postSetting(ctx: BotContext) {
  const { channelId, postId } = extractPostData(ctx);
  const post = await postService.getPost(Number(postId), Number(channelId));
  const channel = await userService.findChannel({
    chatId: Number(channelId),
  });

  const text = MY_POSTS_REPLIES_MAP.POST_SETTINGS(post, channel);

  return composeTextMessage(text);
}

async function postList(ctx: BotContext) {
  const result = await userService.getAllPaginatedPosts({
    userId: ctx.chat?.id!,
    page: ctx.session.page,
  });

  return result.docs.map((post) => `${post.channel.chatId}:${post.messageId}`);
}
