import ChannelPostListener from '/bot/events/channelPost.ts';
import ChatMemberListener from '/bot/events/chatMember.ts';

import { Composer } from "grammy";

const composer = new Composer();

composer.use(ChannelPostListener, ChatMemberListener);

export default composer;
