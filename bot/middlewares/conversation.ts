import { Composer } from "grammy";
import { BotContext } from "/types/mod.ts";

import {
  type Conversation,
  conversations,
  createConversation,
} from "grammy-conversation";

const composer = new Composer<BotContext>();

type MyConversation = Conversation<BotContext>;

async function greeting(conversation: MyConversation, ctx: BotContext) {
  await ctx.reply("Hi there! What is your name?");
  const { message } = await conversation.wait();
  await ctx.reply(`Welcome to the chat, ${message.text}!`);
}

composer.use(conversations());
composer.use(createConversation(greeting));

composer.command("testConversaction", async (ctx) => {
  // enter the function "greeting" you declared
  await ctx.conversation.enter("greeting");
});

export default composer;
