<template>
  <view
    class="bind-mobile-wrap"
    :style="{height:sysHeight+'px'}"
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
import { bindMobileRes, getVerificationCodeRes } from '../../api';

export default {
  data() {
    return {
      sysHeight: 0,
      mobile: '',
      code: '',
      loading: false,
      codeText: '倒计时 60 s',
      hasGet: false,
    };
  },

  mounted() {
    const sysHeight = uni.getSystemInfoSync().windowHeight;
    this.sysHeight = sysHeight;
  },

  methods: {
    async handleSubmit() {
      const res = await bindMobileRes({
        code: this.code,
        mobile: this.mobile,
      });
    },
    async handleGetCode() {
      if (this.mobile.length === 11) {
        if (this.loading) return;
        this.hasGet = false;
        this.loading = true;
        const { code, data } = await getVerificationCodeRes({
          mobile: this.mobile,
        });
        if (code === 200) {
          this.timing();
          this.hasGet = true;
        } else {
          uni.showToast({
            icon: 'none',
            title: data,
          });
          this.loading = false;
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: '请填写正确的手机号码',
        });
      }
    },
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