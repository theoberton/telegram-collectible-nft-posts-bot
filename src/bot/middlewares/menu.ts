import { Composer } from "grammy";

import menuMiddleware from "/src/bot/menus/mod.ts";

const composer = new Composer();

composer.use(menuMiddleware.middleware());

export default composer;
