import { BotContext } from "/src/types/mod.ts";

import userService from "/src/modules/user/service.ts";
import { getShortendDate } from "/src/utils/mod.ts";

import { MY_POSTS_REPLIES_MAP } from "/src/bot/replies.ts";
import { extractChannelData } from "/src/bot/menus/posts/utils.ts";
import postService from "/src/modules/post/service.ts";

export const postsListHandlers = {
  entry,
  main,
  buttonText,
  getTotalPages,
  getCurrentPage,
  setPage,
};

async function entry(ctx: BotContext) {
  const result = await userService.getAllPaginatedPosts({
    userId: ctx.chat?.id!,
    page: ctx.session.page,
  });

  let reply = MY_POSTS_REPLIES_MAP.MANAGE_POSTS;

  if (result.docs.length === 0) {
    reply = MY_POSTS_REPLIES_MAP.NO_NEW_POST_CREATED_IN_THE_CHANNEL;
  }

  return reply;
}

async function main(ctx: BotContext) {
  const result = await userService.getAllPaginatedPosts({
    userId: ctx.chat?.id!,
    page: ctx.session.page,
  });

  return result.docs.map((post) => `${post.channel.chatId}:${post.messageId}`);
}

async function buttonText(_ctx: BotContext, key: string) {
  const channelId = extractChannelData(_ctx, key);
  const channel = await userService.findChannel({ chatId: channelId });

  const [, messageId] = key.split(":"); // Add extract method
  const post = await postService.getPost(Number(messageId), Number(channelId));

  return `${channel.title}, ${getShortendDate(post.date)}`;
}

async function getTotalPages(ctx: BotContext) {
  const result = await userService.getAllPaginatedPosts({
    userId: ctx.chat?.id!,
    page: ctx.session.page,
  });
  return result.totalPages;
}

function getCurrentPage(context: BotContext) {
  return context.session.page;
}

function setPage(context: BotContext, page: number) {
  context.session.page = page;
}
