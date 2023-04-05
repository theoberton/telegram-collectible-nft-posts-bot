import { TelegramForwardedFromChat } from './bot.ts';

export type EditionParams = {
	price: number | null;
	maxSupply: number | null;
	dateStart: number;
	dateEnd: number;
	royalty: string;
	payoutAddress: string;
};

export type IEdition = {
	channelInfo: TelegramForwardedFromChat;
	messageId: number;
	maxSupply: number | null;
	price: number | null;
	creatorId: number;
	isPublished?: boolean;
	isSetupInProgress?: boolean;
};

export interface PostEditionSettings {
	payoutAddress: string;
	royalty: string;
}