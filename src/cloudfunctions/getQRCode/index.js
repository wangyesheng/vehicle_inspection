const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: `sharerId=${event.sharerId}&activityId=${event.activityId}`,
      page: 'pages/home/index',
      width: 280,
    });
    return result;
  } catch (err) {
    return err;
  }
};
