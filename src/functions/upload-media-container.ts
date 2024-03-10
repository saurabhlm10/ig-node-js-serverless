import { AxiosError } from "axios";
import { uploadMedia } from "../helpers/uploadMedia";
import Post from "../model/Post";
import connectToDb from "../config/db";
import IGPageModel from "../model/IGPage";
import { ENV } from "../constants";
import SecretModel from "../model/Secret.model";
import { decrypt, decryptAll } from "../helpers/decrypt";
import { saveErrorToDB } from "../helpers/saveErrorToDB";
import mongoose from "mongoose";

module.exports.handler = async (event: any, context: any) => {
  console.log("uploadMediaContainer");
  let currentPost;
  try {
    console.log("ENV", ENV);

    const page = event.pathParameters?.page;
    console.log("page", page);

    if (!page) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "page is required" }),
      };
    }

    await connectToDb();

    // Check if page is valid
    const validPage = await IGPageModel.findOne({ name: page }).lean();

    if (!validPage) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Page Not Found" }),
      };
    }

    // Get Secrets for the page
    const pageSecrets = await SecretModel.findOne({ page }).lean();

    if (!pageSecrets) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Secrets Not Found for" + page }),
      };
    }

    const decryptedSecrets = decryptAll(pageSecrets);

    const ig_user_id = decryptedSecrets.ig_user_id;

    // Get Current Month
    const currentDate = new Date();
    const currentMonth = ENV.months[currentDate.getMonth()];

    // Find one post to upload from current month
    currentPost = await Post.findOne({
      status: "uploaded-to-cloud",
      publishMonth: currentMonth,
      page,
    });

    console.log("currentPost?._id", currentPost?._id);

    if (!currentPost) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "No Posts To Be Uploaded",
        }),
      };
    }

    const mediaToUpload = currentPost.media_url;

    // Upload Media, save creation_id and uploaded status to CSV
    const creation_id = await uploadMedia(
      mediaToUpload,
      currentPost.cover_url,
      currentPost.caption,
      ig_user_id as string,
      page
      // currentPost.ownerUsername
    );

    if (!creation_id) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to upload media" }),
      };
    }

    currentPost.creation_id = creation_id;

    currentPost.status = "uploaded-media-container";

    await currentPost.save();

    return {
      body: {
        statusCode: 200,
        message: "Media Uploaded successfully",
        creation_id,
      },
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      if (currentPost) {
        await saveErrorToDB(
          String(currentPost._id),
          JSON.stringify(error.response?.data)
        );
      }

      return {
        statusCode: 400,
        body: JSON.stringify({
          errorMessage: error.response?.data,
        }),
      };
    }
    if (error instanceof Error) {
      console.log(error);
      if (currentPost) {
        await saveErrorToDB(
          String(currentPost._id),
          JSON.stringify(error.message)
        );
      }
      return {
        statusCode: 400,
        body: JSON.stringify({
          errorMessage: error.message,
        }),
      };
    }
  } finally {
    await mongoose.disconnect();
  }
};
