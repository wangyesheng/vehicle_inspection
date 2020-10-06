export function getAppUser() {
  return JSON.parse(uni.getStorageSync("app_user") || "{}");
}
