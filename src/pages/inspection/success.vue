<template>
  <view
    class="success-containner"
    :style="{ minHeight: `${sysHeight}px` }"
  >
  <u-navbar :is-back="false" :background="{ background: '#5e93ec' }" />
    <view class="banner-wrap">
      <image
        src="https://cj.huazhe.work/images/inspection/success.png"
        mode=""
      />
      <view class="tips-f">预约成功</view>
      <view class="tips-s">恭喜！您的车辆「{{carNum}}」已成功预约年检</view>
      <view class="tips-t">{{info}}</view>
    </view>
    <view class="content-wrap">
      <image
        src="https://cj.huazhe.work/images/inspection/btn-view.png"
        mode="widthFit"
        @click="handleNavTo(1)"
      />
      <image
        src="https://cj.huazhe.work/images/inspection/btn-back.png"
        mode="widthFit"
        @click="handleNavTo(2)"
      />
    </view>
    <view class="footer"> 年检前将会以短信方式通知您 </view>
  </view>
</template>

<script>
export default {
  data() {
    return { sysHeight: 0, carNum: '', info: '' };
  },

  onLoad(options) {
    this.carNum = options.carNum;
    this.info = options.info;
    this.sysHeight = this.getSysHeight();
  },
  
  onShow() {
    uni.hideHomeButton();
  },

  methods: {
    handleNavTo(flag) {
      if (flag == 1) {
        this.navTo('/pages/reservation/index');
      } else {
        uni.switchTab({
          url: '/pages/home/index',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.success-containner {
  background: #f6f6f6;
  .banner-wrap {
    height: 500rpx;
    background: #5e93ec;
    text-align: center;
    font-size: 28rpx;
    font-weight: 400;
    color: #fff;
    image {
      width: 128rpx;
      height: 128rpx;
      margin-top: 60rpx;
      margin-bottom: 40rpx;
    }

    .tips-f {
      font-size: 42rpx;
      font-weight: bold;
      margin-bottom: 59rpx;
    }
    .tips-s {
      margin-bottom: 29rpx;
    }
    .tips-t {
      text-decoration: underline;
    }
  }

  .content-wrap {
    padding: 80rpx 160rpx;
    image {
      width: 430rpx;
      height: 120rpx;
    }
  }

  .footer {
    position: fixed;
    bottom: 50rpx;
    left: 50%;
    margin-left: -180rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #999999;
    text-align: center;
  }
}
</style>