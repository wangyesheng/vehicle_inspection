<template>
  <view class="contact-wrap">
    <u-mask :show="maskVisible" :custom-style="{ background: '#fefefe' }" />
    <view class="banner">
      <image
        src="https://cj.huazhe.work/images/shifting-code/mind-tips.png"
        mode="widthFit"
        v-if="!hasInvalid"
      />
      <view :class="!hasInvalid ? 'carnum' : 'invalid'">
        {{ !hasInvalid ? carNum : "该挪车码已作废~" }}
      </view>
    </view>
    <view class="btn-wrap" v-if="!hasInvalid">
      <u-button type="warning" shape="circle" @click="handleCall">
        拨打车主电话
      </u-button>
    </view>
    <view class="tips" v-if="!hasInvalid">
      为了保护双方隐私，本次通话将启用虚拟号码
    </view>
    <view class="pull flex-vc" @click="navTo('/pages/service/outlets')">
      <text>免费领取挪车码</text>
      <image
        src="https://cj.huazhe.work/images/shifting-code/right_arrow.png"
        mode="widthFit"
      />
    </view>
    <EOSBackhome />
  </view>
</template>

<script>
import { getCodeInfoRes, getVirtualMobileRes } from "../../api";
import EOSBackhome from "../../components/eos-backbome";

export default {
  components: {
    EOSBackhome,
  },

  data() {
    return {
      carNum: "",
      maskVisible: true,
      hasInvalid: false,
    };
  },

  onLoad(options) {
    let code;
    if (Object.keys(options).length == 0) {
      code = uni.getStorageSync("shifting_code_value");
    } else {
      const urls = decodeURIComponent(options.q).split("/");
      code = urls[urls.length - 1];
      uni.setStorageSync("shifting_code_value", code);
    }
    this.getCodeInfo(code);
  },

  methods: {
    async getCodeInfo(code) {
      // this.navTo(`/pages/shifting-code/promoter?codeId=178`);
      // return;
      uni.showLoading({
        title: "正在识别中...",
      });
      const appUser = this.getAppUser();
      console.log("appUser", appUser);
      if (!appUser.member_mobile) {
        this.navTo("/pages/auth/login-nav?from=3");
      }
      const { code: _code, data } = await getCodeInfoRes({
        code,
      });
      console.log("getCodeInfoRes", data);
      if (_code == 200) {
        const {
          codeInfo: { uid, id, car_id, number, member_id },
        } = data;
        this.carNum = number;
        uni.setStorageSync("shifting_code_id", id);
        if (car_id == 0) {
          if (appUser.gid == 5) {
            // 推广员
            if (+member_id > 0) {
              uni.setStorageSync("inviter_id", member_id);
              this.navTo(`/pages/shifting-code/enable`);
            } else {
              this.navTo(`/pages/shifting-code/promoter?codeId=${id}`);
            }
          } else {
            if (+member_id > 0) {
              uni.setStorageSync("inviter_id", member_id);
            }
            this.navTo(`/pages/shifting-code/enable`);
          }
        } else if (car_id != 0 && uid == appUser.member_id) {
          this.navTo("/pages/shifting-code/index");
        } else if (car_id != 0 && uid != appUser.member_id) {
          if (!uid && !number) {
            // 绑定该挪车码的车辆被删除了，此时挪车码作废
            this.hasInvalid = true;
          } else {
            // 获取隐私电话
            const { code: __code, data } = await getVirtualMobileRes({
              to_id: uid,
              code,
            });
            if (__code == 200) {
              this.virtualMobile = data.xMobile;
            } else {
              uni.showToast({
                title: data,
                icon: "none",
              });
            }
          }
          this.maskVisible = false;
        }
      }
      uni.hideLoading();
    },
    handleCall() {
      if (this.virtualMobile) {
        uni.makePhoneCall({
          phoneNumber: this.virtualMobile,
          success: (_) => {},
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-wrap {
  position: relative;
  .banner {
    height: 458rpx;
    background: url("https://cj.huazhe.work/images/shifting-code/contact.png");
    background-size: 100% 100%;
    position: relative;
    font-size: 60rpx;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    image {
      position: absolute;
      top: 100rpx;
      left: 80rpx;
      width: 593rpx;
      height: 96rpx;
    }
    .carnum {
      position: absolute;
      top: 250rpx;
      left: 220rpx;
    }
    .invalid {
      position: absolute;
      top: 266rpx;
      left: 220rpx;
      font-size: 40rpx;
      color: #f5f5f5;
    }
  }
  .btn-wrap {
    margin-top: 52rpx;
    padding: 0 30rpx;
    & /deep/ button {
      height: 100rpx;
      line-height: 100rpx;
    }
  }
  .tips {
    margin-top: 30rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
  }
  .pull {
    text-align: center;
    margin-top: 128rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #5e93ec;

    image {
      width: 16rpx;
      height: 26rpx;
      margin-left: 10rpx;
    }
  }
}
</style>
