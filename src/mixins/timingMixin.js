export default {
  data: {
    codeText: "倒计时 60 s",
    loading: false,
    test: "111",
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
  },
};
