import { Composer } from "grammy";

import listChannels from '/bot/menus/listChannels/mod.ts';

const composer = new Composer();

composer.use(listChannels.middleware());

export default composer;
