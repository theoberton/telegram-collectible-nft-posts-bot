import _ from "lodash";
import renameModule from "deep-rename-keys-ts";
import cleanDeep from "clean-deep";

const rename = renameModule.default;

export function cleanUp(rawData: any) {
  if (_.isEmpty(rawData)) {
    return rawData;
  }
  const data = rawData.toJSON ? rawData.toJSON(rawData) : rawData;

  const dataWithRenamedIds = rename(data, (key: string) =>
    key === "_id" ? "id" : key
  );

  const dataWithRemovedMeta = cleanDeep(dataWithRenamedIds, {
    cleanKeys: ["__v"],
    emptyStrings: false,
    emptyArrays: false,
    emptyObjects: false,
    nullValues: false,
    undefinedValues: false,
  });

  return dataWithRemovedMeta;
}

/**
Fix applying TS
const rename = renameModule.default;

export function cleanUp<T extends { toJSON: (data: T) => string }>(rawData: T) {
  if (_.isEmpty(rawData)) {
    return rawData;
  }
  const data = rawData.toJSON ? rawData.toJSON(rawData) : rawData;

  const dataWithRenamedIds = rename(data, (key: string) =>
    key === "_id" ? "id" : key
  );

  const dataWithRemovedMeta = cleanDeep.default<T>(dataWithRenamedIds, {
    cleanKeys: ["__v"],
    emptyStrings: false,
    emptyArrays: false,
    emptyObjects: false,
    nullValues: false,
    undefinedValues: false,
  });

  return dataWithRemovedMeta;
}

 */
