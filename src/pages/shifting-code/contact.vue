<template>
  <view class="contact-wrap">
    <view class="banner">
      <image
        src="../../static/images/shifting-code/mind-tips.png"
        mode="widthFit"
      />
      <view class="carnum">{{carNum}}</view>
    </view>
    <view class="btn-wrap">
      <u-button
        type="warning"
        shape="circle"
      >拨打车主电话</u-button>
    </view>
    <view class="tips"> 为了保护双方因此，本次通话将启用虚拟号码 </view>
    <view class="pull flex-vc">
      <text>免费领取挪车码</text>
      <image
        src="../../static/images/shifting-code/right_arrow.png"
        mode="widthFit"
      />
    </view>
  </view>
</template>

<script>
import { getCodeInfoRes } from '../../api';

export default {
  data() {
    return {
      carNum: '',
    };
  },

  onLoad(options) {
    let code;
    if (Object.keys(options).length == 0) {
      code = uni.getStorageSync('shifting_code_value');
    } else {
      const urls = decodeURIComponent(options.q).split('/');
      code = urls[urls.length - 1];
      uni.setStorageSync('shifting_code_value', code);
    }
    this.getCodeInfo(code);
  },

  methods: {
    async getCodeInfo(code) {
      uni.showLoading({
        title: '正在识别中...',
      });
      const appUser = this.getAppUser();
      if (!appUser.member_mobile) {
        this.navTo('/pages/auth/login-nav?from=3');
      }
      const { code: _code, data } = await getCodeInfoRes({
        code,
      });
      console.log('===========', data);
      if (_code == 200) {
        const {
          codeInfo: { uid, id, car_id, number },
        } = data;
        this.carNum = number;
        uni.setStorageSync('shifting_code_id', id);
        if (car_id == 0) {
          this.navTo('/pages/shifting-code/enable');
        } else if (car_id != 0 && uid == appUser.member_id) {
          this.navTo('/pages/shifting-code/index');
        }
      }
      uni.hideLoading();
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-wrap {
  .banner {
    height: 458rpx;
    background: url('../../static/images/shifting-code/contact.png');
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