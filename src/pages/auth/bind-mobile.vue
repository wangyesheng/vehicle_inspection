<template>
  <view
    class="bind-mobile-wrap"
    :style="{ minHeight: sysHeight+'px'}"
  >
    <view class="logo-wrap">
      <view class="header">
        <text class="pro-desc">绑定手机号</text>
      </view>
      <view class="desc">为方便联系，请输入常用手机号码</view>
    </view>
    <view class="content-wrap">
      <view class="mobile">
        <input
          v-model="mobile"
          placeholder="请输入手机号"
        />
      </view>
      <view class="code">
        <input
          v-model="code"
          placeholder="请输入验证码"
        />
        <view
          v-if="loading"
          class="msg timing"
        >{{ codeText }}</view>
        <view
          class="msg"
          @click="handleGetCode"
          v-else-if="hasGet"
        >{{ codeText }}</view>
        <view
          class="msg"
          @click="handleGetCode"
          v-else
        >获取验证码</view>
      </view>
      <u-button
        type="warning"
        shape="circle"
        @click="handleSubmit"
      >
        确认绑定
      </u-button>
    </view>
    <view class="copyright">本服务由川B年检提供</view>
  </view>
</template>

<script>
import { bindMobileRes } from '../../api';
import timingMixin from '../../mixins/timingMixin';

export default {
  data() {
    return {
      sysHeight: 0,
      mobile: '',
      code: '',
      codeText: '倒计时 60 s',
      hasGet: false,
    };
  },

  mixins: [timingMixin],

  mounted() {
    this.sysHeight = this.getSysHeight();
  },

  onLoad(options) {
    this.from = +options.from;
  },

  methods: {
    async handleSubmit() {
      const { code } = await bindMobileRes({
        code: this.code,
        mobile: this.mobile,
      });
      if (code === 200) {
        const appUser = this.getAppUser();
        appUser.member_mobile = this.mobile;
        uni.setStorageSync('app_user', JSON.stringify(appUser));
        this.from === 1
          ? uni.switchTab({
              url: '/pages/home/index',
            })
          : uni.switchTab({
              url: '/pages/me/index',
            });
      }
    },
    handleGetCode() {
      this.getCode(this.mobile, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.bind-mobile-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .logo-wrap {
    margin-top: 122rpx;
    margin-bottom: 97rpx;
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

  .content-wrap {
    input {
      width: 634rpx;
      height: 90rpx;
      background: #f6f6f6;
      border: 1rpx solid #e6e6e6;
      border-radius: 45rpx;
      padding-left: 49rpx;
      font-size: 30rpx;
      font-weight: 500;
      color: #9a9a9a;
    }

    .mobile {
      margin-bottom: 40rpx;
    }

    .code {
      margin-bottom: 80rpx;
      position: relative;
      .msg {
        font-size: 30rpx;
        font-weight: 500;
        color: #5e94ec;
        position: absolute;
        top: 24rpx;
        right: 49rpx;
        z-index: 100;
      }
      .timing {
        color: #9a9a9a;
      }
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