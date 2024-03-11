import mongoose from "mongoose";
import connectToDb from "../config/db";
import IGPageModel from "../model/IGPage";
import axios from "axios";
import { ENV } from "../constants";

module.exports.handler = async (event: any, context: any) => {
  try {
    await connectToDb();

    // Get all pages
    const pages = await IGPageModel.find({}).lean();

    // For each page, call the collect-posts function
    for (let page of pages) {
      axios.get(ENV.publishPostUrl + page.name);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Publish Posts Called" }),
    };
  } catch (error) {
  } finally {
    await mongoose.disconnect();
  }
};
