import { axiosInstance } from "../config/axios";
import { ENV } from "../constants";

export async function getAccessTokenForPage(page: string) {
  console.log("getting access token");
  const response = await axiosInstance.get("/batch/getPageAccessToken/" + page);

  console.log("response.data", response.data);

  return response.data.accessToken;
}
