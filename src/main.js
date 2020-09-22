import Vue from "vue";
import uView from "uview-ui";
import App from "./App";
import { formatTime } from "./utils/time";

Vue.use(uView);

Vue.filter("formatTimeFilter", function(value) {
  return formatTime(value);
});

Vue.prototype.checkLogin = function() {
  return uni.getStorageSync("app_user_mobile") ? true : false;
};

Vue.prototype.navTo = function(url) {
  uni.navigateTo({
    url,
  });
};

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();

// function getCountDays() {
//   var curDate = new Date();
//   /* 获取当前月份 */
//   var curMonth = curDate.getMonth();
//   /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
//   curDate.setMonth(curMonth + 3);
//   /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
//   curDate.setDate(0);
//   /* 返回当月的天数 */
//   return curDate.getDate();
// }

// console.log(getCountDays())
