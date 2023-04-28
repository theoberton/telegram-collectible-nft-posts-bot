import userService from "/src/modules/user/service.ts";
import { BOT_REPLIES_MAP } from "/src/bot/replies.ts";
import { BotContext } from "/src/types/mod.ts";
import { DEFAULT_MESSAGE_OPTIONS } from "/src/constants/mod.ts";

export const channelListHandlers = {
  entry,
  main,
};

async function entry(ctx: BotContext) {
  const user = await userService.findUser(ctx.chat?.id!);

  if (user?.channels.length === 0) {
    return {
      text: BOT_REPLIES_MAP.NO_CHANNELS_EXIST,
      ...DEFAULT_MESSAGE_OPTIONS
    };
  } else {
    return BOT_REPLIES_MAP.MY_CHANNELS;
  }
}

async function main(ctx: BotContext) {
  const { channels } = await userService.findUser(ctx.chat?.id!);

  return channels.map((channel) => `${channel.title} (@${channel.username})`);
}
