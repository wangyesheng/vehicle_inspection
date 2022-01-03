import {
  getShareImageRes
} from "../api";

export default {
  async onShareAppMessage(_) {
    let path = "/pages/home/index";
    const appUser = this.getAppUser();
    const activityId = uni.getStorageSync('activityId')
    if (appUser.member_mobile) {
      path = `${path}?sharerId=${appUser.member_id}&activityId=${activityId}`;
    }
    const {
      data: {
        sharepic
      }
    } = await getShareImageRes()
    return {
      path,
      title: "汽车年审，还可以更快更简单",
      imageUrl: sharepic,
    };
  },
};