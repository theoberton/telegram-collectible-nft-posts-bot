export const composePostPipeline = (userId: number) => {
  return [
    {
      $match: {
        userId,
      },
    },
    {
      $unwind: {
        path: "$channels",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "channels.chatId",
        foreignField: "channelId",
        as: "post",
      },
    },
    {
      $unwind: {
        path: "$post",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$post", { channel: "$channels" }],
        },
      },
    },
  ];
};

export const composeChannelPipeline = (query: any) => {
  return [
    {
      $match: {
        channels: {
          $elemMatch: query,
        },
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: false,
        path: "$channels",
      },
    },
    {
      $match: {
        $or: [
          {
            "channels.chatId": query.chatId,
          },
          {
            "channels.username": query.username,
          },
        ],
      },
    },
    {
      $replaceRoot: {
        newRoot: "$channels",
      },
    },
  ];
};
