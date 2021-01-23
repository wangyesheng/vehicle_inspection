<template>
  <view
    class="order-form-container"
    :style="{ minHeight: `${sysHeight}px` }"
  >
    <view class="banner-wrap">
      <view class="b-l">送检车辆</view>
      <view class="b-r">
        <view class="car-wrap">
          <image
            src="../../static/images/inspection/car.png"
            mode="widthFit"
          />
          <text class="num">{{carInfo.number}}</text>
        </view>
        <view class="desc">小型汽车（{{carInfo.type==='1'?'非营运':'营运'}}）</view>
      </view>
    </view>
    <view class="content-wrap">
      <view class="form-wrap">
        <u-form
          ref="orderForm"
          label-width="auto"
          label-align="center"
          :model="orderForm"
          :label-style="{
            color: '#000',
            fontSize: '28rpx',
            fontWeight: 600,
          }"
        >
          <u-form-item label="预约日期">
            <u-input
              type="select"
              placeholder="请选择预约日期"
              v-model="orderForm.date"
              @click="handleShowDateSelect"
            />
          </u-form-item>
          <u-form-item label="预约时间">
            <u-input
              type="select"
              placeholder="请选择预约时间"
              v-model="orderForm.time"
              @click="handleShowTimeSelect"
            />
          </u-form-item>
          <u-form-item label="预约手机号">
            <u-input
              type="number"
              v-model="orderForm.mobile"
              placeholder="请填写手机号"
              @blur="handleBlur"
            />
          </u-form-item>
          <u-form-item label="验证码">
            <u-button
              slot="left"
              size="medium"
              :custom-style="{padding:'18rpx 20rpx'}"
              @click="handleGetCode"
            >
              <text v-if="loading">{{ codeText }}</text>
              <text v-else>获取验证码</text>
            </u-button>
            <u-input
              type="number"
              v-model="orderForm.code"
              placeholder="请填写验证码"
              @blur="handleBlur"
            />
          </u-form-item>
        </u-form>
      </view>
      <view class="notice-wrap">
        <view class="title">请准备以下资料并交给上门服务的工作人员</view>
        <view class="content">
          <view class="c-col">
            <view></view>
            <view>
              行驶证原件
            </view>
          </view>
          <view class="c-col">
            <view></view>
            <view>交强险保单</view>
          </view>
          <view class="c-col">
            <view></view>
            <view>车主身份证</view>
          </view>
        </view>
      </view>
      <view class="service-charge">
        <text class="label">代办服务费</text>
        <text class="value">限时免费</text>
      </view>
      <view class="tips">
        订单费用仅包含代驾费用及代检费用，不包含检测站检测工本费。 检测工本费由代办人验车后根据发票收取。
      </view>
    </view>
    <view class="footer-wrap">
      <view class="left">
        <text>合计：¥0.00</text>
      </view>
      <view
        class="right"
        :style="{background:canSubmit?'#fb635f':'#ccc'}"
        @click="handleSubmit"
      >
        <text>立即办理</text>
      </view>
    </view>
    <u-select
      v-model="appointmentDateSelect.visible"
      :list="appointmentDateSelect.dates"
      @confirm="handleDateConfirm"
    />
    <u-select
      v-model="appointmentTimeSelect.visible"
      :list="appointmentTimeSelect.times"
      @confirm="handleTimeConfirm"
    />
  </view>
</template>

<script>
import { getInspectionStationInfoRes, saveAppointmentRes } from '../../api';
import {
  currentHours,
  currentMinutes,
  currentFormatDate,
} from '../../utils/time';
import timingMixin from '../../mixins/timingMixin';
import { debounce } from '../../utils/tool';

