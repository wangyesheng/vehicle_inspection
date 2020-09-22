<template>
  <view class="inspection-containner">
    <view class="station-wrap" v-for="item in 3" :key="item">
      <image src="../../static/images/inspection/station.jpg" mode="widthFit" />
      <view class="station-info">
        <view class="name">锦泰机动车检测站</view>
        <view class="address">
          四川省成都市锦江区锦逸南路12号锦江区锦逸南路12号
        </view>
        <view class="distance">659m</view>
      </view>
      <u-button type="primary" size="medium" @click="handleSubmit">
        立即预约
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    handleSubmit() {
      this.navTo("/pages/inspection/car");
    },
  },
};
</script>

<style lang="scss" scoped>
.inspection-containner {
  .station-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx;
    border-bottom: 1rpx solid #f2f2f2;
    & /deep/ .u-btn {
      border-radius: 4rpx;
    }
    image {
      width: 120rpx;
      height: 120rpx;
    }
    .station-info {
      flex: 1;
      width: 400rpx;
      padding: 0 26rpx 0 22rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #666;
      .name {
        font-size: 36rpx;
        font-weight: bold;
        color: #000;
        padding-bottom: 10rpx;
      }
      .address {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-bottom: 10rpx;
      }
      .distance {
        color: #9a9a9a;
      }
    }
  }
}
</style>