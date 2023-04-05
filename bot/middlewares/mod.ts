import { Composer } from "grammy";
import { BotContext } from "/types/mod.ts";

import session from "/bot/middlewares/session.ts";
import conversation from "/bot/middlewares/conversation.ts";
import menu from "/bot/middlewares/menu.ts";

const composer = new Composer<BotContext>();

composer.use(session, conversation, menu);

export default composer;
