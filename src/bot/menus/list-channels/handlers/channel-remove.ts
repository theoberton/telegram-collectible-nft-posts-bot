import { MY_CHANNELS_REPLIES_MAP } from "/src/bot/replies.ts";

export const channelRemoveHandlers = {
  main,
  buttonText,
};

function main() {
  return ["rm"];
}

function buttonText() {
  return MY_CHANNELS_REPLIES_MAP.REMOVE_CHANNEL;
}
