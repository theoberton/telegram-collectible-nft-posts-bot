import {
  IPostData,
  TelegramGroupChannelInfo,
  BOT_COMMANDS,
} from "/src/types/mod.ts";
import {
  getShortendDate,
  toBoldAndItalic,
  createLinkText,
} from "/src/utils/mod.ts";

export const TELEGRAM_HOST = "https://api.telegram.org";

export const BOT_REPLIES_MAP = {
  REMOVED_FROM_CHANNEL: (channelName: string) =>
    `Channel ${toBoldAndItalic(channelName)} has been removed`,
  HELP: `
  This is Collectible post-NFTs bot from ${createLinkText(
    `https://pi.oberton.io/`,
    "3.14xl"
  )}
  I can help you turn posts in your Telegram channels into collectible NFTs\n\nUse these commands to work with me:

  /${BOT_COMMANDS.MY_CHANNELS} - view and edit your channels
  /${BOT_COMMANDS.LIST_POSTS} - view and manage posts
  /${BOT_COMMANDS.EDITION_SETTINGS} - set post NFT edition attributes
  `,
  OPERATION_CANCELED: "Current command is canceled",
  CHANNEL_HAS_BEEN_SUCCESSFULLY_ADDED: (channelName: string) =>
    `Channel ${toBoldAndItalic(
      channelName
    )} has successfully been added\nYou can look though the list of your channels by using /mychannels`,
  SETUP_EDITION_SETTINGS: `Now setup /${BOT_COMMANDS.EDITION_SETTINGS} in order to create your first NFT-post`,
  NEED_POST_EDIT_PERMISSION_TO_START_WORKING: `"${toBoldAndItalic(
    "Edit Messages"
  )}" permission needs to be given to the bot\nUpdate it to make the bot work properly`,
  SOMETHING_WRONG_HAPPENED:
    "⚠️ Sorry, but I couldn't complete this action, please try again or wait for sometime ⚠️",
  NOT_FOUND_COMMAND: "Sorry, I don't know such command, please try again",
  ADD_CHANNEL: `Add @pixel_collectible_posts_bot to admins with ${toBoldAndItalic(
    "Edit Messages"
  )} permission (the only permission required)`,
  SUPPORT: `Got any question or issue regarding how the bot works?\nAsk technical Support: https://t.me/obertondev`,
  MY_CHANNELS: `Choose a channel to manage`,
  NO_CHANNELS_EXIST: `${toBoldAndItalic("No channels added")}\n\nUse /${
    BOT_COMMANDS.ADD_CHANNEL
  }  to add one`,
  SETUP_EDTION_SETTINGS: `Setup edition settings using /${BOT_COMMANDS.EDITION_SETTINGS} to start creating NFT posts`,
  START: `
	Hi!
I can help you turn posts in your Telegram channels into collectible NFTs\n\nYou can control me by sending these commands:

/${BOT_COMMANDS.MY_CHANNELS} - view and edit your channels
/${BOT_COMMANDS.LIST_POSTS} - view and manage posts
/${BOT_COMMANDS.EDITION_SETTINGS} - set post NFT edition attributes

To kick off quickly with me just add me to the channel admins (with Edit messages permission)
`,
  PLEASE_FORWARD_MESSAGE_FROM_BOT_CHANNEL:
    "Please, forward messaage from channel where the bot is admin",
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
  CREATION_MODE: `Create link automatically`,
  MANAGE_SETTINGS: `Manage settings`,
  EDITION_LINK_CREATION_MODE_AUTO: "On",
  EDITION_LINK_CREATION_MODE_MANUAL: "Off",
};

export const MY_POSTS_REPLIES_MAP = {
  VIEW_EDITION: "View edition on 3.14xl",
  CREATE_EDITION_BUTTON: "Turn into NFT edition 🚀",
  WAITING_FOR_TXN_TO_APPEAR_IN_BLCH:
    "Creating NFT-edition... \nWaiting for transaction to appear in blockchain",
  GO_TO_POST: "Open the post",
  EDITION_VISIBILITY: "Mint button",
  EDITION_MINT_COUNT_VISIBILITY: "Mint counter",
  MANAGE_POSTS: "Here is the list of posts",
  NO_NEW_POST_CREATED_IN_THE_CHANNEL:
    "No new posts have been created in the channel since I've been added there",
  CREATE_EDITION_OUT_OF_POST: "Create NFT edition out of the post",
  READY_TO_DEPLOY_EDITION: (
    post: IPostData,
    channel: TelegramGroupChannelInfo
  ) =>
    `${createLinkText(
      `https://t.me/${channel.username}`,
      channel.title
    )} \> ${createLinkText(
      `https://t.me/${channel.username}/${post.messageId}`,
      getShortendDate(post.date)
    )}`,
  RESEND_EDITION_CREATION_LINK: "Resend post edition creation link",
  POST_SETTINGS: (post: IPostData, channel: TelegramGroupChannelInfo) =>
    `${
      post.text
        ? `📃 ${
            post.text.length > 1080
              ? `${post.text.slice(0, 1080)} ...`
              : post.text
          }`
        : ""
    }\n
 ${createLinkText(
   `https://t.me/${channel.username}`,
   channel.title
 )} \> 🕘 ${createLinkText(
      `https://t.me/${channel.username}/${post.messageId}`,
      getShortendDate(post.date)
    )}`,
  EDITION_LINK_IS_GENERATING:
    "Preparing the post to be turned into NFT-edition...\nIt may take up to 20-30 seconds",
  EDITION_LINK_IS_CREATED: (link: string) =>
    `Post edition creation link:\n${link}`,
  MESSAGE_FROM_INVALID_CHANNEL:
    "This message does not belong to the channel you manage",
  EDITION_HAS_ALREADY_BEEN_CREATED: "Post edition has already been created",
};

export const EDITION_DEFAULT_SETTINGS_REPLIES_MAP = {
  DEFAULT_COLLECT_BUTTON_NAME: "Collect",
  BUTTON_NAME: "Button name",
  ROYALTY: "Royalty",
  PAYOUT_ADDRESS: "Payout address",
  WHAT_IS_ROYALTY: `What is the royalty (%) for your NFT-post edition ?\nEnter an integer between 0 to 100`,
  ROYALTY_WARNING: `Royalty should be an integer between 0 and 100.\nTry again, please`,
  SETTINGS_UPDATED: "NFT-post edition settings have been successfully set!",
  START_ADDING_CHANNEL: "You can start addning your first channel /addchannel",
  START_FORWARD_MESSAGE:
    "You can start creating your first collectible NFT-post by forwarding any message from the channel you manage",
  ENTER_BUTTON_NAME: `What is the name of the mint button? ("Collect" can be used by default)`,
  ENTER_PAYOUT_ADDRESS: "Enter payout address",
  PAYOUT_ADDRESS_WARNING: "Payout address should be a valid TON Address",
  ENTER_EDITION_PRICE: "What is the mint price (TON)",
  PRICE_SHOULD_BE_NUMBER: "Price should be a number",
  POST_EDITION_HAS_BEEN_CREATED: (
    post: IPostData,
    channel: TelegramGroupChannelInfo
  ) =>
    `${createLinkText(
      `https://t.me/${channel.username}/${post.messageId}`,
      `Post edition`
    )} has been created`,
};

export const BUTTONS = {
  GO_BACK: "« Back",
  GO_TO_MAIN_MENU: "Main menu",
  GO_TO_POSTS_LIST: "« Back to Posts List",
  YES: "Yes",
  NO: "No",
  ON: "On",
  OFF: "Off",
};
