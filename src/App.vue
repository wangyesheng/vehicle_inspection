<script>
export default {
  onLaunch: function () {
    console.log('App Launch');
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';

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
