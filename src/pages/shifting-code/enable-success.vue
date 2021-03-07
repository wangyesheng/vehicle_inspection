<template>
  <view class="success-wrap">
    <view class="banner"></view>
    <view class="btn-wrap">
      <u-button
        type="warning"
        shape="circle"
        @click="navTo('/pages/shifting-code/index')"
      >查看我的挪车码</u-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.success-wrap {
  .banner {
    height: 480rpx;
    background: url('../../static/images/shifting-code/success.png');
    background-size: 100% 100%;
  }
  .btn-wrap {
    margin-top: 90rpx;
    padding: 0 30rpx;
    & /deep/ button {
      height: 100rpx;
      line-height: 100rpx;
    }
  }
}
</style>