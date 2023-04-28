import { BotContext } from "/src/types/mod.ts";
import { extractChannelUsernameFromDisplayName } from "/src/utils/mod.ts";
import userService from "/src/modules/user/service.ts";

import { MY_CHANNELS_REPLIES_MAP } from "/src/bot/replies.ts";

export const channelLinkCreationHandlers = {
  main,
  set,
  buttonText,
};

function main() {
  return ["crm"];
}

async function set(ctx: BotContext) {
  const channelData = ctx.match?.[1]!;
  const channelUsername = extractChannelUsernameFromDisplayName(channelData);
  const channelQuery = { username: channelUsername };
  const channel = await userService.findChannel(channelQuery);

  await userService.updateChannel(channelQuery, {
    autoEditionLinkCreation: !channel.autoEditionLinkCreation,
  });

  return true;
}

async function buttonText(ctx: BotContext) {
  const channelData = ctx.match?.[1]!;
  const channelUsername = extractChannelUsernameFromDisplayName(channelData);

  const channel = await userService.findChannel({ username: channelUsername });

  const mode = channel.autoEditionLinkCreation
    ? MY_CHANNELS_REPLIES_MAP.EDITION_LINK_CREATION_MODE_AUTO
    : MY_CHANNELS_REPLIES_MAP.EDITION_LINK_CREATION_MODE_MANUAL;

  return `${MY_CHANNELS_REPLIES_MAP.CREATION_MODE}: ${mode}`;
}
