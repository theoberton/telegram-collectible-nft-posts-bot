import { MenuTemplate } from "grammy-inline-menu";
import { BotContext } from "/src/types/mod.ts";

import postSettingsMenu from "/src/bot/menus/posts/settings.ts";

import { postsListHandlers } from "/src/bot/menus/posts/handlers/mod.ts";

export const postsList = new MenuTemplate<BotContext>(postsListHandlers.entry);

postsList.chooseIntoSubmenu("", postsListHandlers.main, postSettingsMenu, {
  buttonText: postsListHandlers.buttonText,
  columns: 1,
});

postsList.pagination("", {
  getTotalPages: postsListHandlers.getTotalPages,
  getCurrentPage: postsListHandlers.getCurrentPage,
  setPage: postsListHandlers.setPage,
});
