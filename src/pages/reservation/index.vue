<template>
  <view
    class="reservation-container"
    :style="{ minHeight: `${sysHeight}px` }"
  >
    <view
      class="order-wrap"
      v-for="item in myAppointments"
      :key="item"
    >
      <view class="top-wrap">
        <view class="header">
          <text class="station-name">{{item.pigsarInfo.name}}</text>
          <text>{{item._status}}</text>
        </view>
        <view class="content">
          <view class="info-item mb">
            <text class="label">送检车辆 </text>
            <text class="value">{{item.carInfo.number}}</text>
          </view>
          <view class="info-item mb">
            <text class="label">预约时间</text>
            <text class="value">{{item._time}}</text>
          </view>
          <view class="info-item">
            <text class="label">机构位置 </text>
            <text class="value">{{item.pigsarInfo.address}}</text>
          </view>
        </view>
      </view>
      <view class="bottom-wrap">
        <text
          class="primary-color"
          @click="handleOpenApp(item)"
        >一键导航</text>
        <text
          class="primary-color"
          @click="handleCallPhone(item)"
        >联系电话</text>
        <text>取消预约</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getMyAppointmentsRes } from '../../api';
import { APPOINTMENT_TIMES } from '../../constant';

export default {
  data() {
    return {
      sysHeight: 0,
      myAppointments: [],
    };
  },

  onLoad() {
    this.sysHeight = this.getSysHeight();
    this.getMyAppointments();
  },

  methods: {
    async getMyAppointments() {
      const {
        data: { reserveList },
      } = await getMyAppointmentsRes();
      this.myAppointments = reserveList.map((x) => {
        const scope = APPOINTMENT_TIMES.find((y) => y.key === x.rid);
        x._time = x.date + ' ' + scope.value;
        x._status =
          x.status === '0' ? '预约中' : x.status === '1' ? '结束' : '取消';
        return x;
      });
    },
    handleOpenApp(item) {
      uni.openLocation({
        latitude: Number(item.pigsarInfo.lat),
        longitude: Number(item.pigsarInfo.lng),
        name: item.pigsarInfo.address,
      });
    },
    handleCallPhone(item) {
      uni.makePhoneCall({
        phoneNumber: item.pigsarInfo.mobile,
        success: (_) => {},
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