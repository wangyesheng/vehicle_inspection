<script>
export default {
  onLaunch: function () {
    const updateManager = uni.getUpdateManager();
    if (updateManager) {
      updateManager.onCheckForUpdate(function (res) {
        console.log("onCheckForUpdate", res.hasUpdate);
      });
      updateManager.onUpdateReady(function () {
        uni.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
      updateManager.onUpdateFailed(function () {
        uni.showModal({
          title: "更新提示",
          content: "新版本下载失败！",
          showCancel: false,
        });
      });
    }
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary-color {
  color: $u-type-primary;
}

.btn-text {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  outline: none;
  margin: 0;
  padding: 20rpx;
  font-size: 32rpx;
  color: #fff;
  background: transparent;
  font-weight: bold;
}

.flex-center {
  display: flex;
  align-items: center;
}

.flex-vc {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-01 {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.popup-wrap {
  button {
    font-size: 32rpx;
    height: 100%;
    line-height: 80rpx;
    background: transparent;
    border-radius: 80rpx;
    color: #000;
    margin: 20rpx 0;
  }
  button::after {
    border-color: transparent;
  }
  .btn-plain {
    width: 50%;
    border-radius: 0;
    border: 1rpx solid $u-border-color;
    font-size: 26rpx;
    margin: 0;
    font-weight: 500;
  }

  .btn-plain_success {
    color: $u-type-success;
  }
  .title {
    padding: 20rpx;
    text-align: center;
    font-size: 32rpx;
    color: #000;
    font-weight: 500;
    border-bottom: 1rpx solid $u-border-color;
  }
  .content {
    text-align: center;
    padding: 20rpx 0;
    .success-icon {
      width: 96rpx;
      height: 96rpx;
    }
    .tips {
      font-size: 28rpx;
      color: #000;
      font-weight: 500;
      padding: 20rpx 0;
    }
    .mobile-auth {
      font-size: 24rpx;
      color: #999;
      padding: 20rpx 0;
    }
  }
  .footer {
    display: flex;
  }
}
</style>
