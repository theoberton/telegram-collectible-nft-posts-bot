import userService from "/src/modules/user/service.ts";
import { BotContext } from "/src/types/mod.ts";

export async function getUser(ctx: BotContext) {
  if (!ctx.chat?.id) {
    return null;
  }

  const user = await userService.findUser(ctx.chat.id);

  return user;
}
