import puppeteer from "puppeteer";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Buffer } from "buffer";
import Promise from "bluebird";
import { logger } from "/src/utils/mod.ts";

import { uuidv4 } from "/src/utils/mod.ts";
import {
  removeElement,
  updateContentContainerStyles,
  updateBodyStyles,
  updateContentWrapperStyles,
  getText,
  handleInterceptors,
} from "/src/helpers/image/utils.ts";
import {
  headWrapperSelector,
  widgetActionsWrapSelector,
  userPhotoSelector,
  divContentSelector,
  iframeSelector,
  bodySelector,
  messageSelector,
  messageContentWrapperSelector,
  messageWidgetSelector,
  messageWidgetBubleSelector,
} from "/src/helpers/image/selectors.ts";
import { BROWSER_LAUNCH_ARGS } from "/src/helpers/image/constants.ts";

let browser: any = null;

export async function getPostScreenshot(link: string) {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      defaultViewport: {
        height: 1080,
        width: 1920,
      },
      args: BROWSER_LAUNCH_ARGS,
    });
  }
  logger.info("Puppeter is about to lauch");
  const page = await browser.newPage();

  await handleInterceptors(page);

  logger.info("Puppeter before networkidle");

  await page.goto(link, { waitUntil: "domcontentloaded" });

  const [iframeSection, body, bodyContent] = await Promise.all([
    page.waitForSelector(iframeSelector),
    page.$(bodySelector),
    page.$(divContentSelector),
    removeElement(page, headWrapperSelector),
    removeElement(page, widgetActionsWrapSelector),
  ]);

  logger.info("Iframe gotted");

  const frame = await iframeSection!.contentFrame();

  if (!frame) {
    throw new Error("Frame");
  }

  const [contentContainer] = await Promise.all([
    frame.waitForSelector(messageWidgetBubleSelector),
    bodyContent!.evaluate(updateContentWrapperStyles),
    removeElement(frame, messageWidgetSelector),
  ]);

  const [contentContainerWrapper, message] = await Promise.all([
    frame.$(messageContentWrapperSelector),
    frame.$(messageSelector),
    body!.evaluate(updateBodyStyles),
    contentContainer!.evaluate(updateContentContainerStyles),
    removeElement(frame, userPhotoSelector),
  ]);

  const [messageBoundingBox] = await Promise.all([
    message && message.boundingBox(),
    contentContainerWrapper!.evaluate(updateContentWrapperStyles),
  ]);

  let viewportWidth = 800;

  if (message) {
    const content = await message.evaluate(getText);

    if (content) {
      if (content.length > 300) {
        viewportWidth = 500;
      } else {
        viewportWidth = 400;
      }
    }
  }

  let viewportHeight;
  // Text content messageBoundingBox
  if (messageBoundingBox) {
    viewportHeight =
      messageBoundingBox!.height + 100 > 500
        ? messageBoundingBox.height + 350
        : messageBoundingBox.height + 400;
  } else {
    viewportHeight = 800;
  }

  await page.setViewport({
    width: viewportWidth,
    height: viewportHeight,
  });
  logger.info("Before screenshot");

  const image = await page.screenshot({ encoding: "base64" });

  const storage = new ThirdwebStorage();
  logger.info("Before upload");

  try {
    const [collectionContentUri] = await Promise.all([
      storage.upload(
        {
          name: `${uuidv4()}.jpg`,
          data: Buffer.from(image, "base64"),
        },
        {
          uploadWithGatewayUrl: true,
        }
      ),
    ]);
    logger.info("after upload");
    logger.info("closing browser");
    await page.close();
    logger.info("page close");

    // await browser.close();
    logger.info("browser closed ");

    return collectionContentUri;
  } catch (error) {
    logger.info("errror happened");

    logger.error(error);
  }
}
