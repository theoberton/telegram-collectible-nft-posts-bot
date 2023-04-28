export function getChannelId(channelId: number) {
  const channel = String(channelId);
  // -100 is for public chats
  return channel.startsWith("-100") ? Number(channel.slice(4)) : channelId;
}

export function isPublicChannel(channelId: number) {
  const channel = String(channelId);

  return Boolean(channel.startsWith("-100"));
}

export const isCommand = (message?: string) => {
  if (message === "" || !message) return false;

  return message.startsWith("/");
};

export const composeTextMessage = (text: string) => {
  return {
    text: text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
};
