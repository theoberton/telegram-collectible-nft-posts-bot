import { getHttpEndpoint } from "@orbs-network/ton-access";
import rename from "deep-rename-keys-ts";
import _ from "lodash";
import { Address, TonClient } from "ton";

export const getCommandValue = (message: string) => {
  const parsedMessage = message.slice(1).toLowerCase();

  return parsedMessage.charAt(0).toUpperCase() + parsedMessage.slice(1);
};

export function renameKeysToCamelCase(
  obj: object,
  options: { omitKeysWithDots?: boolean } = {}
) {
  const { omitKeysWithDots = false } = options;

  return rename(obj, (key: string) =>
    omitKeysWithDots ? key : _.camelCase(key)
  );
}

export function renameKeysToSnakeCase(
  obj: object,
  options: { omitKeysWithDots?: boolean } = {}
) {
  const { omitKeysWithDots = false } = options;

  return rename(obj, (key: string) =>
    omitKeysWithDots ? key : _.snakeCase(key)
  );
}

export function fromUnixToDate(time?: number) {
  const dateStart = new Date((time ?? 0) * 1000);

  return dateStart;
}

export function getChannelId(channelId: number) {
  const channel = String(channelId);

  return channel.startsWith("-100") ? Number(channel.slice(4)) : channelId;
}

export async function getTonClient() {
  return new TonClient({
    endpoint: await getHttpEndpoint({ network: "mainnet" }),
  });
}

export function convertToBounceableAddress(
  randomAddress: string | undefined | null
) {
  if (
    randomAddress === null ||
    randomAddress === undefined ||
    randomAddress === ""
  ) {
    return null;
  }

  const result = Address.parseFriendly(randomAddress);

  return result.address.toString();
}
