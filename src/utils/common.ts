import { crypto } from "crypto";
import _ from "lodash";
import Logger from "logger";
import { IEdition } from "/src/types/mod.ts";
import config from "config";

export const logger = new Logger();

export function isNumeric(str: string) {
  if (typeof str != "string") return false;
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function calcPercent(value: bigint, percent: number) {
  return BigInt(Math.floor(Number(value) * percent));
}

export function getEditionTitleName(text: string) {
  const dotLocation = text.indexOf(".");

  if (dotLocation < 50) {
    return text.slice(0, dotLocation);
  }

  const words = text.split(" ");

  const title = words.slice(0, 8);

  return `${title.join(" ")} ...`;
}

export function uuidv4() {
  return crypto.randomUUID();
}

export function composeMintTitle(
  edition: IEdition,
  counter: number | null = null
) {
  return `${edition.title} ${
    edition.isMintCounterShown && counter && counter > 0 ? `- ${counter}` : ""
  }`;
}

export function composePixelUrl(collectionAddress: string) {
  return `https://${
    config.isTestnet ? "testnet" : ""
  }.pi.oberton.io/#/edition/${collectionAddress}`;
}

export function composePostUrl(channelName: string, postId: number) {
  return `https://t.me/${channelName}/${postId}`;
}
