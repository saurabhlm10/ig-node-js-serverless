import { ENV } from "../constants";
import CryptoJS from "crypto-js";

export function decrypt(encryptedKey: string) {
  return CryptoJS.AES.decrypt(encryptedKey, ENV.cryptoSecret).toString(
    CryptoJS.enc.Utf8
  );
}
