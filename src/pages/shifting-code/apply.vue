<style lang="scss" scoped>
.apply-wrap {
  position: relative;
  .banner {
    height: 400rpx;
    background: url('https://cj.huazhe.work/images/shifting-code/apply_bg.png');
    background-size: 100% 100%;
  }
  .introduction {
    position: absolute;
    top: 300rpx;
    left: 0;
    text-align: center;
    padding-bottom: 150rpx;
    image {
      &:first-child {
        width: 729rpx;
        height: 439rpx;
      }
      &:last-child {
        width: 729rpx;
        height: 539rpx;
      }
    }
  }
  .footer-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    height: 150rpx;
    background: #fff;
    padding: 25rpx 30rpx;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  }
}
</style>

<template>
  <view class="apply-wrap">
    <view class="banner"> </view>
    <view class="introduction">
      <image
        src="https://cj.huazhe.work/images/shifting-code/permission.png"
        mode="widthFit"
      />
      <image src="https://cj.huazhe.work/images/shifting-code/use.png" mode="widthFit" />
    </view>
    <view class="footer-wrap">
      <u-button
        type="warning"
        shape="circle"
        @click="navTo('/pages/service/outlets')"
      >
        查看免费领取地点
      </u-button>
    </view>
  </view>
</template>