export default {
  data() {
    return {
      sysHeight: 0,
      orderForm: {
        stationName: '',
        date: '',
        time: '',
        mobile: '',
        code: '',
      },
      appointmentDateSelect: {
        visible: false,
        dates: [],
        selectedDate: '',
      },
      appointmentTimeSelect: {
        visible: false,
        times: [],
        selectedTime: '',
      },
      carInfo: {},
    };
  },

  mixins: [timingMixin],

  computed: {
    canSubmit() {
      return (
        this.appointmentDateSelect.selectedDate !== '' &&
        this.appointmentTimeSelect.selectedTime !== '' &&
        this.orderForm.code !== ''
      );
    },
  },

  onLoad(options) {
    this.sysHeight = this.getSysHeight();
    this.carId = options.carId || 87;
    this.carInfo =
      uni.getStorageSync('app_user_cars').find((x) => x.id == this.carId) || {};
    this.orderForm.mobile = this.carInfo.mobile;
  },

  methods: {
    handleShowDateSelect() {
      this.appointmentDateSelect.visible = true;
    },
    handleDateConfirm(e) {},
    handleShowTimeSelect() {
      this.appointmentTimeSelect.visible = true;
    },
    handleTimeConfirm(e) {
      this.carForm.time = e[0].label;
      this.appointmentTimeSelect.selectedTime = e[0].value;
    },
    handleSubmit: debounce(
      function () {
        const submit = async () => {
          const reqData = {
            pid: this.stationId,
            car_id: this.carId,
            date: this.appointmentDateSelect.selectedDate,
            rid: this.appointmentTimeSelect.selectedTime,
            mobile: this.orderForm.mobile,
            code: this.orderForm.code,
          };
          const { code, data } = await saveAppointmentRes(reqData);
          if (code === 200) {
            const info = `预约时间 ${this.orderForm.date.substring(
              0,
              14
            )} ${this.orderForm.time.substring(0, 11)}`;
            this.navTo(
              `/pages/inspection/success?carNum=${this.carInfo.number}&info=${info}`
            );
          } else {
            uni.showToast({
              icon: 'none',
              title: data,
            });
          }
        };
        if (!this.canSubmit) {
          uni.showToast({
            title: '请填写完信息再提交！',
            icon: 'none',
          });
          return;
        }
      },
      3000,
      true
    ),
    handleGetCode() {
      this.getCode(this.orderForm.mobile);
    },
  },
};
</script>

<style lang="scss" scoped>
.order-form-container {
  background: #f6f6f6;
  .banner-wrap {
    height: 180rpx;
    background: #5e93ec;
    padding: 46rpx 59rpx 48rpx 37rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #fff;
    .b-r {
      .car-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10rpx;
        image {
          width: 42rpx;
          height: 39rpx;
          margin-right: 10rpx;
        }
        .num {
          font-size: 42rpx;
          font-weight: bold;
        }
      }
      .desc {
        text-align: right;
      }
    }
  }
  .content-wrap {
    padding-bottom: 120rpx;
    .form-wrap {
      background: #fff;
      margin-bottom: 20rpx;
      & /deep/ .u-form-item {
        padding: 26rpx 38rpx;

        input {
          text-align: right;
        }
      }
    }

    .notice-wrap {
      padding: 0 40rpx;
      background: #fff;
      .title {
        color: #000;
        font-size: 28rpx;
        font-weight: 600;
        height: 120rpx;
        line-height: 120rpx;
        border-bottom: 1rpx solid #f2f2f2;
      }
      .content {
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;
        padding-top: 30rpx;
        padding-bottom: 70rpx;
        display: flex;
        justify-content: space-around;
        .c-col {
          view:first-child {
            margin-bottom: 10rpx;
            width: 150rpx;
            height: 150rpx;
            background: #e6e6e6;
          }
          view:last-child {
            margin-top: 23rpx;
            font-size: 28rpx;
            font-weight: 500;
            color: #000000;
          }
        }
      }
    }

    .service-charge {
      width: 750rpx;
      height: 120rpx;
      background: #fff;
      margin-top: 20rpx;
      padding: 26rpx 60rpx 26rpx 37rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label {
        font-size: 28rpx;
        font-weight: 600;
        color: #000;
      }
      .value {
        color: #fb6d54;
      }
    }

    .tips {
      margin-top: 23rpx;
      padding-left: 30rpx;
      padding-right: 40rpx;
      line-height: 36rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #999;
    }
  }
  .footer-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    height: 100rpx;
    line-height: 100rpx;
    background: #fff;
    border-top: 1rpx solid #f2f2f2;
    display: flex;
    .left {
      width: 60%;
      font-size: 28rpx;
      font-weight: 600;
      color: #000;
      margin-left: 37rpx;
    }
    .right {
      width: 40%;
      font-size: 32rpx;
      font-weight: 500;
      color: #fff;
      text-align: center;
    }
  }
}
</style>