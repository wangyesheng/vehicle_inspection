<template>
  <view
    class="login-nav-wrap"
    :style="{minHeight:sysHeight+'px'}"
  >
    <view class="logo-wrap">
      <view class="header">
        <image
          src="https://cj.huazhe.work/images/logo.png"
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
    <view class="user-protocol-wrap">
      <text>点击登录即表示同意川B年检</text>
      <text
        class="link"
        @click="handleToUserProtocol"
      >《用户服务协议》</text>
    </view>
    <view class="copyright">本服务由川B年检提供</view>
    <u-popup
      v-model="mobilePopup.visible"
      mode="center"
      border-radius="5"
      class="popup-wrap"
      width="500"
    >
      <view class="title">
        微信授权
      </view>
      <view class="content">
        <image
          src="https://cj.huazhe.work/images/success.png"
          mode="widthFit"
          class="success-icon"
        />
        <view class="tips">微信授权成功</view>
        <u-divider :use-slot="false" />
        <view class="mobile-auth">授权绑定你的手机号码</view>
      </view>
      <view class="footer">
        <button
          class="btn-plain"
          @click="handleReject"
        >
          拒绝
        </button>
        <button
          open-type="getPhoneNumber"
          @getphonenumber="handleGetPhoneNumber"
          class="btn-plain btn-plain_success"
        >
          允许
        </button>
      </view>
    </u-popup>
  </view>
</template>

<script>
import loginMixin from '../../mixins/loginMixin';

export default {
  mixins: [loginMixin],

  data() {
    return {
      sysHeight: 0,
      protocolVisible: false,
    };
  },

  onLoad(options) {
    this.from = options.from;
  },

  mounted() {
    this.sysHeight = this.getSysHeight();
  },

  methods: {
    handleLogin() {
      this.login(this.from);
    },
    handleToUserProtocol() {
      uni.navigateTo({
        url: '/pages/auth/user-protocol',
      });
    },
    handleReject() {
      this.redirect();
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

  .user-protocol-wrap {
    margin-top: 20rpx;

    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #333333;

    .link {
      color: #5e93ec;
    }
  }

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
      background-image: url('https://cj.huazhe.work/images/btn_login.png');
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
}
</style>