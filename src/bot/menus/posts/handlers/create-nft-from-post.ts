import { BotContext, TRANSACTION_REQUEST } from "/src/types/mod.ts";
import { InlineKeyboard } from "grammy";

import { DEFAULT_MESSAGE_OPTIONS } from "/src/constants/mod.ts";
import { extractPostData } from "/src/bot/menus/posts/utils.ts";
import editionService from "/src/modules/edition/service.ts";
import { MY_POSTS_REPLIES_MAP } from "/src/bot/replies.ts";
import { composePostEditionLink } from "/src/modules/edition/helpers.ts";

import transactionRequestService from "/src/modules/transaction-request/service.ts";
import { removeMessageOnceResolved } from "/src/helpers/mod.ts";
import postService from "/src/modules/post/service.ts";
import userService from "/src/modules/user/service.ts";

export const createNFTFromPostControlHandlers = {
  main,
  set,
  buttonText,
};

const path = "edtn";

async function main(ctx: BotContext) {
  const editionData = extractPostData(ctx);

  const edition = await editionService.findEdition(editionData);

  if (!edition) {
    return [path];
  }

  const transactionRequest =
    await transactionRequestService.getEditionLatestTransactionRequest({
      editionId: edition.id,
      type: TRANSACTION_REQUEST.EDITION,
    });

  if (transactionRequest && !edition?.isPublished) {
    return [path];
  }

  return [];
}

async function set(ctx: BotContext) {
  const editionData = extractPostData(ctx);

  const [edition, post, channel] = await Promise.all([
    editionService.findEdition(editionData),
    postService.getPost(editionData.postId, editionData.channelId),
    userService.findChannel({
      chatId: editionData.channelId,
    }),
  ]);

  if (!edition) {
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

    return true;
  }

  const transactionRequest =
    await transactionRequestService.getEditionLatestTransactionRequest({
      editionId: edition.id,
      type: TRANSACTION_REQUEST.EDITION,
    });

  if (transactionRequest && !edition?.isPublished) {
    const link = await removeMessageOnceResolved(
      () => composePostEditionLink(editionData),
      ctx,
      MY_POSTS_REPLIES_MAP.EDITION_LINK_IS_GENERATING
    );

    await ctx.reply(MY_POSTS_REPLIES_MAP.EDITION_LINK_IS_CREATED(link));
  }

  return true;
}

async function buttonText(ctx: BotContext) {
  const editionData = extractPostData(ctx);

  const edition = await editionService.findEdition(editionData);

  if (!edition) {
    return MY_POSTS_REPLIES_MAP.CREATE_EDITION_OUT_OF_POST;
  }

  const transactionRequest =
    await transactionRequestService.getEditionLatestTransactionRequest({
      editionId: edition.id,
      type: TRANSACTION_REQUEST.EDITION,
    });

  if (transactionRequest && !edition?.isPublished) {
    return MY_POSTS_REPLIES_MAP.RESEND_EDITION_CREATION_LINK;
  }

  return "";
}
