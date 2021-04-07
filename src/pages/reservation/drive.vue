<template>
  <view
    class="reservation-container"
    v-if="agencies.length"
    :style="{ minHeight: `${sysHeight}px` }"
  >
    <view
      class="order-wrap"
      v-for="item in agencies"
      :key="item.id"
    >
      <view class="top-wrap">
        <!-- <view class="header">
            <text :class="['station-name']">{{item.pigsarInfo.name}}</text>
            <text :class="item._classname">{{item._status}}</text>
          </view> -->
        <view class="status-tag">
          <u-tag
            mode="plain"
            shape="circleLeft"
            :text="item.status==0?'已预约':'已取消代办'"
            :type="item.status==0?'success':'warning'"
          />
        </view>
        <view class="content">
          <view class="info-item mb20">
            <text :class="['label']">联系人</text>
            <text :class="['value']">{{item.linkname}}</text>
          </view>
          <view class="info-item mb20">
            <text :class="['label']">联系电话</text>
            <text :class="['value']">{{item.mobile}}</text>
          </view>
          <view class="info-item mb20">
            <text :class="['label']">送检车辆</text>
            <text :class="['value']">{{item._carNum}}</text>
          </view>
          <view class="info-item mb20">
            <text :class="['label']">取车日期</text>
            <text :class="['value']">{{item.appoint_date}}</text>
          </view>
          <view class="info-item mb20">
            <text :class="['label']">取车位置</text>
            <text :class="['value']">{{item.pick_address}}</text>
          </view>
          <view class="info-item">
            <text :class="['label']">还车位置</text>
            <text :class="['value']">{{item.return_address}}</text>
          </view>
        </view>
      </view>
      <view class="bottom-wrap">
        <view
          :class="['primary-color',item._canCancelClassname]"
          @click="handleCancel(item)"
        >取消代办</view>
        <view
          :class="['primary-color',item._canNavToClassname]"
          @click="handleNavTo(item)"
        >重新预约</view>
      </view>
    </view>
  </view>
  <view
    v-else
    class="no-data-wrap"
    :style="{ minHeight: `${sysHeight}px` }"
  >
    <view>
      <image
        src="https://cj.huazhe.work/images/inspection/no_appointment.png"
        mode="widthFit"
      />
      <view>暂无代驾预约订单~</view>
    </view>
  </view>
</template>

<script>
import {
  getCarAgencies,
  cancelCarAgency,
  deleteAppointmentRes,
} from '../../api';
export default {
  data() {
    return {
      sysHeight: 0,
      agencies: [],
    };
  },

  onLoad() {
    this.sysHeight = this.getSysHeight();
    this.cars = uni.getStorageSync('app_user_cars');
    this.getCarAgencies();
  },

  methods: {
    async getCarAgencies() {
      const {
        data: { carAgencyList },
      } = await getCarAgencies();
      this.agencies = carAgencyList.map((x) => ({
        ...x,
        _carNum: this.cars.find((y) => x.car_id == y.id).number,
        _canCancelClassname: x.status == 1 ? 'gray' : '',
        _canNavToClassname: x.status == 1 ? '' : 'gray',
      }));
    },
    handleCancel(target) {
      if (target.status == 0) {
        uni.showModal({
          title: '提示',
          content: `确定要取消代办吗？`,
          success: async (res) => {
            if (res.confirm) {
              const { code, data } = await cancelCarAgency({
                id: target.id,
              });
              if (code == 200) {
                this.getCarAgencies();
              } else {
                uni.showToast({
                  title: data,
                  icon: 'none',
                });
              }
            }
          },
        });
      }
    },
    handleNavTo(target) {
      if (target.status == 1) {
        uni.setStorageSync('order_form_data', target);
        this.navTo(`/pages/order/index?carId=${target.car_id}`);
      }
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