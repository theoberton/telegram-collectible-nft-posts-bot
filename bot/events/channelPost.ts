import { BOT_COMMANDS } from "/types/mod.ts";
import { BOT_REPLIES_MAP } from "/bot/replies.ts";
import { Composer } from "grammy";
import keysConvertionMiddleware from "/bot/middlewares/keys-convertion.ts";

const composer = new Composer();

composer.on('channel_post', (ctx) => {
  console.log("ctx.channelPost", ctx.channelPost);
  // console.log("ctx.forwardMessage", ctx.forwardMessage);
});

export default composer;
