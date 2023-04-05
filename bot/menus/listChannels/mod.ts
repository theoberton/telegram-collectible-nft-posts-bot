import {
  MenuTemplate,
  MenuMiddleware,
  createBackMainMenuButtons,
} from "grammy-inline-menu";
import { BotContext } from "/types/mod.ts";
import { BUTTONS } from "/bot/replies.ts";
import { BOT_REPLIES_MAP } from "/bot/replies.ts";

import channelSettingsMenu from "/bot/menus/listChannels/settings.ts";

const listChannelsMenu = new MenuTemplate<BotContext>(
  BOT_REPLIES_MAP.MY_CHANNELS
);

listChannelsMenu.chooseIntoSubmenu(
  "channels",
  async () => {
    const result = await Promise.resolve(["Collectible", "Banditos"]);

    return result;
  },
  channelSettingsMenu,
  {
    buttonText: function personButtonText(_: BotContext, key: string): string {
      console.log("keyffff", key);

      return key;
    },
    columns: 1,
  }
);

listChannelsMenu.manualRow(
  createBackMainMenuButtons<BotContext>(
    BUTTONS.GO_BACK,
    BUTTONS.GO_TO_MAIN_MENU
  )
);

const channelsMiddleware = new MenuMiddleware<BotContext>(
  "/",
  listChannelsMenu
);

console.log(channelsMiddleware.tree());

export default channelsMiddleware;
