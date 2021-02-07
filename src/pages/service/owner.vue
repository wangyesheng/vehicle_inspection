<style lang="scss" scoped>
.owner-wrap {
  .advertising-wrap {
    height: 240rpx;
    line-height: 240rpx;
    background: #1f5ffd;
    font-size: 48rpx;
    font-weight: 500;
    color: #fff;
    text-align: center;
  }
  .main-wrap {
    padding: 50rpx 30rpx 0;
    .inner-wrap {
      height: 240rpx;
      background: #fff;
      box-shadow: 0 0 20rpx 0 rgba(94, 147, 236, 0.2);
      border-radius: 8rpx;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .col {
        width: 172rpx;
        height: 172rpx;
        border: 1px solid #999;
      }
    }
  }
}
</style>

<template>
  <view class="owner-wrap">
    <view class="advertising-wrap">广告位</view>
    <view class="main-wrap">
      <view class="inner-wrap">
        <view class="col">
        </view>
        <view class="col"></view>
        <view class="col"></view>
      </view>
    </view>
  </view>
</template>


