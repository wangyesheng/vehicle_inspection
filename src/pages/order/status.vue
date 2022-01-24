<template>
  <view
    class="order-status-wrap"
    :style="{ minHeight: `${sysHeight}px` }"
  >
    <view class="process-wrap">
      <view class="status">
        <image
          src="../../static/images/order/complete.png"
          mode="widthFit"
        />
        <text>预约代办成功</text>
      </view>
      <view class="price">
        ¥ 0.00
      </view>
    </view>
    <view class="details-wrap">
      <view class="info">
        <view class="info-row important">
          <text>预约取车日期</text>
          <text>{{order.appoint_date}}</text>
        </view>
        <view class="info-row mb26">
          <text>送检车辆</text>
          <text>{{order._carNum}}</text>
        </view>
        <view class="info-row mb26">
          <text>联系人</text>
          <text>{{order.linkname}}</text>
        </view>
        <view class="info-row">
          <text>联系电话</text>
          <text>{{order.mobile}}</text>
        </view>
      </view>
      <view class="position mt30">
        <text>取车位置：</text>
        <!-- <view class="p-pos">取车位置</view> -->
        <text>{{order.pick_address}}</text>
      </view>
      <view class="position mt30">
        <text>还车位置：</text>
        <text>{{order.return_address}}</text>
      </view>

      <view class="station-wrap mt30">
        <view class="header">
          已为您匹配最近检测站
        </view>
        <view
          class="content"
          v-for="item in stations"
          :key="item"
        >
          <image
            :src="item._img"
            mode="widthFit"
          />
          <view class="station-info">
            <view class="name">{{ item.name }}</view>
            <view class="address">
              {{ item.address }}
            </view>
            <view class="distance">{{ item.juli + item.unit }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="footer-wrap">
      <u-button
        type="warning"
        shape="circle"
        @click="navTo('/pages/reservation/drive')"
      >查看预约单</u-button>
    </view>
  </view>
</template>

<script>
import { getStationsRes } from '../../api';

export default {
  onLoad() {
    this.sysHeight = this.getSysHeight();
    this.order = uni.getStorageSync('agent_appointment_order');
    this.cars = uni.getStorageSync('app_user_cars');
    this.order._carNum = this.cars.find(
      (x) => this.order.car_id == x.id
    ).number;
    this.getStations();
  },

  data() {
    return {
      sysHeight: 0,
      stations: [],
      order: {},
    };
  },

  methods: {
    getStations() {
      this.getAuthLocation(async (res) => {
        const {
          code,
          data: { carList },
        } = await getStationsRes({
          lng: res.longitude,
          lat: res.latitude,
        });
        if (code === 200) {
          this.stations = carList.map((x) => ({
            ...x,
            _img: `https://cj.huazhe.work/${x.img}`,
          }));
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-status-wrap {
  position: relative;
  background: #f6f6f6;
  .mt30 {
    margin-top: 30rpx;
  }
  .mb26 {
    margin-bottom: 26rpx;
  }
  .station-wrap {
    .header {
      height: 100rpx;
      line-height: 100rpx;
      border-bottom: 1rpx solid rgb(233, 230, 230);
      background: #fff;
      padding-left: 36rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #666666;
    }
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid #f2f2f2;
      background: #fff;
      padding: 58rpx 0;
      padding-left: 36rpx;

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
  .process-wrap {
    height: 300rpx;
    background: #5e93ec;
    padding: 38rpx 36rpx;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 36rpx;
    font-weight: 500;
    .status {
      display: flex;
      line-height: 84rpx;

      image {
        width: 84rpx;
        height: 84rpx;
        margin-right: 30rpx;
      }
    }
    .price {
      line-height: 84rpx;
    }
  }
  .details-wrap {
    position: absolute;
    top: 200rpx;
    left: 30rpx;
    padding-bottom: 136rpx;
    .info {
      width: 690rpx;
      background: #ffffff;
      border-radius: 12rpx;
      padding: 36rpx;

      .info-row {
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;
        display: flex;
        justify-content: space-between;
      }

      .important {
        font-size: 32rpx;
        font-weight: 500;
        color: #000000;
        margin-bottom: 35rpx;
      }
    }

    .position {
      width: 690rpx;
      height: 100rpx;
      line-height: 100rpx;
      background: #ffffff;
      border-radius: 12rpx;
      padding: 0 36rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #666666;
      display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
      overflow: hidden;
      word-break: break-all; /* break-all(允许在单词内换行。) */
      text-overflow: ellipsis; /* 超出部分省略号 */
      -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 1;
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
  }
}
</style>