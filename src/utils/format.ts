import rename from "deep-rename-keys-ts";

import _ from "lodash";

export function renameKeysToCamelCase(
  obj: any,
  options: { omitKeysWithDots?: boolean } = {}
) {
  if (_.isEmpty(obj)) {
    return null;
  }
  const { omitKeysWithDots = false } = options;

  return rename.default(obj, (key: string) =>
    omitKeysWithDots ? key : _.camelCase(key)
  );
}

export function renameKeysToSnakeCase(
  obj: any,
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