import { PipelineStage } from "mongoose";
import { ITransactionRequest } from "/src/types/mod.ts";

export const composeEditionLatestTransactionRequestPipeline = (
  query: Partial<ITransactionRequest>
): PipelineStage[] => {
  return [
    {
      $match: query,
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: 1,
    },
  ];
};

export const composeGetTransactionRequestPipeline = (
  transactionRequestId: string
): PipelineStage[] => {
  return [
    {
      $match: {
        transactionRequestId,
      },
    },
    {
      $lookup: {
        from: "editions",
        localField: "editionId",
        foreignField: "_id",
        as: "edition",
      },
    },
    {
      $unwind: {
        path: "$edition",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
};

/**
  return [
    {
      $match: {
        transactionRequestId,
      },
    },

    {
      $lookup: {
        from: "editions",
        let: {
          editionId: "$editionId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$editionId", "$_id"],
              },
            },
          },
					{
						$lookup: {
							from: 'po',
							let: {
								applicationId: '$applicationId'
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: [
												'$$applicationId',
												'$_id'
											]
										}
									}
								},
								
							],
							as: 'application'
						},
					},
        ],
        as: "edition",
      },
    },
    {
      $unwind: {
        path: "$edition",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
 */
