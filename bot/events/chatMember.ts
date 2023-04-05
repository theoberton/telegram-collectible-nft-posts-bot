import { BOT_COMMANDS, TelegramChatMember } from "/types/mod.ts";
import { BOT_REPLIES_MAP } from "/bot/replies.ts";
import { Composer } from "grammy";
import keysConvertionMiddleware from "/bot/middlewares/keys-convertion.ts";

const composer = new Composer();

composer.on(
  "my_chat_member",
  // keysConvertionMiddleware("myChatMember"),
  (ctx) => {
    const chatMember = ctx.myChatMember;
    console.log("chatMember", chatMember);

    return;
  }
);

export default composer;
