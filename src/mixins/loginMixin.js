import { loginRes } from "../api";

export default {
  methods: {
    login() {
      uni.showLoading({});
      uni.getProvider({
        service: "oauth",
        success: (_) => {
          uni.login({
            provider: "weixin",
            success: ({ code }) => {
              uni.getUserInfo({
                provider: "weixin",
                success: async ({ rawData, encryptedData }) => {
                  const { data } = await loginRes({
                    code,
                    userinfo: rawData,
                    jmData: encryptedData,
                  });
                  if (data.state === "200") {
                    // delete data.state;
                    // delete data.unionid;
                    // delete data.session_id;
                    uni.setStorageSync("vehicle_inspection_token", data.token);
                    uni.setStorageSync("app_user_mobile", data.member_mobile);
                    // uni.setStorageSync("app_user", JSON.stringify(data));
                    // callback(data);
                    this.navTo("/pages/auth/bind-mobile");
                  } else {
                    uni.showToast({
                      title: "微信登录授权失败",
                      icon: "none",
                    });
                  }
                  uni.hideLoading();
                },
                fail: () => {
                  uni.showToast({
                    title: "微信登录授权失败",
                    icon: "none",
                  });
                },
              });
            },
            fail: () => {
              uni.showToast({
                title: "微信登录授权失败",
                icon: "none",
              });
            },
          });
        },
      });
    },
  },
};
