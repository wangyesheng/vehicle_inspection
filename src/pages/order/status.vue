<template>
  <view
    class="order-status-wrap"
    :style="{ minHeight: `${sysHeight}px` }"
  >
    <view class="process-wrap"></view>
    <view class="details-wrap">
      <view class="info">

      </view>
      <view class="position mt20"></view>
      <view class="position mt20"></view>
    </view>
    <view class="footer-wrap">
      <u-button>取消订单</u-button>
      <u-button type="warning">立即支付</u-button>
    </view>
  </view>
</template>

<script>
export default {
  onLoad() {
    this.sysHeight = this.getSysHeight();
  },

  data() {
    return {
      sysHeight: 0,
    };
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.order-status-wrap {
  position: relative;
  background: #f6f6f6;
  .mt20 {
    margin-top: 20rpx;
  }
  .process-wrap {
    height: 300rpx;
    background: #5e93ec;
  }
  .details-wrap {
    position: absolute;
    top: 200rpx;
    left: 30rpx;
    .info {
      width: 690rpx;
      height: 272rpx;
      background: #ffffff;
      border-radius: 12rpx;
    }

    .position {
      width: 690rpx;
      height: 100rpx;
      background: #ffffff;
      border-radius: 12rpx;
    }
  }
  .footer-wrap {
    width: 100%;
    height: 120rpx;
    padding: 15rpx 30rpx;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;

    & /deep/ .u-size-default {
      width: 320rpx !important;
    }
  }
}
</style>