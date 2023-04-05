import { renameKeysToCamelCase } from "/utils/mod.ts";
import { Composer, Context } from "grammy";
import _ from 'lodash';
import { BotContext } from "/types/mod.ts";

const composer = new Composer();

const keysConvertionMiddleware = (key: string) =>
  composer.use((ctx: Context) => {
    const dataToConvert: object = _.get(ctx, key);
    const convertedData = renameKeysToCamelCase(dataToConvert);

    _.set(ctx, key, convertedData);
  });

export default keysConvertionMiddleware;
