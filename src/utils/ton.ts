import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Address, TonClient } from "ton";
import config from "config";

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
  let result;

  try {
    result = Address.parseFriendly(randomAddress);
  } catch (_error: unknown) {
    return null;
  }

  return result.address.toString();
}

export async function getTonClient() {
  const network = config.isTestnet ? "testnet" : "mainnet";

  return new TonClient({
    endpoint: await getHttpEndpoint({ network }),
  });
}
