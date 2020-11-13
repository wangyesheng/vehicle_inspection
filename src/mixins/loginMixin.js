import { loginRes, autoBindMobileRes } from "../api";

export default {
  data() {
    return {
      mobilePopup: {
        visible: false,
        wxCode: "",
        session_key: "",
        from: -1,
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
                    this.mobilePopup.visible = true;
                    this.mobilePopup.wxCode = code;
                    this.mobilePopup.session_key = data.session_key;
                    this.mobilePopup.from = from;
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
        const { code, data } = await autoBindMobileRes({
          code: this.mobilePopup.wxCode,
          phonedata: encryptedData,
          phonedataiv: iv,
          session_key: this.mobilePopup.session_key,
        });
        if (code == 200) {
          uni.showToast({
            title: "绑定成功",
            icon: "none",
          });
          const appUser = this.getAppUser();
          appUser.member_mobile = data.mobile;
          uni.setStorageSync("app_user", JSON.stringify(appUser));
          this.mobilePopup.from == 1
            ? uni.switchTab({
                url: "/pages/home/index",
              })
            : uni.switchTab({
                url: "/pages/me/index",
              });
        } else {
          uni.showToast({
            title: "请勿重复绑定同一手机号",
            icon: "none",
          });
        }
      }
    },
  },
};
