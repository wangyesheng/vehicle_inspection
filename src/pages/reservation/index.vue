<template>
  <!-- v-if="myAppointments.length" -->
  <view>
    <u-tabs
      :list="[{name:'我的预约单'},{name:'我的代驾单'}]"
      :is-scroll="false"
      :current="current"
      @change="onTabChange"
    />
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
            <text :class="['station-name',item._classname]">{{item.pigsarInfo.name}}</text>
            <text :class="item._classname">{{item._status}}</text>
          </view>
          <view class="content">
            <view class="info-item mb">
              <text :class="['label',item._classname]">送检车辆 </text>
              <text :class="['value',item._classname]">{{item.carInfo.number}}</text>
            </view>
            <view class="info-item mb">
              <text :class="['label',item._classname]">预约时间</text>
              <text :class="['value',item._classname]">{{item._time}}</text>
            </view>
            <view class="info-item">
              <text :class="['label',item._classname]">机构位置 </text>
              <text :class="['value',item._classname]">{{item.pigsarInfo.address}}</text>
            </view>
          </view>
        </view>
        <view class="bottom-wrap">
          <text
            :class="['primary-color',item._classname]"
            @click="handleOpenApp(item)"
          >一键导航</text>
          <text
            :class="['primary-color',item._classname]"
            @click="handleCallPhone(item)"
          >联系电话</text>
          <text
            :class="item._classname"
            @click="handleCancel(item)"
          >{{item.status==='0'?'取消预约':'删除记录'}}</text>
        </view>
      </view>

    </view>
  </view>
  <!-- <view
    v-else
    class="no-data-wrap"
    :style="{ minHeight: `${sysHeight}px` }"
  >
    <view>
      <image
        src="https://cj.huazhe.work/images/inspection/no_appointment.png"
        mode="widthFit"
      />
      <view>暂无预约订单~</view>
    </view>
  </view> -->
</template>

<script>
import {
  getMyAppointmentsRes,
  cancelAppointmentRes,
  deleteAppointmentRes,
} from '../../api';
import { APPOINTMENT_TIMES } from '../../constant';

export default {
  data() {
    return {
      sysHeight: 0,
      myAppointments: [],
      current: 0,
    };
  },

  onLoad() {
    this.sysHeight = this.getSysHeight();
    this.getMyAppointments();
  },

  methods: {
    onTabChange(index) {
      this.current = index;
    },
    async getMyAppointments() {
      uni.showLoading({
        title: '数据加载中...',
      });
      const {
        data: { reserveList },
      } = await getMyAppointmentsRes();
      this.myAppointments = reserveList.map((x) => {
        const scope = APPOINTMENT_TIMES.find((y) => y.key === x.rid);
        x._time = x.date + ' ' + scope.value;
        switch (x.status) {
          case '0':
            x._status = '预约中';
            break;
          case '1':
            x._status = '已完成';
            break;
          case '2':
            x._status = '已取消';
            break;
          case '3':
            x._status = '已到站';
            break;
        }
        x._classname = x.status === '0' ? '' : 'gray';
        return x;
      });
      uni.hideLoading();
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
    handleCancel(item) {
      uni.showModal({
        title: '提示',
        content: `确定要${item.status === '0' ? '取消预约' : '删除该记录'}吗？`,
        success: async (res) => {
          if (res.confirm) {
            const { code, data } = await (item.status === '0'
              ? cancelAppointmentRes({ id: item.id })
              : deleteAppointmentRes({ id: item.id }));
            if (code === 200) {
              this.getMyAppointments();
            } else {
              uni.showToast({
                title: data,
                icon: 'none',
              });
            }
          }
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
    .gray {
      color: #9a9a9a !important;
    }
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
.no-data-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  image {
    width: 199rpx;
    height: 155rpx;
  }
  view {
    font-size: 28rpx;
    font-weight: 500;
    color: #9a9a9a;
    margin-top: 30rpx;
    text-align: center;
  }
}
</style>