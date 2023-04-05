import { MenuTemplate, createBackMainMenuButtons } from "grammy-inline-menu";
import { BotContext } from "/types/mod.ts";
import { BUTTONS } from "/bot/replies.ts";
import { MY_CHANNELS_REPLIES_MAP } from "/bot/replies.ts";
import removalConfirmationMenu from "/bot/menus/listChannels/removalConfirmation.ts";

const channelSelectSubMenu = new MenuTemplate<BotContext>(
  () => MY_CHANNELS_REPLIES_MAP.MANAGE_SETTINGS
);

let vall = false;

channelSelectSubMenu.select(
  "creation-mode",
  [MY_CHANNELS_REPLIES_MAP.CREATION_MODE],
  {
    showFalseEmoji: false,
    isSet: () => false,
    set: (_context: BotContext, key: string) => {
      console.log("key", key);
      vall = !vall;
      return true;
    },
    buttonText: () => {
      const mode = vall
        ? MY_CHANNELS_REPLIES_MAP.CREATION_MODE_AUTO
        : MY_CHANNELS_REPLIES_MAP.CREATION_MODE_MANUAL;

      return `${MY_CHANNELS_REPLIES_MAP.CREATION_MODE}: ${mode}`;
    },
  }
);

channelSelectSubMenu.chooseIntoSubmenu(
  "removal",
  () => {
    return [MY_CHANNELS_REPLIES_MAP.REMOVE_CHANNEL];
  },
  removalConfirmationMenu,
  {
    buttonText: function personButtonText(_: BotContext, key: string): string {
      console.log("keyffff", key);

      return key;
    },
    columns: 1,
  }
);

channelSelectSubMenu.manualRow(
  createBackMainMenuButtons<BotContext>(
    BUTTONS.GO_BACK,
    BUTTONS.GO_TO_MAIN_MENU
  )
);

export default channelSelectSubMenu;
