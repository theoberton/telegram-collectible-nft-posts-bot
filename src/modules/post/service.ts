import { IPostData, IPostQuery, IPostDataFull } from "/src/types/mod.ts";

import { cleanUp } from "/src/utils/mod.ts";
import { Post } from "/src/modules/post/model.ts";
import userService from "/src/modules/user/service.ts";

async function createPost(data: IPostData) {
  const post = new Post(data);

  const result = await post.save();

  const cleanedResult = cleanUp(result);

  return getPost(cleanedResult.messageId, cleanedResult.channelId);
}

async function getPost(
  messageId: number,
  channelId: number
): Promise<IPostDataFull> {
  const query: IPostQuery = { messageId, channelId };
  const [channel, post] = await Promise.all([
    userService.findChannel({ chatId: query.channelId }),
    Post.findOne(query).then(cleanUp),
  ]);

  if (post) {
    post.channel = channel;
  }
  // TO DO: move channels to separeate collection

  return post;
}

function updatePost(
  messageId: number,
  channelId: number,
  data: Partial<IPostData>
) {
  return Post.updateOne(
    {
      messageId,
      channelId,
    },
    {
      $set: data,
    }
  );
}

function deletePost(messageId: number, channelId: number) {
  return Post.deleteOne({
    messageId,
    channelId,
  });
}

function deletePostsByChannelId(channelId: number) {
  return Post.remove({ channelId });
}

export default {
  getPost,
  createPost,
  updatePost,
  deletePost,
  deletePostsByChannelId,
};
