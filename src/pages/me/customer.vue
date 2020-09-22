<template>
  <view class="customer-container" :style="{ minHeight: sysHeight + 'px' }">
    <u-navbar
      title="林筱沫的客户"
      title-color="#fff"
      back-icon-color="#fff"
      back-icon-name="arrow-left"
      :background="{ background: '#5e93ec' }"
    />
    <view class="unit-wrap">
      <view class="label">已发展协议单位</view>
      <view class="value">
        <text>3家</text>
        <u-icon name="arrow-right" />
      </view>
    </view>
    <view class="content-wrap">
      <view class="record-wrap" v-for="item in 13" :key="item">
        <image src="../../static/images/me/male.png" mode="widthFit" />
        <view>
          <view class="name">钱多多</view>
          <view class="time">邀请注册时间：2020-09-03 18:00:03</view>
        </view>
      </view>
    </view>
    <view class="footer-wrap">
      <u-button type="warning" shape="circle">微信邀请</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      sysHeight: 0,
    };
  },

  mounted() {
    const sysHeight = uni.getSystemInfoSync().windowHeight;
    this.sysHeight = sysHeight;
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.customer-container {
  background: #5e93ec;
  padding: 30rpx;
  position: relative;
  z-index: 1;
  .content-wrap {
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(94, 148, 236, 0.2);
    border-radius: 8rpx;
    padding: 20rpx 0 120rpx;
    .record-wrap {
      border-bottom: 1rpx solid #f2f2f2;
      padding: 35rpx 30rpx;
      display: flex;
      align-items: center;
      image {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      .name {
        font-size: 32rpx;
        font-weight: 500;
        color: #343434;
        margin-bottom: 25rpx;
      }
      .time {
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(120, 120, 120, 0.8);
      }
    }
  }

  .footer-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    height: 120rpx;
    background: #fff;
    padding: 15rpx 30rpx;
  }

  .unit-wrap {
    height: 100rpx;
    background: #fff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(94, 148, 236, 0.2);
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    padding: 32rpx 35rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      font-size: 32rpx;
      font-weight: bold;
      color: #000000;
    }
    .value {
      font-size: 28rpx;
      font-weight: 400;
      color: #9a9a9a;

      & /deep/ .u-icon {
        position: relative;
        left: 0;
        bottom: 2rpx;
      }
    }
  }
}
</style>