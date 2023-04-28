// @ts-nocheck Rething puppeter usage

import { Page, Frame, ElementHandle } from "puppeteer";

export async function handleInterceptors(page: Page) {
  await page.setRequestInterception(true);

  // Remove pop-up to go to telegram
  page.on("request", (request: any) => {
    if (request.isNavigationRequest() && request.redirectChain().length !== 0) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

export async function removeElement(page: Page | Frame, selector: string) {
  await page.evaluate((sel: ElementHandle) => {
    const elements = document.querySelectorAll(sel);
    for (let i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, selector);
}

export function updateContentWrapperStyles(el) {
  el.style.paddingTop = "10px";
}

export function updateContentContainerStyles(el) {
  el.style.marginLeft = "10px";
}

export function updateHtmlStyles(el) {
  el.style.height = "100%";
}

export function getText(el) {
  return el.textContent;
}

export function updateBodyStyles(el) {
  el.style.height = "100%";
  el.style.padding = 0;
}

export function updateWrapperStyles(el) {
  el.style.height = "100%";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
}

export function updateContentStyles(el) {
  el.style.height = "100%";
  el.style.display = "flex";
  el.style.alignItems = "center";
}
