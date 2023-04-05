import bot from "/bot/mod.ts";

import config from "config";

// Add when ready for production
// Deno.addSignalListener("SIGINT", () => bot.stop());
// Deno.addSignalListener("SIGTERM", () => bot.stop());

bot.start();

// serve(handler, { port });
