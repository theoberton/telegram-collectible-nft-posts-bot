import { MY_CHANNELS_REPLIES_MAP } from "/src/bot/replies.ts";

export const channelHandlers = {
  entry,
};

function entry() {
  return MY_CHANNELS_REPLIES_MAP.MANAGE_SETTINGS;
}
