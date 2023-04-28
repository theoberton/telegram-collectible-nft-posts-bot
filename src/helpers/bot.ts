import { BotContext } from "/src/types/mod.ts";
import { Api, Bot, RawApi } from "grammy";
import { logger } from "/src/utils/mod.ts";

export const updatePostButton = async (
  bot: Bot<BotContext, Api<RawApi>>,
  {
    channelId,
    messageId,
    title,
    link,
  }: {
    channelId: number;
    messageId: number;
    title: string;
    link: string;
  }
) => {
  try {
    await bot.api.editMessageReplyMarkup(channelId, messageId, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: title,
              url: link,
            },
          ],
        ],
      },
    });
  } catch (error) {
    logger.error("Failed to update post");

    logger.error(error);
  }
};
