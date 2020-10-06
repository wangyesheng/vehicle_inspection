<template>
  <view
    class="login-nav-wrap"
    :style="{height:sysHeight+'px'}"
  >
    <view class="logo-wrap">
      <view class="header">
        <image
          src="../../static/images/logo.png"
          mode="widthFit"
        />
        <text class="pro-desc">川B年检</text>
      </view>
      <view class="desc">一小时快速审车，五颗星贴心服务</view>
    </view>
    <view class="button-wrap">
      <button
        open-type="getUserInfo"
        @tap="handleLogin"
      />
    </view>
    <view class="copyright">本服务由川B年检提供</view>
  </view>
</template>

<script>
import loginMixin from '../../mixins/loginMixin';

export default {
  mixins: [loginMixin],

  data() {
    return {
      sysHeight: 0,
    };
  },

  mounted() {
    this.sysHeight = this.getSysHeight();
  },

  methods: {
    handleLogin() {
      this.login(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.login-nav-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .logo-wrap {
    margin-top: 300rpx;
    margin-bottom: 100rpx;
    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      .pro-desc {
        font-size: 48rpx;
        color: #333;
        font-weight: bold;
        margin-left: 10rpx;
      }
      image {
        width: 52rpx;
        height: 47rpx;
      }
    }
    .desc {
      font-size: 28rpx;
      color: #666;
      margin-top: 20rpx;
    }
  }

  .button-wrap {
    button {
      width: 600rpx;
      height: 90rpx;
      background-image: url('../../static/images/btn_login.png');
      background-size: 100% 100%;
      border-radius: 45rpx;
    }
    button::after {
      border-color: transparent;
    }
  }

  .copyright {
    position: absolute;
    left: 50%;
    bottom: 30rpx;
    margin-left: -125rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #ccc;
    text-align: center;
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
}
</style>