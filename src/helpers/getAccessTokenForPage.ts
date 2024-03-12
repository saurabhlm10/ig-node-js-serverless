import { axiosInstance } from "../config/axios";

export async function getAccessTokenForPage(page: string) {
  console.log("getting access token");
  const response = await axiosInstance.get("/batch/getPageAccessToken/" + page);

  console.log("response.data", response.data);

  return response.data.accessToken;
}
