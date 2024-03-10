import { getDaysInCurrentMonth } from "./helpers/getDaysInCurrentMonth";

const env = process.env.NODE_ENV;
// Crypto Secret
const cryptoSecret = process.env.CRYPTO_SECRET as string;

// Server
const PORT = process.env.PORT || 4000;

const mainBackendUrl = process.env.MAIN_BACKEND_URL;

// Apify
const apifyPerUsernameResultLimit = Number(
  process.env.APIFY_PER_USERNAME_RESULT_LIMIT
);

// MongoDB
const MONGO_URL = process.env.MONGO_URL as string;
const limit = process.env.LIMIT;

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const postsPerDay = Number(process.env.POSTS_PER_DAY as string);
const daysInCurrentMonth = getDaysInCurrentMonth();
const postsPerMonth = env === "dev" ? 2 : postsPerDay * daysInCurrentMonth;

// Upstash Redis
const upstashRedisRESTUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisauthToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Cloudinary
const cloudinary_cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;

export const ENV = {
  PORT,
  MONGO_URL,
  apifyPerUsernameResultLimit,
  months,
  postsPerMonth,
  limit,
  upstashRedisRESTUrl,
  upstashRedisauthToken,
  cloudinary_cloud_name,
  cloudinary_api_key,
  cloudinary_api_secret,
  cryptoSecret,
  mainBackendUrl,
};
