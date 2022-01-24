<template>
  <view class="me-container">
    <view class="banner-wrap">
      <view class="user-wrap">
        <image
          :src="
            appUser.member_avatar
              ? appUser.member_avatar
              : 'https://cj.huazhe.work/images/me/male.png'
          "
          mode="widthFit"
        />
        <view class="username" v-if="appUser.token">
          <text>{{ appUser.member_name }}</text>
        </view>
        <view class="login-tips" v-else>
          <button class="btn-text" @click="handleLogin">点击登录</button>
        </view>
        <view class="role-wrap" v-if="hasLogin && appUser.gid != '1'">
          <image
            :src="
              appUser.gid == '9'
                ? require('../../static/images/tpy.png')
                : appUser.gid == '2'
                ? 'https://cj.huazhe.work/images/me/salesman.png'
                : 'https://cj.huazhe.work/images/me/employee.png'
            "
            :class="appUser.gid == '9' ? 'tpy' : ''"
            mode="widthFit"
          />
        </view>
      </view>
    </view>
    <view class="me-content">
      <u-cell-group>
        <u-cell-item
          :title="!hasLogin ? '推荐好友免费预约' : '我的客户'"
          @click="handleNavTo(1)"
        />
        <u-cell-item title="我的权益" @click="handleNavTo(4)" />
        <u-cell-item title="我的预约单" @click="handleNavTo(3)" />
        <!-- <u-cell-item title="代驾预约单" @click="handleNavTo(3)" /> -->
        <u-cell-item @click="handleContact">
          <view slot="title">
            <text>联系客服</text>
            <text class="contact-time">（服务时间 {{ customer_times }}）</text>
          </view>
        </u-cell-item>
        <!-- <u-cell-item
          title="客服微信"
          @click="handleShowWechat(2)"
        ></u-cell-item> -->
      </u-cell-group>
      <view class="copyright">本服务由川B年检提供</view>
    </view>
    <u-popup v-model="wechatPopupVisible" mode="center" border-radius="5">
      <view class="wechat-popup">
        <image
          src="https://cj.huazhe.work/images/me/wechat.jpg"
          mode="aspectFit"
          @click="handlePreview"
        />
      </view>
    </u-popup>
  </view>
</template>

<script>
import loginMixin from "../../mixins/loginMixin";
import { currentHours } from "../../utils/time";
import { getCustomerRes, getUserinfoRes } from "../../api";

export default {
  mixins: [loginMixin],

  data() {
    return {
      appUser: {},
      hasLogin: false,
      wechatPopupVisible: false,
      customer_times: "",
      customer_phone: "",
    };
  },

  onLoad() {
    this.getUserinfo();
  },

  onShow() {
    this.getCustomer();
    const storageAppUser = this.getAppUser();
    if (storageAppUser.member_mobile) {
      this.appUser = storageAppUser;
      this.hasLogin = true;
    }
  },

  methods: {
    async getUserinfo() {
      const {
        data: {
          info: { gid },
        },
      } = await getUserinfoRes();
      if (gid) {
        this.appUser.gid = gid;
        uni.setStorageSync("app_user", JSON.stringify(this.appUser));
      }
    },
    handleNavTo(flag) {
      if (!this.checkLogin()) {
        uni.navigateTo({
          url: "/pages/auth/login-nav?from=2",
        });
        return;
      }
      switch (flag) {
        case 1:
          this.navTo("/pages/me/customer");
          break;
        case 2:
          this.navTo("/pages/reservation/index");
          break;
        case 3:
          this.navTo("/pages/reservation/drive");
          break;
        case 4:
          this.navTo("/pages/activity/index");
          break;
      }
    },
    handleLogin() {
      uni.navigateTo({
        url: "/pages/auth/login-nav?from=2",
      });
    },
    async getCustomer() {
      const {
        data: { customer_phone, customer_times },
      } = await getCustomerRes();
      this.customer_phone = customer_phone;
      this.customer_times = customer_times;
    },
    handleContact() {
      const [start, , end] = this.customer_times.match(/\d+/g);
      if (start <= currentHours && currentHours <= end) {
        uni.makePhoneCall({
          phoneNumber: this.customer_phone,
          success: (_) => {},
        });
      } else {
        uni.showToast({
          title: "请在服务时间内拨打电话~",
          icon: "none",
        });
      }
    },
    handleShowWechat() {
      this.wechatPopupVisible = true;
    },
    handlePreview(e) {
      wx.previewImage({
        current: e.target.dataset.src,
        urls: [e.target.dataset.src],
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
    background-image: url("https://cj.huazhe.work/images/me/banner.png");
    background-size: 100% 100%;
    height: 420rpx;
    width: 100%;
    padding: 60rpx 120rpx 120rpx;
    .user-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .refresh {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        top: -20rpx;
        right: 146rpx;
        z-index: 99;
      }
      image {
        width: 180rpx;
        height: 180rpx;
        border-radius: 100%;
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
        .tpy {
          width: 148rpx;
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
