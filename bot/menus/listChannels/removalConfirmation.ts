import { MenuTemplate } from "grammy-inline-menu";
import { BotContext } from "/types/mod.ts";
import { BUTTONS } from "/bot/replies.ts";
import { MY_CHANNELS_REPLIES_MAP } from "/bot/replies.ts";

const removeSelectSubMenu = new MenuTemplate<BotContext>(
  (): string => MY_CHANNELS_REPLIES_MAP.CHANNEL_REMOVAL_CONFIRMATION
);

removeSelectSubMenu.select("desicion", [BUTTONS.YES, BUTTONS.NO], {
  showFalseEmoji: false,
  isSet: () => false,
  set: async (ctx: BotContext, key: string) => {
    if (key === BUTTONS.YES) {
      await ctx.answerCallbackQuery({
        text: MY_CHANNELS_REPLIES_MAP.CHANNEL_REMOVED,
      });
      return "/";
    }

    if (key === BUTTONS.NO) {
      return "..";
    }
  },
});

export default removeSelectSubMenu;
