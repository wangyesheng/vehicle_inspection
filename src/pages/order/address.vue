<style lang="scss" scoped>
.address-wrap {
  background: #f5f5f5;
  .search-wrap {
    background: #fff;
    height: 120rpx;
    line-height: 120rpx;
    margin-bottom: 10rpx;
    padding: 0 30rpx;
  }
  .pois-wrap {
    background: #fff;
    .row {
      height: 136rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1rpx solid #f5f5f5;
      padding: 0 32rpx;
      position: relative;

      image {
        width: 22rpx;
        height: 26rpx;
        position: absolute;
        left: 16rpx;
        top: 28rpx;
      }

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
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          overflow: hidden;
          word-break: break-all; /* break-all(允许在单词内换行。) */
          text-overflow: ellipsis; /* 超出部分省略号 */
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 1;
        }
      }
    }
  }
}
</style>

<template>
  <view class="address-wrap">
    <view class="search-wrap">
      <u-search
        placeholder="输入取车地点"
        v-model="keyword"
        :show-action="false"
        @search="handleSearch"
      />
    </view>
    {{ errMsg }}
    <view class="pois-wrap">
      <view
        class="row"
        v-for="item in pois"
        :key="item.id"
        @click="onAddressSelect(item)"
      >
        <view>
          <image src="../../static/images/order/position.png" mode="widthFit" />
        </view>
        <view class="address-details">
          <text class="title">{{ item.title }}</text>
          <text class="address">{{ item.address }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import QQMapWX from "./qqmap-wx-jssdk.min.js";
const qqmapsdk = new QQMapWX({
  key: "V3FBZ-XHZCF-QBMJT-JCCEG-GT4OT-BVFSP",
});

export default {
  data() {
    return {
      keyword: "",
      pois: [],
      errMsg: "",
    };
  },

  onLoad(ops) {
    this.tag = ops.tag;
    this.carId = ops.carId;
    this.getLocation();
  },

  methods: {
    getLocation() {
      this.getAuthLocation(({ latitude, longitude }) => {
        this.latitude = latitude;
        this.longitude = longitude;
        qqmapsdk.reverseGeocoder({
          location: `${latitude},${longitude}`, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
          get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
          coord_type: 1,
          success: ({ result: { pois } }) => {
            //成功后的回调
            this.pois = pois;
          },
          fail: (error) => {
            this.errMsg = JSON.stringify(error);
            console.log("qqmapsdk", error);
            uni.showToast({
              icon: "none",
              title: "获取失败，请重试",
            });
          },
        });
      });
    },
    handleSearch() {
      qqmapsdk.search({
        keyword: this.keyword, //搜索关键词
        location: `${this.latitude},${this.longitude}`, //设置周边搜索中心点
        success: (res) => {
          //搜索成功后的回调
          this.pois = res.data;
        },
        fail: (res) => {
          uni.showToast({
            icon: "none",
            title: "获取失败，请重试",
          });
        },
      });
    },
    onAddressSelect(value) {
      uni.setStorageSync(`${this.tag}_address`, value.title);
      uni.navigateTo({
        url: `/pages/order/index?carId=${this.carId}`,
      });
    },
  },
};
</script>