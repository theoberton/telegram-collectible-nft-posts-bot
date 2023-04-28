import {
  TelegramChannelPost,
  TelegramChannelPostUpdate,
} from "/src/types/mod.ts";
import { renameKeysToCamelCase } from "/src/utils/mod.ts";
import { Composer } from "grammy";
import postService from "/src/modules/post/service.ts";
import { fromUnixToDate } from "/src/utils/mod.ts";
import { BotContext } from "/src/types/mod.ts";

const composer = new Composer<BotContext>();

composer.on("channel_post", (ctx) => {
  const channelPost: TelegramChannelPost = renameKeysToCamelCase(
    ctx.channelPost
  );

  return postService.createPost({
    messageId: channelPost.messageId,
    channelId: channelPost.chat.id,
    text: channelPost.text || channelPost.caption,
    date: fromUnixToDate(channelPost.date),
  });
});

composer.on("edited_channel_post", (ctx) => {
  const channelPost: TelegramChannelPostUpdate = renameKeysToCamelCase(
    ctx.update
  );

  return postService.updatePost(
    channelPost.editedChannelPost.messageId,
    channelPost.editedChannelPost.chat.id,
    {
      text: channelPost.editedChannelPost.text,
      date: fromUnixToDate(channelPost.editedChannelPost.date),
    }
  );
});

export default composer;
