import { BotContext } from "/src/types/mod.ts";
import { BUTTONS } from "/src/bot/replies.ts";
import { MY_CHANNELS_REPLIES_MAP } from "/src/bot/replies.ts";
import userService from "/src/modules/user/service.ts";
import { extractChannelUsernameFromDisplayName } from "/src/utils/mod.ts";

export const removeConfirmationHandlers = {
  entry,
  main,
  set,
  buttonText,
};

function entry() {
  return MY_CHANNELS_REPLIES_MAP.CHANNEL_REMOVAL_CONFIRMATION;
}

async function set(ctx: BotContext, key: string) {
  if (key === BUTTONS.YES) {
    const channelData = ctx.match?.[1]!;
    const channelUsername = extractChannelUsernameFromDisplayName(channelData);

    const { channels } = await userService.findUserUserByChannelUsername(
      channelUsername
    );

    const channel = channels.find(
      (channel) => channel.username === channelUsername
    );

    await Promise.all([
      ctx.api.leaveChat(channel?.chatId!),
      userService.deleteUserChannel(channel?.chatId!),
      ctx.answerCallbackQuery({
        text: MY_CHANNELS_REPLIES_MAP.CHANNEL_REMOVED,
      }),
    ]);

    return "/channels/";
  }

  if (key === BUTTONS.NO) {
    return "..";
  }

  return "";
}

function buttonText() {}

function main() {}
