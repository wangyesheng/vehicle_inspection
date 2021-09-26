<template>
  <view>
    <u-tabs
      :list="[{ name: '自驾' }, { name: '代驾' }]"
      :is-scroll="false"
      :current="current"
      @change="handleTabChange"
    />
    <view
      v-if="agencies.length || myAppointments.length"
      :style="{ minHeight: `calc(100vh - 44px)` }"
    >
      <view class="reservation-container" v-if="current == 1">
        <view class="order-wrap" v-for="item in agencies" :key="item.id">
          <view class="top-wrap">
            <view class="status-tag">
              <u-tag
                mode="plain"
                shape="circleLeft"
                :text="item.status == 0 ? '已预约' : '已取消代办'"
                :type="item.status == 0 ? 'success' : 'warning'"
              />
            </view>
            <view class="content">
              <view class="info-item mb20">
                <text :class="['label']">联系人</text>
                <text :class="['value']">{{ item.linkname }}</text>
              </view>
              <view class="info-item mb20">
                <text :class="['label']">联系电话</text>
                <text :class="['value']">{{ item.mobile }}</text>
              </view>
              <view class="info-item mb20">
                <text :class="['label']">送检车辆</text>
                <text :class="['value']">{{ item._carNum }}</text>
              </view>
              <view class="info-item mb20">
                <text :class="['label']">取车日期</text>
                <text :class="['value']">{{ item.appoint_date }}</text>
              </view>
              <view class="info-item mb20">
                <text :class="['label']">取车位置</text>
                <text :class="['value']">{{ item.pick_address }}</text>
              </view>
              <view class="info-item">
                <text :class="['label']">还车位置</text>
                <text :class="['value']">{{ item.return_address }}</text>
              </view>
            </view>
          </view>
          <view class="bottom-wrap">
            <view :class="['primary-color']" @click="handleCancel(item)">{{
              item.status == 0 ? "取消代办" : "删除代办"
            }}</view>
            <view
              :class="['primary-color', item._canNavToClassname]"
              @click="handleNavTo(item)"
              >重新预约</view
            >
          </view>
        </view>
      </view>
      <view v-if="current == 0" class="reservation-container">
        <view class="order-wrap" v-for="item in myAppointments" :key="item">
          <view class="top-wrap">
            <view class="header">
              <text :class="['station-name', item._classname]">{{
                item.pigsarInfo.name
              }}</text>
              <text :class="item._classname">{{ item._status }}</text>
            </view>
            <view class="content">
              <view class="info-item mb20">
                <text :class="['label', item._classname]">送检车辆 </text>
                <text :class="['value', item._classname]">{{
                  item.carInfo.number
                }}</text>
              </view>
              <view class="info-item mb20">
                <text :class="['label', item._classname]">预约时间</text>
                <text :class="['value', item._classname]">{{
                  item._time
                }}</text>
              </view>
              <view class="info-item">
                <text :class="['label', item._classname]">机构位置 </text>
                <text :class="['value', item._classname]">{{
                  item.pigsarInfo.address
                }}</text>
              </view>
            </view>
          </view>
          <view class="bottom-wrap">
            <text
              :class="['primary-color', item._classname]"
              @click="handleOpenApp(item)"
              >一键导航</text
            >
            <text
              :class="['primary-color', item._classname]"
              @click="handleCallPhone(item)"
              >联系电话</text
            >
            <text :class="item._classname" @click="handleCancel(item)">{{
              item.status === "0" ? "取消预约" : "删除记录"
            }}</text>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="no-data-wrap" :style="{ minHeight: `calc(100vh - 44px)` }">
      <view>
        <image
          src="https://cj.huazhe.work/images/inspection/no_appointment.png"
          mode="widthFit"
        />
        <view>暂无预约订单~</view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getCarAgencies,
  cancelCarAgency,
  deleteCarAgency,
  getMyAppointmentsRes,
  cancelAppointmentRes,
  deleteAppointmentRes,
} from "../../api";

import { APPOINTMENT_TIMES } from "../../constant";

export default {
  data() {
    return {
      current: 0,
      sysHeight: 0,
      agencies: [],
      myAppointments: [],
    };
  },

  onLoad() {
    this.sysHeight = this.getSysHeight();
    this.cars = uni.getStorageSync("app_user_cars");
    this.getMyAppointments();
  },

  methods: {
    handleTabChange(index) {
      this.current = index;
      if (index == 1 && this.agencies.length == 0) {
        this.getCarAgencies();
      }
      if (index == 0 && this.myAppointments.length == 0) {
        this.getMyAppointments();
      }
    },
    async getCarAgencies() {
      uni.showLoading({
        title: "数据加载中...",
      });
      const {
        data: { carAgencyList },
      } = await getCarAgencies();
      this.agencies = carAgencyList.map((x) => ({
        ...x,
        _carNum: this.cars.find((y) => x.car_id == y.id).number,
        _canNavToClassname: x.status == 1 ? "" : "gray",
      }));
      uni.hideLoading();
    },
    handleCancel(target) {
      uni.showModal({
        title: "提示",
        content: `确定要${target.status == 0 ? "取消" : "删除"}代办吗？`,
        success: async (res) => {
          if (res.confirm) {
            const { code, data } =
              target.status == 0
                ? await cancelCarAgency({ id: target.id })
                : await deleteCarAgency({ id: target.id });

            if (code == 200) {
              this.getCarAgencies();
            } else {
              uni.showToast({
                title: data,
                icon: "none",
              });
            }
          }
        },
      });
    },
    handleNavTo(target) {
      if (target.status == 1) {
        uni.setStorageSync("order_form_data", target);
        this.navTo(`/pages/order/index?carId=${target.car_id}`);
      }
    },
    async getMyAppointments() {
      uni.showLoading({
        title: "数据加载中...",
      });
      const {
        data: { reserveList },
      } = await getMyAppointmentsRes();
      this.myAppointments = reserveList.map((x) => {
        const scope = APPOINTMENT_TIMES.find((y) => y.key === x.rid);
        x._time = x.date + " " + scope.value;
        switch (x.status) {
          case "0":
            x._status = "预约中";
            break;
          case "1":
            x._status = "已完成";
            break;
          case "2":
            x._status = "已取消";
            break;
          case "3":
            x._status = "已到站";
            break;
        }
        x._classname = x.status === "0" ? "" : "gray";
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
        title: "提示",
        content: `确定要${item.status === "0" ? "取消预约" : "删除该记录"}吗？`,
        success: async (res) => {
          if (res.confirm) {
            const { code, data } = await (item.status === "0"
              ? cancelAppointmentRes({ id: item.id })
              : deleteAppointmentRes({ id: item.id }));
            if (code === 200) {
              this.getMyAppointments();
            } else {
              uni.showToast({
                title: data,
                icon: "none",
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
      position: relative;
      .status-tag {
        position: absolute;
        right: 50rpx;
        top: 36rpx;

        & /deep/ .u-size-default {
          font-size: 24rpx;
        }
      }
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
        .mb20 {
          margin-bottom: 20rpx;
        }
        .info-item {
          font-size: 30rpx;
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
      justify-content: space-around;
      padding: 26rpx 70rpx;
      view {
        text-align: center;
        width: 50%;
        &:first-child {
          border-right: 1px solid #f2f2f2;
        }
      }
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