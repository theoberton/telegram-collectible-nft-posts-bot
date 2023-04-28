import { BotContext, TelegramBotMessage } from "/src/types/mod.ts";
import { DEFAULT_MESSAGE_OPTIONS } from "/src/constants/mod.ts";

import { Composer, InlineKeyboard } from "grammy";
import { composePostEditionLink } from "/src/modules/edition/helpers.ts";

import { MY_POSTS_REPLIES_MAP } from "/src/bot/replies.ts";
import { removeMessageOnceResolved } from "/src/helpers/mod.ts";

import postService from "/src/modules/post/service.ts";
import userService from "/src/modules/user/service.ts";
import editionService from "/src/modules/edition/service.ts";

import editionSettingsSetValidation from "/src/bot/middlewares/validation/edition-settings.ts";

import {
  renameKeysToCamelCase,
  composePixelUrl,
  fromUnixToDate,
} from "/src/utils/mod.ts";

const composer = new Composer<BotContext>();

composer.on(
  "message",
  editionSettingsSetValidation,
  async (ctx: BotContext) => {
    const message: TelegramBotMessage = renameKeysToCamelCase(ctx.message);

    if (message.forwardFromChat) {
      const user = await userService.findUserByChannelId(
        message.forwardFromChat.id
      );

      if (!user || user.userId !== ctx.chat?.id) {
        return ctx.reply(MY_POSTS_REPLIES_MAP.MESSAGE_FROM_INVALID_CHANNEL);
      }

      let post = await postService.getPost(
        message.forwardFromMessageId,
        message.forwardFromChat.id
      );

      if (!post) {
        post = await postService.createPost({
          messageId: message.forwardFromMessageId,
          channelId: message.forwardFromChat.id,
          text: message.text,
          date: fromUnixToDate(message.forwardDate),
        });
      }

      const editionData = {
        userId: user.userId,
        channelId: message.forwardFromChat.id,
        postId: message.forwardFromMessageId,
      };

      const [edition, channel] = await Promise.all([
        editionService.findEdition(editionData),
        userService.findChannel({
          chatId: editionData.channelId,
        }),
      ]);

      if (!edition || !edition.isPublished) {
        const link = await removeMessageOnceResolved(
          () => composePostEditionLink(editionData),
          ctx,
          MY_POSTS_REPLIES_MAP.EDITION_LINK_IS_GENERATING
        );

        await ctx.reply(
          MY_POSTS_REPLIES_MAP.READY_TO_DEPLOY_EDITION(post, channel),
          {
            ...DEFAULT_MESSAGE_OPTIONS,
            reply_markup: new InlineKeyboard().url(
              MY_POSTS_REPLIES_MAP.CREATE_EDITION_BUTTON,
              link
            ),
          }
        );
      } else if (edition.isPublished) {
        const pixelLink = composePixelUrl(edition.address);

        const inlineKeyboard = new InlineKeyboard().url(
          MY_POSTS_REPLIES_MAP.VIEW_EDITION,
          pixelLink
        );

        await ctx.reply(MY_POSTS_REPLIES_MAP.EDITION_HAS_ALREADY_BEEN_CREATED, {
          reply_markup: inlineKeyboard,
        });
      }
    }
  }
);

export default composer;
