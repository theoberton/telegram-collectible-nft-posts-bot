import { MenuTemplate } from "grammy-inline-menu";
import { BotContext } from "/src/types/mod.ts";
import { BUTTONS } from "/src/bot/replies.ts";
import { removeConfirmationHandlers } from "/src/bot/menus/list-channels/handlers/mod.ts";

const removeSelectSubMenu = new MenuTemplate<BotContext>(
  removeConfirmationHandlers.entry
);

removeSelectSubMenu.select("decide", [BUTTONS.YES, BUTTONS.NO], {
  showFalseEmoji: false,
  isSet: () => false,
  set: removeConfirmationHandlers.set,
});

export default removeSelectSubMenu;
