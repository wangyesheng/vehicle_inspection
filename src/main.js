import Vue from "vue";
import uView from "uview-ui";
import App from "./App";

import { getAppUser } from "./utils/auth";
import { formatTime } from "./utils/time";
import onShareAppMessageMixin from "./mixins/onShareAppMessageMixin";
import onShareTimelineMixin from "./mixins/onShareTimelineMixin";

/**
 * components
 */
Vue.use(uView);

/**
 * mixins
 */
Vue.mixin(onShareAppMessageMixin);
Vue.mixin(onShareTimelineMixin);

/**
 * filters
 */
Vue.filter("formatTimeFilter", function(value) {
  return formatTime(value);
});

/**
 * prototypes
 */
Vue.prototype.getAppUser = getAppUser;

Vue.prototype.checkLogin = function() {
  return getAppUser().member_mobile ? true : false;
};

Vue.prototype.navTo = function(url) {
  uni.navigateTo({
    url,
  });
};

Vue.prototype.getSysHeight = function() {
  return uni.getSystemInfoSync().windowHeight;
};

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
