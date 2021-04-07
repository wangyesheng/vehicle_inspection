export function getLocation(callback) {
  uni.authorize({
    scope: "scope.userLocation",
    success: (_) => {
      uni.getLocation({
        success: async (res) => {
          callback({
            latitude: res.latitude,
            longitude: res.longitude,
          });
        },
        fail() {
          uni.showToast({
            icon: "none",
            title: "获取失败，请重试~",
          });
        },
      });
    },
    fail: (_) => {
      uni.showModal({
        title: "温馨提示",
        content: "为了更好的为您服务，请授权位置信息~",
        success(res) {
          if (res.confirm) {
            uni.openSetting({
              success(res) {
                if (res.authSetting["scope.userLocation"]) {
                  uni.getLocation({
                    success: async (res) => {
                      callback({
                        latitude: res.latitude,
                        longitude: res.longitude,
                      });
                    },
                  });
                }
              },
            });
          } else {
            uni.showToast({
              icon: "none",
              title: "未授权位置信息~",
            });
          }
        },
      });
    },
  });
}
