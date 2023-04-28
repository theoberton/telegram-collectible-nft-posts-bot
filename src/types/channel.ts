interface ChennelChatIdQuery {
  chatId: number;
}
interface ChennelUsernameQuery {
  username: string;
}

export type ChannelQuery = ChennelChatIdQuery | ChennelUsernameQuery;
