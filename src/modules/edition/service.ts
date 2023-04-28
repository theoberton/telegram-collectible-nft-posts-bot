import Edition from "/src/modules/edition/model.ts";
import {
  IEdition,
  IEditionFull,
  EditionData,
  EditionQuery,
} from "/src/types/mod.ts";
import userService from "/src/modules/user/service.ts";
import { cleanUp } from "/src/utils/mod.ts";
import { composeEditionPipeline } from "/src/modules/edition/query.builder.ts";

async function findEdition(
  editionData: EditionData
): Promise<IEditionFull | IEdition | null> {
  const pipeline = composeEditionPipeline(editionData);

  const result = await Edition.aggregate(pipeline);

  const [edition = null] = result.map(cleanUp);

  return edition;
}

async function findEditionById(editionId: string): Promise<IEdition> {
  const edition = await Edition.findOne({ _id: editionId });

  return cleanUp(edition);
}

async function findExistingUserEdition(userId: number): Promise<IEdition> {
  const edition = await Edition.findOne({ userId });

  return cleanUp(edition);
}

async function findEditionByAddress(address: string): Promise<IEdition> {
  const edition = await Edition.findOne({ address });

  return cleanUp(edition);
}

async function createEdition(editionData: EditionData) {
  const user = await userService.findUser(editionData.userId);
  const { editionSettings } = user;

  const edition = new Edition({
    channelId: editionData.channelId,
    messageId: editionData.postId,
    title: editionSettings.buttonName,
    royalty: editionSettings.royalty,
    payoutAddress: editionSettings.payoutAddress,
    price: editionSettings.price,
    userId: editionData.userId,
  });

  const newEditionRaw = await edition.save();

  return cleanUp(newEditionRaw) as Promise<IEdition>;
}

async function updateEdition(query: EditionQuery, data: Partial<IEdition>) {
  const edition = await Edition.updateOne(query, {
    $set: data,
  });

  return edition;
}

export default {
  findExistingUserEdition,
  createEdition,
  findEdition,
  updateEdition,
  findEditionById,
  findEditionByAddress,
};
