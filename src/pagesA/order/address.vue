<style lang="scss" scoped>
.address-wrap {
  .pois-wrap {
    .row {
      height: 136rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1rpx solid #f5f5f5;
      .address-details {
        margin-left: 15rpx;
        display: flex;
        flex-direction: column;
        .title {
          font-size: 28rpx;
          font-weight: 500;
          color: #000000;
          margin-bottom: 16rpx;
        }
        .address {
          font-size: 24rpx;
          font-weight: 400;
          color: #999999;
        }
      }
    }
  }
}
</style>

<template>
  <view class="address-wrap">
    <view class="pois-wrap">
      <view
        class="row"
        v-for="item in pois"
        :key="item.id"
      >
        <view>
          <u-icon
            name="map-fill"
            size="28"
          />
        </view>
        <view class="address-details">
          <text class="title">{{item.title}}</text>
          <text class="address">{{item.address}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import QQMapWX from './qqmap-wx-jssdk.min.js';
const qqmapsdk = new QQMapWX({
  key: 'ZLDBZ-FFHK6-7BUSZ-EUH5U-WU72Z-WAFIR',
});

export default {
  data() {
    return {
      pois: [],
    };
  },

  onLoad() {
    this.getLocation();
  },

  methods: {
    getLocation() {
      uni.getLocation({
        success: ({ latitude, longitude }) => {
          qqmapsdk.reverseGeocoder({
            location: `${latitude},${longitude}`, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
            get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
            coord_type: 1,
            success: ({ result: { pois } }) => {
              //成功后的回调
              this.pois = pois;
            },
            fail: (error) => {
              console.log(error);
            },
          });
          //   qqmapsdk.search({
          //     keyword: '金欣佳园B区', //搜索关键词
          //     location: `${latitude},${longitude}`, //设置周边搜索中心点
          //     success: (res) => {
          //       //搜索成功后的回调
          //       console.log(res);
          //     },
          //     fail: (res) => {
          //       console.log(res);
          //     },
          //     complete: (res) => {
          //       console.log(res);
          //     },
          //   });
        },
        fail: () => {
          uni.showToast({
            icon: 'none',
            title: '获取失败，请重试',
          });
        },
      });
    },
  },
};
</script>