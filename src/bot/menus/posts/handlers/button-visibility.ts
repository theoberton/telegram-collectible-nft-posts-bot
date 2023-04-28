import { BotContext } from "/src/types/mod.ts";

import { composeMintTitle } from "/src/utils/mod.ts";
import { MY_POSTS_REPLIES_MAP, BUTTONS } from "/src/bot/replies.ts";
import editionService from "/src/modules/edition/service.ts";
import { extractPostData } from "/src/bot/menus/posts/utils.ts";
import { getFullNftCollectionData } from "/src/helpers/transaction/mod.ts";

export const postButtonControlHandlers = {
  main,
  set,
  buttonText,
};

async function main(ctx: BotContext) {
  const editionData = extractPostData(ctx);

  const edition = await editionService.findEdition(editionData);

  if (!edition?.isPublished) {
    return [];
  }

  return ["edtn-vsblt"];
}

async function set(ctx: BotContext) {
  const editionData = extractPostData(ctx);
  const edition = await editionService.findEdition(editionData);

  if (!edition) {
    throw new Error("Should exit set");
  }

  const updatedIsButtonShown = !edition?.isButtonShown;

  await editionService.updateEdition(
    {
      ...editionData,
      messageId: editionData.postId,
    },
    {
      isButtonShown: updatedIsButtonShown,
    }
  );

  const data = await getFullNftCollectionData(edition.address);

  const updateEdition = await editionService.findEdition(editionData);
  const mintTitle = composeMintTitle(
    updateEdition!,
    data.collectionData.nextItemIndex
  );

  await ctx.api.editMessageReplyMarkup(edition.channelId, edition.messageId, {
    reply_markup: {
      inline_keyboard: [
        updatedIsButtonShown
          ? [
              {
                text: mintTitle,
                url: updateEdition?.mintLink!,
              },
            ]
          : [],
      ],
    },
  });

  return true;
}

async function buttonText(ctx: BotContext) {
  const editionData = extractPostData(ctx);
  const edition = await editionService.findEdition(editionData);

  if (!edition?.isPublished) {
    throw new Error("Should exit buttonText");
  }

  const mode = edition.isButtonShown ? BUTTONS.ON : BUTTONS.OFF;

  return `${MY_POSTS_REPLIES_MAP.EDITION_VISIBILITY}: ${mode}`;
}
