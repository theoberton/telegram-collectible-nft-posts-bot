import bot from "/src/bot/mod.ts";
import { Application, Router, Status } from "oak";
import transactionRequestController from "/src/modules/transaction-request/controller.ts";
import { logger } from "/src/utils/mod.ts";
import config from "config";

const router = new Router();

router.get("/", (context) => {
  context.response.body = "ok";
});

const collectibleBotAddress = config.get("telegram.collectibleBot.address");

router.get(
  "/transaction-request/:transactionRequestId/completed",
  async (context) => {
    const result = await transactionRequestController.getTransacationRequest(
      context.params.transactionRequestId
    );

    if (!result) {
      return context.throw(Status.NotFound);
    }

    await transactionRequestController.handleTransactionRequestCompletion(
      context.params.transactionRequestId
    );

    context.response.redirect(collectibleBotAddress);
  }
);

router.get("/transaction-request/:transactionRequestId", async (context) => {
  const result = await transactionRequestController.handleTransactionRequest(
    context.params.transactionRequestId
  );

  if (!result) {
    return context.throw(Status.NotFound);
  }

  context.response.body = result;
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });

bot.start({
  onStart: () => {
    logger.info("Collectible posts bot  started!");
  },
});
