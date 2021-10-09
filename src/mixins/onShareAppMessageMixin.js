export default {
  onShareAppMessage(_) {
    let path = "/pages/home/index";
    const appUser = this.getAppUser();
    const activityId = uni.getStorageSync('activityId')
    if (appUser.member_mobile) {
      path = `${path}?sharerId=${appUser.member_id}&activityId=${activityId}`;
    }
    return {
      path,
      title: "汽车年审，还可以更快更简单",
      imageUrl: `https://cj.huazhe.work/images/huodong.png?timespan=${new Date().getTime()}`,
    };
  },
};