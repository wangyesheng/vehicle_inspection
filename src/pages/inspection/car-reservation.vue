<template>
  <view
    class="car-form-container"
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
          ref="carForm"
          label-width="auto"
          label-align="center"
          :model="carForm"
          :label-style="{
            color: '#000',
            fontSize: '28rpx',
            fontWeight: 600,
          }"
        >
          <u-form-item label="预约检测站">
            <u-input
              type="select"
              placeholder="请选择预约检测站"
              v-model="carForm.stationName"
              @click="handleNavTo"
            />
          </u-form-item>
          <u-form-item label="预约日期">
            <u-input
              type="select"
              placeholder="请选择预约日期"
              v-model="carForm.date"
              @click="handleShowDateSelect"
            />
          </u-form-item>
          <u-form-item label="预约时间">
            <u-input
              type="select"
              placeholder="请选择预约时间"
              v-model="carForm.time"
              @click="handleShowTimeSelect"
            />
          </u-form-item>
          <u-form-item label="预约手机号">
            <u-input
              v-model="carForm.mobile"
              placeholder="请填写手机号"
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
              v-model="carForm.code"
              placeholder="请填写验证码"
            />
          </u-form-item>
        </u-form>
      </view>
      <view class="service-charge">
        <text class="label">预约服务费</text>
        <text class="value">限时免费</text>
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
        <text>提交预约单</text>
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
import {
  getInspectionStationInfoRes,
  getVerificationCodeRes,
  saveAppointmentRes,
} from '../../api';

import {
  currentHours,
  currentMinutes,
  currentFormatDate,
} from '../../utils/time';

export default {
  data() {
    return {
      carForm: {
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
      sysHeight: 0,
      carInfo: {},
      codeText: '60秒后重发',
      loading: false,
    };
  },

  computed: {
    canSubmit() {
      return (
        this.appointmentDateSelect.selectedDate !== '' &&
        this.appointmentTimeSelect.selectedTime !== '' &&
        this.carForm.code !== ''
      );
    },
  },

  onLoad(options) {
    this.sysHeight = this.getSysHeight();
    this.stationId = options.stationId;
    this.carId = options.carId;
    this.carForm.stationName = options.stationName;
    this.carInfo = uni
      .getStorageSync('app_user_cars')
      .find((x) => x.id == this.carId);
    this.carForm.mobile = this.carInfo.mobile;
    this.getStationInfo();
  },

  methods: {
    async getStationInfo() {
      const {
        data: { result, times, count },
      } = await getInspectionStationInfoRes({ pid: this.stationId });
      this.result = result;
      this.times = times;
      const appointmentDates = this.carInfo.appointmentDates;
      for (let i = 0; i < appointmentDates.length; i++) {
        const scope = result[appointmentDates[i].value];
        if (scope) {
          appointmentDates[i].label = `${appointmentDates[i].label}（余量${
            count - scope.count
          }） `;
        } else {
          appointmentDates[
            i
          ].label = `${appointmentDates[i].label}（余量${count}） `;
        }
      }
      this.appointmentDateSelect.dates = appointmentDates;
    },
    handleNavTo() {
      uni.navigateBack();
    },
    handleShowDateSelect() {
      this.appointmentDateSelect.visible = true;
    },
    findTimes() {
      let loopTimes = [...this.times];
      if (this.appointmentDateSelect.selectedDate === currentFormatDate) {
        switch (currentHours) {
          case currentHours <= 8:
            loopTimes = loopTimes;
            break;
          case 9:
            loopTimes = loopTimes.splice(1);
            break;
          case 10:
            loopTimes = loopTimes.splice(2);
            break;
          case 11:
            loopTimes = loopTimes.splice(3);
            break;
          case 12:
            loopTimes = loopTimes.splice(3);
            break;
          case 13:
            loopTimes = loopTimes.splice(4);
            break;
          case 14:
            loopTimes = loopTimes.splice(5);
            break;
          case 15:
            loopTimes = loopTimes.splice(6);
            break;
          default:
            break;
        }
      }
      return loopTimes;
    },
    handleDateConfirm(e) {
      this.carForm.date = e[0].label;
      this.appointmentDateSelect.selectedDate = e[0].value;
      this.appointmentTimeSelect.times = [];
      this.appointmentTimeSelect.selectedTime = '';
      this.carForm.time = '';
      const loopTimes = this.findTimes();
      const scope = this.result[this.appointmentDateSelect.selectedDate];
      for (let i = 0; i < loopTimes.length; i++) {
        const layer = loopTimes[i];
        if (scope) {
          const keys = Object.keys(scope);
          let loopIndex = 0;
          for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            if (layer.id == key) {
              this.appointmentTimeSelect.times.push({
                value: i + 1,
                label: `${layer.times}（余量${layer.surplus - scope[key]}）`,
              });
              break;
            }
            if (loopIndex == keys.length - 1) {
              this.appointmentTimeSelect.times.push({
                value: i + 1,
                label: `${layer.times}（余量${layer.surplus}）`,
              });
            }
            loopIndex++;
          }
        } else {
          this.appointmentTimeSelect.times.push({
            value: i + 1,
            label: `${layer.times}（余量${layer.surplus}）`,
          });
        }
      }
    },
    handleShowTimeSelect() {
      this.appointmentTimeSelect.visible = true;
    },
    handleTimeConfirm(e) {
      this.carForm.time = e[0].label;
      this.appointmentTimeSelect.selectedTime = e[0].value;
    },
    async handleSubmit() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请填写完信息再提交！',
          icon: 'none',
        });
        return;
      }
      const reqData = {
        pid: this.stationId,
        car_id: this.carId,
        date: this.appointmentDateSelect.selectedDate,
        rid: this.appointmentTimeSelect.selectedTime,
        mobile: this.carForm.mobile,
        code: this.carForm.code,
      };
      const { code, data } = await saveAppointmentRes(reqData);
      if (code === 200) {
        const info = `预约时间 ${this.carForm.date.substring(
          0,
          14
        )} ${this.carForm.time.substring(0, 11)}`;
        this.navTo(
          `/pages/inspection/success?carNum=${this.carInfo.number}&info=${info}`
        );
      } else {
        uni.showToast({
          icon: 'none',
          title: data,
        });
      }
    },
    async handleGetCode() {
      if (this.carForm.mobile.length === 11) {
        if (this.loading) return;
        this.loading = true;
        const { code, data } = await getVerificationCodeRes({
          mobile: this.carForm.mobile,
        });
        if (code === 200) {
          this.timing();
        } else {
          uni.showToast({
            icon: 'none',
            title: data,
          });
          this.loading = false;
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: '请填写正确的手机号码',
        });
      }
    },
    timing(second = 60) {
      setTimeout(() => {
        second--;
        if (second == 0) {
          this.codeText = `60秒后重发`;
          this.loading = false;
        } else {
          this.codeText = `${second}秒后重发`;
          this.timing(second);
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.car-form-container {
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
    .form-wrap {
      background: #fff;
      & /deep/ .u-form-item {
        padding: 26rpx 38rpx;

        input {
          text-align: right;
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
        font-weight: bold;
        color: #000;
      }
      .value {
        color: #108b24;
      }
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
      font-weight: 500;
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