import { MenuTemplate } from "grammy-inline-menu";
import { BotContext } from "/src/types/mod.ts";

import channelSettingsMenu from "/src/bot/menus/list-channels/settings.ts";

import { channelListHandlers } from "/src/bot/menus/list-channels/handlers/mod.ts";

export const channelsList = new MenuTemplate<BotContext>(
  channelListHandlers.entry
);

channelsList.chooseIntoSubmenu(
  "",
  channelListHandlers.main,
  channelSettingsMenu,
  {
    columns: 1,
  }
);
