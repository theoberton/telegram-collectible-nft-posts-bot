import { MenuTemplate } from "grammy-inline-menu";
import { BotContext } from "/src/types/mod.ts";

import { channelsList } from "/src/bot/menus/list-channels/mod.ts";
import { postsList } from "/src/bot/menus/posts/mod.ts";

const menu = new MenuTemplate<BotContext>(() => "Main");

menu.submenu(() => "Channels", "channels", channelsList);
menu.submenu(() => "Post", "posts", postsList);

export default menu;
