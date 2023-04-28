import { NextFunction } from "grammy";
import { BotContext } from "/src/types/mod.ts";
import { BOT_REPLIES_MAP } from "/src/bot/replies.ts";

import userService from "/src/modules/user/service.ts";

// Order matters. This should be invoked before session middleware
export async function editionSettingsSet(
  ctx: BotContext,
  next: NextFunction
): Promise<void> {
  const user = await userService.findUser(ctx.chat?.id!);

  if (!user.editionSettings) {
    await ctx.reply(BOT_REPLIES_MAP.SETUP_EDTION_SETTINGS);
  } else {
    next();
  }
}

export default editionSettingsSet;
