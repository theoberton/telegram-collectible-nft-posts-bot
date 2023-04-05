export const TELEGRAM_HOST = "https://api.telegram.org";

export const BOT_REPLIES_MAP = {
  SOMETHING_WRONG_HAPPENED:
    "⚠️ Sorry, but I couldn't complete this action, please try again or wait for sometime ⚠️",
  NOT_FOUND_COMMAND: "Sorry, I don't know such command, please try again",
  ADD_CHANNEL: `Add @pixel_collectible_posts_bot to admins and forward me any message from your channel.`,
  MY_CHANNELS: `Choose a channel to change settings`,
  START: `
	I can help you manage Telegram channels by creating collectible NFT edtions out of your posts 

	You can control me by sending these commands:
	
	/addchannel - add a new channel
	/mychannels - edit your channels
	
	/settings - other settings
	`,
  ADD_NEW_BOT: `
	Connecting a bot

	To connect a bot, you should follow these two steps:
	
	1. Open @BotFather and create a new bot.
	2. You'll get a token (e.g. 12345:6789ABCDEF) — just forward or copy-paste it to me.
	
	Warning! Don't connect bots already used by other services like Chatfuel, Manybot, ect.
	`,
  ADD_NEW_BOT_TOKEN_SENT: (botNickname: string) => `
	Adding a channel

	To add a channel you should follow these two steps:
	
	1. Add @${botNickname} to admins of your channel.
	2. Then forward to me any message from your channel (you can also send me its username or ID).
	`,
  WRONG_TOKEN:
    "I dont know any bots that identifies himself as this. Please send me the token of your bot",
  ADD_CHANNEL_FORWARD_MESSAGE: (botUsername: string) => `
	Adding a channel

	To add a channel you should follow these two steps:
	
	1. Add @${botUsername} to admins of your channel.
	2. Then forward to me any message from your channel
	`,
  PLEASE_FORWARD_MESSAGE_FROM_BOT_CHANNEL:
    "Please, forward messaage channel where the bot is admin",
  BOT_CHANNEL_VALIDATOIN_SUCCESSFULL: (botUsername: string) => `
	Success! The channel Obertontest has been added.

	Go to @${botUsername} to start creating you mintable posts edtions 🚀
	`,
  BOT_NOT_ADDED_AS_ADMIN: `Sorry it seems that you bot is not added to admins, check it again please`,
  THERE_IS_NO_ACTIVE_COMMAND: `Sorry, there no active command so I dont know what are you referning to, please use the one provided via menu`,
  SEND_POST_REQUEST: `Please, send me a post from a channel I you manage that is to that's going to be turned into edition 🪄`,
  CREATE_NFT_EDITION_LINK_SENT:
    "Click the link to create NFT edition (valid for 3 minutes, Tonkeeper wallet supported only)",
  INVALID_ROYALTY_VALUE_SEND: "You must enter royalty between 0 and 100",
  ENTER_ROYALTY_VALUE: "Please, enter royalty value",
  ASK_FOR_PAYOUT_ADDRESS: "Send your payout address",
  INVALID_PAYOUT_ADDRESS_PROVIDED: "Invalid payout address provided. Try again",
  BOT_NOT_ASSIGNED_TO_USER:
    "Sorry I dont know you. If you are my owner use the account who did create me",
  WRONG_CHANNEL_FORWARDED_MESSAGE: `I don't manage the channel of that message, please send me the message from the one I know`,
  ASK_MINT_PRICE_OF_EDITION:
    "What is going to be the mint price of your edition?",
  ASK_SUPPLY_AMOUNT_OF_EDITION: `
		What is going to be the the size of you edition?
		Enter the number or type Unlimited (use the keyboard button for your comfort)
	`,
  NO_ACTIVE_COMMAND: `There is no active command, please use commands from your menu to make me do something`,
  INVALID_MINT_PRICE_PROVIDED:
    "This doesn't seem to be number, please enter any number",
  THIS_POST_IS_ALREADY_MITABLE: "This post is already a mintable NFT edition",
};

export const MY_CHANNELS_REPLIES_MAP = {
  CHANNEL_REMOVED: "Channel has been removed",
  CHANNEL_REMOVAL_CONFIRMATION: `Are you sure you want to remove this chanel?`,
  REMOVE_CHANNEL: `Remove channel`,
  CREATION_MODE: `Creation mode`,
  MANAGE_SETTINGS: `Manage settings`,
  CREATION_MODE_AUTO: "Auto",
  CREATION_MODE_MANUAL: "Manual",
};

export const BUTTONS = {
  GO_BACK: "« Back",
  GO_TO_MAIN_MENU: "Main menu",
  YES: "Yes",
  NO: "No",
};
