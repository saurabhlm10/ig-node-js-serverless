import { AxiosError } from "axios";
import { ENV } from "../constants";
import Post from "../model/Post";
import { publishMedia } from "../helpers/publishMedia";
import connectToDb from "../config/db";
import IGPageModel from "../model/IGPage";

module.exports.handler = async (event: any, context: any) => {
  try {
    console.log("publishPost");
    const page = event.pathParameters?.page;
    console.log("page", page);

    if (!page) throw new Error("page is required");
    await connectToDb();

    // Check if page is valid
    const validPage = await IGPageModel.findOne({ name: page });

    console.log(validPage, "validPage");

    if (!validPage) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Page Not Found" }),
      };
    }

    const currentDate = new Date();
    const currentMonth = ENV.months[currentDate.getMonth()];

    const currentPost = await Post.findOne({
      status: "uploaded-media-container",
      publishMonth: currentMonth,
      page,
    });

    console.log("currentPost", currentPost);

    console.log("2");

    if (!currentPost) throw new Error("No Posts To Be Uploaded");

    const creation_id = currentPost.creation_id as string;

    console.log("creation_id", creation_id);
    console.log("currentPost._id", Number(currentPost._id));

    // Publish Media, save published_id, update published status to Y in CSV
    const published_id = await publishMedia({
      creation_id,
      currentPostId: String(currentPost._id),
      page: page as string,
    });

    console.log("4");

    currentPost.status = "published";
    currentPost.published_id = published_id;

    await currentPost.save();

    console.log("5");

    return {
      message: "Post Published Successfully",
      body: {
        published_id,
      },
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      return {
        statusCode: 400,
        body: {
          errorMessage: error.response?.data,
        },
      };
    }
    if (error instanceof Error) {
      return {
        statusCode: 400,
        body: {
          errorMessage: error.message,
        },
      };
    }
  }
};
