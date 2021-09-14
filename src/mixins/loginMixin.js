import {
  loginRes,
  autoBindMobileRes
} from "../api";

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
     * @param {*} from 1 → 首页，2 → 个人主页，3 -> 挪车码
     */
    async login(from) {
      uni.showLoading({
        title: "授权登录中...",
        mask: true,
      });
      try {
        const [{
          rawData,
          encryptedData
        }, code] = await Promise.all([new Promise((resolve, reject) => {
          uni.getUserProfile({
            provider: "weixin",
            desc: '获取用户信息！',
            success: (response) => {
              resolve(response)
            },
            fail: (err) => {
              reject(err)
            },
          });
        }), new Promise((resolve, reject) => {
          uni.login({
            provider: "weixin",
            success: ({
              code
            }) => {
              resolve(code)
            },
            fail: (err) => {
              reject(err)
            },
          });
        })])
        const {
          data
        } = await loginRes({
          code,
          userinfo: rawData,
          jmData: encryptedData,
          sharerId: uni.getStorageSync("sharer_id") || "",
        });
        console.log("debugger::response_login", data);
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
      } catch (error) {
        console.log('debugger::error_login', error)
        uni.showToast({
          title: "微信登录授权失败",
          icon: "none",
        });
      }
      uni.hideLoading();
    },
    async handleGetPhoneNumber(e) {
      const {
        detail: {
          encryptedData,
          iv
        },
      } = e;
      if (encryptedData && iv) {
        const {
          code,
          data
        } = await autoBindMobileRes({
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
        } else {
          uni.showToast({
            title: "请勿重复绑定同一手机号",
            icon: "none",
          });
        }
        this.redirect();
      }
    },
    redirect() {
      switch (this.mobilePopup.from) {
        case "1":
          uni.switchTab({
            url: "/pages/home/index",
          });
          break;
        case "2":
          uni.switchTab({
            url: "/pages/me/index",
          });
          break;
        case "3":
          this.navTo("/pages/shifting-code/contact");
          break;
      }
    },
  },
};