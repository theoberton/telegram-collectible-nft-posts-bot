import { Composer } from "grammy";
import { BotContext } from "/src/types/mod.ts";

import session from "/src/bot/middlewares/session.ts";
import conversation from "/src/bot/middlewares/conversation.ts";
import menu from "/src/bot/middlewares/menu.ts";

const composer = new Composer<BotContext>();

composer.use(session, conversation, menu);

export default composer;
