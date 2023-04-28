import { Composer } from "grammy";
import { BotContext } from "/src/types/mod.ts";

import start from "/src/bot/commands/start.ts";

import addChannel from "/src/bot/commands/addchannel.ts";
import listChannels from "/src/bot/commands/listChannels.ts";
import cancel from "/src/bot/commands/cancel.ts";
import posts from "/src/bot/commands/posts.ts";
import support from "/src/bot/commands/support.ts";

const composer = new Composer<BotContext>();

composer.use(start, addChannel, listChannels, posts, support, cancel);

export default composer;
