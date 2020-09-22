<template>
  <view class="reservation-container" :style="{ height: `${sysHeight}px` }">
    <view class="order-wrap" v-for="item in 3" :key="item">
      <view class="top-wrap">
        <view class="header">
          <text class="station-name">锦泰机动车检测站</text>
          <text>预约中</text>
        </view>
        <view class="content">
          <view class="info-item mb">
            <text class="label">送检车辆 </text>
            <text class="value">川B88888</text>
          </view>
          <view class="info-item mb">
            <text class="label">预约时间</text>
            <text class="value">09月04日 周一 14:00-15:00</text>
          </view>
          <view class="info-item">
            <text class="label">机构位置 </text>
            <text class="value">四川省成都市锦江区锦逸路29号</text>
          </view>
        </view>
      </view>
      <view class="bottom-wrap">
        <text class="primary-color" @click="handleOpenApp">一键导航</text>
        <text class="primary-color">联系电话</text>
        <text>取消预约</text>
      </view>
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

  onLoad() {
    const sysHeight = uni.getSystemInfoSync().windowHeight;
    this.sysHeight = sysHeight;
  },

  methods: {
    handleOpenApp() {
      uni.getLocation({
        type: "wgs84",
        geocode: "true",
        success: (response) => {
          console.log(response);
          const { latitude, longitude } = response;
          uni.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 18,
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reservation-container {
  background: #f6f6f6;
  .order-wrap {
    background: #fff;
    margin-bottom: 20rpx;
    .top-wrap {
      padding: 40rpx 32rpx;
      border-bottom: 2rpx solid #f2f2f2;
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 38rpx;
        .station-name {
          font-size: 36rpx;
          font-weight: bold;
          color: #000;
        }
      }
      .content {
        .mb {
          margin-bottom: 22rpx;
        }
        .info-item {
          font-size: 28rpx;
          font-weight: 400;
          .label {
            color: #666666;
            margin-right: 22rpx;
          }
          .value {
            color: #343434;
          }
        }
      }
    }
    .bottom-wrap {
      display: flex;
      justify-content: space-between;
      padding: 26rpx 70rpx;
    }
  }
}
</style>