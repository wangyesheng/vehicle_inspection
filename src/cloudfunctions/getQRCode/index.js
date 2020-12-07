const cloud = require("wx-server-sdk");
cloud.init();
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: `shareId=${event.shareId}`,
      page: "pages/home/index",
      width: 280,
    });
    return result;
  } catch (err) {
    return err;
  }
};
