import { Composer } from "grammy";

import start from '/bot/commands/start.ts';

import addChannel from '/bot/commands/addchannel.ts';
import listChannels from '/bot/commands/listChannels.ts';
import removeChannel from '/bot/commands/removeChannel.ts';

const composer = new Composer();

composer.use(
  start,
  addChannel,
  listChannels,
  removeChannel,
)

export default composer;