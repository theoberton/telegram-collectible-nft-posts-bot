import { MenuTemplate } from "grammy-inline-menu";
import { BotContext } from "/src/types/mod.ts";
import { BUTTONS } from "/src/bot/replies.ts";
import { createBackMainMenuButtons } from "/src/utils/mod.ts";

import {
  createNFTFromPostControlHandlers,
  postButtonControlHandlers,
  postSettingsHandlers,
  postEditionCounterControlHandlers,
  postViewEditionHandlers,
} from "/src/bot/menus/posts/handlers/mod.ts";

const postSettingsMenu = new MenuTemplate<BotContext>(
  postSettingsHandlers.entry
);

postSettingsMenu.select(
  "clct-btn-vsbl", // collect button visibility
  postButtonControlHandlers.main,
  {
    showFalseEmoji: false,
    isSet: () => false,
    set: postButtonControlHandlers.set,
    buttonText: postButtonControlHandlers.buttonText,
  }
);
postSettingsMenu.select(
  "cntefp", // create-nft-edition-from-post
  createNFTFromPostControlHandlers.main,
  {
    showFalseEmoji: false,
    isSet: () => false,
    set: createNFTFromPostControlHandlers.set,
    buttonText: createNFTFromPostControlHandlers.buttonText,
  }
);
postSettingsMenu.select(
  "cntr-btn-vsbl", // collect button mint counter visibility
  postEditionCounterControlHandlers.main,
  {
    showFalseEmoji: false,
    isSet: () => false,
    set: postEditionCounterControlHandlers.set,
    buttonText: postEditionCounterControlHandlers.buttonText,
  }
);

postSettingsMenu.url(
  postViewEditionHandlers.main,
  postViewEditionHandlers.link
);

postSettingsMenu.manualRow(
  createBackMainMenuButtons(BUTTONS.GO_BACK, BUTTONS.GO_TO_MAIN_MENU, "/posts/")
);

export default postSettingsMenu;
