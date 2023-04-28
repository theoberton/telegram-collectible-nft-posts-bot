import { composeMintTitle } from "/src/utils/mod.ts";
import { BotContext } from "/src/types/mod.ts";

import { MY_POSTS_REPLIES_MAP, BUTTONS } from "/src/bot/replies.ts";
import editionService from "/src/modules/edition/service.ts";
import { extractPostData } from "/src/bot/menus/posts/utils.ts";
import { getFullNftCollectionData } from "/src/helpers/transaction/mod.ts";

export const postEditionCounterControlHandlers = {
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

  return ["ctr-vsblt"];
}

async function set(ctx: BotContext) {
  const editionData = extractPostData(ctx);
  const edition = await editionService.findEdition(editionData);

  if (!edition) {
    throw new Error("Should exit set");
  }
  const updatedMintCountButton = !edition?.isMintCounterShown;

  await editionService.updateEdition(
    {
      ...editionData,
      messageId: editionData.postId,
    },
    {
      isMintCounterShown: updatedMintCountButton,
    }
  );

  const updatedEdition = await editionService.findEdition(editionData);

  const data = await getFullNftCollectionData(edition.address);

  const mintTitle = composeMintTitle(
    updatedEdition!,
    data.collectionData.nextItemIndex
  );

  if (edition.isButtonShown) {
    await ctx.api.editMessageReplyMarkup(edition.channelId, edition.messageId, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: mintTitle,
              url: edition.mintLink!,
            },
          ],
        ],
      },
    });
  }

  return true;
}

async function buttonText(ctx: BotContext) {
  const editionData = extractPostData(ctx);
  const edition = await editionService.findEdition(editionData);

  if (!edition) {
    throw new Error("Should exit buttonText");
  }

  const mode = edition.isMintCounterShown ? BUTTONS.ON : BUTTONS.OFF;

  return `${MY_POSTS_REPLIES_MAP.EDITION_MINT_COUNT_VISIBILITY}: ${mode}`;
}
