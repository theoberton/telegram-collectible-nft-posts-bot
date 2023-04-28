import { MenuTemplate } from "grammy-inline-menu";
import { BotContext } from "/src/types/mod.ts";
import { BUTTONS } from "/src/bot/replies.ts";
import removalConfirmationMenu from "/src/bot/menus/list-channels/removal-confirmation.ts";

import { createBackMainMenuButtons } from "/src/utils/mod.ts";

import {
  channelHandlers,
  // channelLinkCreationHandlers,
  channelRemoveHandlers,
} from "/src/bot/menus/list-channels/handlers/mod.ts";

const channelSelectSubMenu = new MenuTemplate<BotContext>(
  channelHandlers.entry
);

// channelSelectSubMenu.select(
//   "cm", // edition link creation mode
//   channelLinkCreationHandlers.main,
//   {
//     showFalseEmoji: false,
//     isSet: () => false,
//     set: channelLinkCreationHandlers.set,
//     buttonText: channelLinkCreationHandlers.buttonText,
//   }
// );

channelSelectSubMenu.chooseIntoSubmenu(
  "rm", // remove
  channelRemoveHandlers.main,
  removalConfirmationMenu,
  {
    buttonText: channelRemoveHandlers.buttonText,
    columns: 1,
  }
);

channelSelectSubMenu.manualRow(
  createBackMainMenuButtons<BotContext>(
    BUTTONS.GO_BACK,
    BUTTONS.GO_TO_MAIN_MENU,
    "/channels/"
  )
);

export default channelSelectSubMenu;
