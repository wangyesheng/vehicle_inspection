import { loginRes } from "../api";

export default {
  methods: {
    /**
     *
     * @param {*} from 1 → 首页，2 → 个人主页
     */
    login(from) {
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
                    delete data.state;
                    delete data.unionid;
                    delete data.session_id;
                    uni.setStorageSync("app_user", JSON.stringify(data));
                    this.navTo(`/pages/auth/bind-mobile?from=${from}`);
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
