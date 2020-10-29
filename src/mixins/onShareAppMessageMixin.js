export default {
  onShareAppMessage(_) {
    let path = "/pages/home/index";
    const appUser = this.getAppUser();
    if (appUser.member_mobile) {
      path = `${path}?sharerId=${appUser.member_id}`;
    }
    return {
      path,
      title: "1小时快速审车，5颗星贴心服务",
      imageUrl: "https://cj.huazhe.work/static/images/share.png",
    };
  },
};
