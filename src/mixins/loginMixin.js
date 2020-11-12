import { loginRes, autoBindMobileRes } from "../api";

export default {
  data() {
    return {
      mobilePopup: {
        visible: false,
        wxCode: "",
      },
    };
  },
  methods: {
    /**
     * 登录逻辑
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
                  const sharerId = uni.getStorageSync("sharer_id") || "";
                  const { data } = await loginRes({
                    code,
                    userinfo: rawData,
                    jmData: encryptedData,
                    sharerId,
                  });
                  if (data.state === "200") {
                    uni.setStorageSync("app_user", JSON.stringify(data));
                    // this.navTo(`/pages/auth/bind-mobile?from=${from}`);
                    this.mobilePopup.visible = true;
                    this.mobilePopup.wxCode = code;
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
    async handleGetPhoneNumber(e) {
      const {
        detail: { encryptedData, iv },
      } = e;
      if (encryptedData && iv) {
        const data = await autoBindMobileRes({
          code: this.mobilePopup.wxCode,
          phonedata: encryptedData,
          phonedataiv: iv,
        });
        console.log(data);
      }
    },
  },
};
