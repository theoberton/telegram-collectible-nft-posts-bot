import { IUserData, TelegramGroupChannelInfo } from "/src/types/mod.ts";

export type EditionParams = {
  data: {
    price: string;
    royalty: string;
    payoutAddress: string;
  };
  channel: TelegramGroupChannelInfo;
  postId: number;
  editionId: string;
};

export type EditionData = {
  userId: number;
  channelId: number;
  postId: number;
};

export type EditionButtonData = {
  text?: string;
  url?: string;
};

export interface IEdition {
  id: string;
  title: string;
  channelId: number;
  messageId: number;
  price: number;
  payoutAddress: string;
  isMintCounterShown: boolean;
  royalty: number;
  userId: number;
  isPublished: boolean;
  address: string;
  isButtonShown: boolean;
  mintLink?: string;
}
export type EditionQuery =
  | {
      channelId: number;
      userId: number;
      postId?: number;
      messageId?: number;
    }
  | { _id: string }; // TO DO: remap

export interface IEditionFull extends IEdition {
  user: IUserData;
}

export interface PostEditionSettings {
  buttonName?: string;
  price?: string;
  payoutAddress?: string;
  royalty?: string;
}
