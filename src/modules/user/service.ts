import {
  IUserData,
  ChannelQuery,
  TelegramGroupChannelInfo,
  PostEditionSettings,
  PaginatedList,
  IUser,
  IPostChannels,
} from "/src/types/mod.ts";
import {
  composePostPipeline,
  composeChannelPipeline,
} from "/src/modules/user/query.builder.ts";

import { cleanUp } from "/src/utils/mod.ts";
import { User } from "/src/modules/user/model.ts";

function createUser(data: IUserData) {
  const user = new User(data);

  return user.save();
}

async function getAllPaginatedPosts(query: {
  userId: number;
  page: number;
}): Promise<PaginatedList<IPostChannels>> {
  const { page = 1, userId } = query;

  const pipeline = composePostPipeline(userId);

  const aggregate = User.aggregate(pipeline);

  const posts: PaginatedList<IPostChannels> = await User.aggregatePaginate(
    aggregate,
    {
      page,
      limit: 5,
      sort: { createdAt: -1 },
    }
  );

  return posts;
}

async function addUserChannel(
  userId: number,
  channel: TelegramGroupChannelInfo
): Promise<void> {
  await User.updateOne(
    {
      userId,
    },
    {
      $addToSet: {
        channels: channel,
      },
    }
  );
}

async function deleteUserChannel(channelId: number): Promise<void> {
  await User.updateOne(
    {
      "channels.chatId": channelId,
    },
    {
      $pull: {
        channels: {
          chatId: channelId,
        },
      },
    }
  );
}

function deleteUser(id: number) {
  return User.deleteOne({ userId: id });
}

async function findUserUserByChannelUsername(
  channelUsername: string
): Promise<IUser> {
  const result = await User.findOne({
    "channels.username": channelUsername,
  });

  return cleanUp(result);
}

async function findUserByChannelId(channelId: number): Promise<IUser> {
  const result = await User.findOne({
    "channels.chatId": channelId,
  });

  return cleanUp(result);
}

async function findChannel(
  query: ChannelQuery
): Promise<TelegramGroupChannelInfo> {
  const pipeline = composeChannelPipeline(query);
  const [result]: TelegramGroupChannelInfo[] = await User.aggregate(pipeline);

  return result;
}

async function updateChannel( // TO DO: Critical
  query: ChannelQuery,
  data: Partial<TelegramGroupChannelInfo>
) {
  await User.updateOne(
    {
      channels: query,
    },
    {
      $set: {
        data,
      },
    }
  );
}

async function findUser(id: number): Promise<IUser> {
  const result = await User.findOne({ userId: id });

  return cleanUp(result);
}

async function updateUserEditionSettings(
  userId: number,
  editionSettings: Partial<PostEditionSettings>
): Promise<void> {
  await User.updateOne(
    {
      userId,
    },
    {
      $set: {
        editionSettings,
      },
    }
  );
}

export default {
  getAllPaginatedPosts,
  createUser,
  addUserChannel,
  deleteUser,
  deleteUserChannel,
  findUser,
  updateChannel,
  updateUserEditionSettings,
  findUserUserByChannelUsername,
  findUserByChannelId,
  findChannel,
};
