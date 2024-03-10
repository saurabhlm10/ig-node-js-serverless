import axios from "axios";
import { ENV } from "../constants";

export const axiosInstance = axios.create({
  baseURL: ENV.mainBackendUrl,
});
