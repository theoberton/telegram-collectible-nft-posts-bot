import { EditionData } from "/src/types/mod.ts";

export const composeEditionPipeline = (editionData: Partial<EditionData>) => {
  return [
    {
      $match: {
        userId: editionData.userId,
        channelId: editionData.channelId,
        messageId: editionData.postId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "userId",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
};
/**
export const composeEditionPipeline = (editionData: EditionData) => {
  return [
    {
      $match: {
        userId: editionData.userId,
        channelId: editionData.channelId,
        messageId: editionData.postId,
      },
    },
    {
      $lookup: {
        from: "transaction_request",
        localField: "_id",
        foreignField: "editionId",
        as: "transactionRequest",
      },
    },
    {
      $unwind: {
        path: "$transactionRequest",
        preserveNullAndEmptyArrays: true,
      },
    }
  ]
};
 */

/**
import { EditionData } from "/src/types/mod.ts";

export const composeEditionPipeline = (editionData: EditionData) => {
  return [
    {
      $match: {
        userId: editionData.userId,
        channelId: editionData.channelId,
        messageId: editionData.postId,
      },
    },
    {
      $lookup: {
        from: "users",
        let: {
          channelId: "$channelId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [editionData.channelId, "$channels.chatId"],
              },
            },
          },
          { $unwind: "$channels" },
          {
            $sort: {
              createdAt: -1,
            },
          },
          { $limit: 1 },
        ],
        localField: "userId",
        foreignField: "userId",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "transaction_request",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$id", "$editionId"],
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          { $limit: 1 },
        ],
        as: "transactionRequest", // Добавить логику на $first
      },
    },
    {
      $unwind: {
        path: "$transactionRequest",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
};

/**
export const composeEditionPipeline = (editionData: EditionData) => {
  return [
    {
      $match: {
        userId: editionData.userId,
        channelId: editionData.channelId,
        messageId: editionData.postId,
      },
    },
    {
      $lookup: {
        from: "transaction_request",
        localField: "_id",
        foreignField: "editionId",
        as: "transactionRequest",
      },
    },
    {
      $unwind: {
        path: "$transactionRequest",
        preserveNullAndEmptyArrays: true,
      },
    }
  ]
};
 */
