import { BotContext } from "/src/types/mod.ts";

import { composePixelUrl, composePostUrl } from "/src/utils/mod.ts";
import editionService from "/src/modules/edition/service.ts";
import { extractPostData } from "/src/bot/menus/posts/utils.ts";
import { MY_POSTS_REPLIES_MAP } from "/src/bot/replies.ts";

import userService from "/src/modules/user/service.ts";

export const postViewEditionHandlers = {
  main,
  link,
};

async function main(ctx: BotContext) {
  const editionData = extractPostData(ctx);

  const edition = await editionService.findEdition(editionData);

  if (!edition?.isPublished) {
    return MY_POSTS_REPLIES_MAP.GO_TO_POST;
  }

  return MY_POSTS_REPLIES_MAP.VIEW_EDITION;
}

async function link(ctx: BotContext) {
  const editionData = extractPostData(ctx);
  const edition = await editionService.findEdition(editionData);
  const channel = await userService.findChannel({
    chatId: editionData.channelId,
  });

  let link;

  if (!edition?.isPublished) {
    link = composePostUrl(channel.username, editionData.postId);
    console.log('link isPublished', link)
  } else {
    link = composePixelUrl(edition.address);
    console.log('link is not Published', link)
  }

  return link;
}
