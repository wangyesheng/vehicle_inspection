import qs from "qs";
import { getAppUser } from "./auth";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://cj.huazhe.work"
    : "https://cj.huazhe.work";

export function request(options) {
  const requestData = {
    key: getAppUser().token,
    ...options.data,
  };
  let header = {};
  if (options.method === "POST") {
    header = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.method === "POST" ? qs.stringify(requestData) : requestData,
      header,
      success: (response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          uni.showToast({
            title: "服务器繁忙，请稍后再试~",
            duration: 2000,
          });
          reject(new Error("服务器繁忙，请稍后再试~"));
        }
      },
      fail: (err) => {
        reject(new Error(err));
      },
    });
  });
}
