<template>
  <view class="inspection-containner">
    <view class="station-wrap" v-for="item in stations" :key="item">
      <image :src="item._img" mode="widthFit" />
      <view class="station-info">
        <view class="name">{{ item.name }}</view>
        <view class="address">
          {{ item.address }}
        </view>
        <view class="distance">{{ item.juli + item.unit }}</view>
      </view>
      <u-button
        type="primary"
        size="medium"
        @click="handleSubmit(item.id, item.name)"
      >
        立即预约
      </u-button>
    </view>
  </view>
</template>

<script>
import { getInspectionStationsRes } from "../../api";
export default {
  data() {
    return {
      stations: [],
    };
  },

  onLoad(options) {
    this.carId = options.carId;
    this.getStations();
  },

  methods: {
    getStations() {
      uni.getLocation({
        type: "wgs84",
        success: async (res) => {
          const {
            code,
            data: { carList },
          } = await getInspectionStationsRes({
            lng: res.longitude,
            lat: res.latitude,
          });
          if (code === 200) {
            this.stations = carList.map((x) => ({
              ...x,
              _img: `https://cj.huazhe.work/${x.img}`,
            }));
          }
        },
      });
    },
    handleSubmit(id, name) {
      this.navTo(
        `/pages/inspection/car-reservation?stationId=${id}&stationName=${name}&carId=${this.carId}`
      );
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