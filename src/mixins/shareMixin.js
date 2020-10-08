export default {
  onShareAppMessage(_) {
    let path = "/pages/home/index";
    const appUser = this.getAppUser();
    if (appUser.member_mobile) {
      path = `${path}?sharerId=${appUser.member_id}`;
    }
    console.log(path);
    return {
      path,
      title: "1小时快速审车，5颗星贴心服务",
      imageUrl: "",
    };
  },
};
