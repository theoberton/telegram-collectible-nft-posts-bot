import { BotContext } from "/src/types/mod.ts";

import ChannelPostListener from "/src/bot/events/channelPost.ts";
import ChatMemberListener from "/src/bot/events/chatMember/mod.ts";
import MessageListener from "/src/bot/events/message.ts";

import { Composer } from "grammy";

const composer = new Composer<BotContext>();

composer.use(ChannelPostListener, ChatMemberListener, MessageListener);

export default composer;
