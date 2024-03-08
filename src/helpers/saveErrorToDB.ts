import Post from "../model/Post";

export async function saveErrorToDB(
  currentPostId: string,
  errorMessage: string
) {
  console.log("currentPostId", currentPostId);
  console.log("saveErrorToDB");

  const post = await Post.findById(currentPostId);

  if (post) {
    post.status = "error";
    post.errorMessage = errorMessage;

    await post.save();
  }

  throw new Error(errorMessage);
}
