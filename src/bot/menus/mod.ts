import Menu from "/src/bot/menus/menu.ts";
import { MenuMiddleware } from "grammy-inline-menu";
import { BotContext } from "/src/types/mod.ts";

export const menu: any = new MenuMiddleware<BotContext>("/", Menu);

export default menu;
