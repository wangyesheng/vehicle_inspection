<template>
  <view class="me-container">
    <view class="banner-wrap">
      <view class="user-wrap">
        <image
          :src="appUser.member_avatar?appUser.member_avatar:require('../../static/images/me/male.png')"
          mode="widthFit"
        />
        <view
          class="username"
          v-if="appUser.token"
        >
          <text>{{appUser.member_name}}</text>
        </view>
        <view
          class="login-tips"
          v-else
        >
          <button
            class="btn-text"
            open-type="getUserInfo"
            @tap="handleLogin"
          >
            点击登录
          </button>
        </view>
        <view
          class="role-wrap"
          v-if="hasLogin&&appUser.gid!='1'"
        >
          <image
            :src="appUser.gid=='2'?require('../../static/images/me/salesman.png'):require('../../static/images/me/employee.jpg')"
            mode="widthFit"
          />
        </view>
      </view>
    </view>
    <view class="me-content">
      <u-cell-group>
        <u-cell-item
          :title="!hasLogin?'推荐好友免费预约':'我的客户'"
          @click="handleNavTo(1)"
        ></u-cell-item>
        <u-cell-item
          title="我的预约单"
          @click="handleNavTo(2)"
        ></u-cell-item>
        <u-cell-item @click="handleContact">
          <view slot="title">
            <text>联系客服</text>
            <text class="contact-time">（服务时间 08:00-22:00）</text>
          </view>
        </u-cell-item>
      </u-cell-group>
      <view class="copyright">本服务由川B年检提供</view>
    </view>
  </view>
</template>

<script>
import loginMixin from '../../mixins/loginMixin';

export default {
  mixins: [loginMixin],

  data() {
    return {
      appUser: {},
      hasLogin: false,
    };
  },

  onShow() {
    const storageAppUser = this.getAppUser();
    if (storageAppUser.member_mobile) {
      this.appUser = storageAppUser;
      this.hasLogin = true;
    }
  },

  methods: {
    handleNavTo(flag) {
      if (!this.checkLogin()) {
        uni.navigateTo({
          url: `/pages/auth/login-nav`,
        });
        return;
      }
      switch (flag) {
        case 1:
          this.navTo('/pages/me/customer');
          break;
        case 2:
          this.navTo('/pages/reservation/index');
          break;
        case 3:
          this.navTo();
          break;
        default:
          break;
      }
    },
    handleLogin() {
      this.login(2);
    },
    handleContact() {
      uni.makePhoneCall({
        phoneNumber: '15680331333',
        success: (_) => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.me-container {
  background: #f6f6f6;
  height: 100vh;
  position: relative;
  .banner-wrap {
    background-image: url('../../static/images/me/banner.png');
    background-size: 100% 100%;
    height: 420rpx;
    width: 100%;
    padding: 60rpx 285rpx 120rpx;
    .user-wrap {
      height: 240rpx;
      width: 180rpx;
      text-align: center;
      image {
        width: 180rpx;
        height: 180rpx;
        border-radius: 50%;
      }
      .login-tips {
        margin-top: 10rpx;
        button::after {
          border: none;
        }
      }
      .username {
        margin-top: 30rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #ffffff;
      }
      .role-wrap {
        margin-top: 23rpx;
        text-align: center;
        image {
          width: 90rpx;
          height: 40rpx;
          border-radius: 0;
        }
      }
    }
  }
  .me-content {
    .contact-time {
      font-size: 28rpx;
      font-weight: 400;
      color: #666;
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
}
</style>