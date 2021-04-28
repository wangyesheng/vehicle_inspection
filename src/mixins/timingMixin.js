import { getVerificationCodeRes } from "../api";

export default {
  data() {
    return {
      codeText: "60秒后重发",
      loading: false,
    };
  },
  methods: {
    timing(second = 60) {
      setTimeout(() => {
        second--;
        if (second == 0) {
          this.codeText = `重新获取`;
          this.loading = false;
        } else {
          this.codeText = `倒计时 ${second} s`;
          this.timing(second);
        }
      }, 1000);
    },
    async getCode(mobile, enhancer) {
      if (/^1[3-9][0-9]{9}$/.test(mobile)) {
        if (this.loading) return;
        if (enhancer) this.hasGet = false;
        this.loading = true;
        const { code, data } = await getVerificationCodeRes({
          mobile: mobile,
        });
        if (code === 200) {
          this.timing();
          if (enhancer) this.hasGet = true;
        } else {
          uni.showToast({
            icon: "none",
            title: data,
          });
          this.loading = false;
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "请填写正确的手机号码",
        });
      }
    },
  },
};
