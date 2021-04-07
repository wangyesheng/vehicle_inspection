import Vue from "vue";
import uView from "uview-ui";
import App from "./App";

import { getAppUser } from "./utils/auth";
import { formatTime } from "./utils/time";
import { getLocation } from "./utils/location";
import onShareAppMessageMixin from "./mixins/onShareAppMessageMixin";

/**
 * components
 */
Vue.use(uView);

/**
 * mixins
 */
Vue.mixin(onShareAppMessageMixin);
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

Vue.prototype.getAuthLocation = getLocation;

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
