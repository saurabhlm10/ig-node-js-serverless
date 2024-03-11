import { axiosInstance } from "../config/axios";
import { decrypt } from "./decrypt";

export async function getAccessTokenForPage(page: string) {
  const response = await axiosInstance.get("/batch/getPageAccessToken/" + page);

  console.log("response.data", response.data);

  return response.data.accessToken;
}
