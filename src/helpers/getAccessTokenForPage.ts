import { axiosInstance } from "../config/axios";
import { decrypt } from "./decrypt";

export async function getAccessTokenForPage(page: string) {
  const response = await axiosInstance.get("/secret/", { params: { page } });

  const encrypted_apify_key = response.data.encrypted_apify_key;

  return decrypt(encrypted_apify_key);
}
