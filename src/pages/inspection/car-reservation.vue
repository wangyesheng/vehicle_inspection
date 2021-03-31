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
            src="https://cj.huazhe.work/images/inspection/car.png"
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
              disabled
              v-model="carForm.stationName"
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
              type="number"
              v-model="carForm.mobile"
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
              v-model="carForm.code"
              placeholder="请填写验证码"
              @blur="handleBlur"
            />
          </u-form-item>
        </u-form>
      </view>
      <!-- <view class="service-charge">
        <text class="label">预约服务费</text>
        <text class="value">限时免费</text>
      </view> -->
      <view class="notice-wrap">
        <view class="title">服务须知</view>
        <view class="content">
          <view>
            1、预约年检的非营运车辆，自完成缴费到领取报告，之间的整个检测过程不超过1小时；
          </view>
          <view>
            2、营运车辆线上检测项目较多，提供平台预约专用通道，无需排队，尽量保证在1小时内完成检测；
          </view>
          <view>
            3、提供现场免费代办跑腿，车主休息等候领取检测报告通知；
          </view>
          <view>
            4、若车辆未在预约时间段内进站，可能会让位已预约该时间段的车辆。
          </view>
          <view>
            5、遇特殊情况，可能导致服务延时。特殊情况一般为突发性断电、突发性网络故障、车管网络故障、检测设备集体故障，突发性自然灾害等其它不可预测的非人为因素。
          </view>
        </view>
      </view>

    </view>
    <view class="footer-wrap">
      <!-- <view class="left">
        <text>合计：¥0.00</text>
      </view> -->
      <view
        class="full"
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
import { getInspectionStationInfoRes, saveAppointmentRes } from '../../api';

import {
  currentHours,
  currentMinutes,
  currentFormatDate,
} from '../../utils/time';

import timingMixin from '../../mixins/timingMixin';

import { debounce } from '../../utils/tool';

import { TEMPLATE_IDS } from '../../constant/index';

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
    };
  },

  mixins: [timingMixin],

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
      const getCurrentDayCount = (index) => {
        const count = this.times.reduce((memo, current, idx) => {
          if (idx < index) {
            memo += Number(current.surplus);
          }
          return memo;
        }, 0);
        return count;
      };
      for (let i = 0; i < appointmentDates.length; i++) {
        let currentDayCount = 0;
        if (appointmentDates[i].value === currentFormatDate) {
          this.switchTime((num) => {
            if (num == -1) {
              currentDayCount = getCurrentDayCount(8);
            } else if (num == 8) {
              currentDayCount = this.times[0].surplus;
            } else {
              currentDayCount = getCurrentDayCount(num);
            }
          });
        }
        const scope = result[appointmentDates[i].value];
        if (scope) {
          appointmentDates[i].label = `${appointmentDates[i].label}（余量${
            count - scope.count - currentDayCount
          }） `;
        } else {
          appointmentDates[i].label = `${appointmentDates[i].label}（余量${
            count - currentDayCount
          }） `;
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
    switchTime(callback) {
      switch (true) {
        case currentHours < 8:
          break;
        case currentHours == 8:
          callback(1);
          break;
        case currentHours == 9:
          callback(2);
          break;
        case currentHours == 10:
          callback(3);
          break;
        // 无 12-13 的时间段
        case currentHours == 11:
          callback(4);
          break;
        case currentHours == 12:
          callback(4);
          break;
        case currentHours == 13:
          callback(5);
          break;
        case currentHours == 14:
          callback(6);
          break;
        case currentHours == 15:
          callback(7);
          break;
        default:
          callback(-1);
          break;
      }
    },
    findTimes() {
      let loopTimes = [...this.times];
      if (this.appointmentDateSelect.selectedDate === currentFormatDate) {
        this.switchTime((num) => {
          if (num == -1) {
            loopTimes = [];
          } else {
            loopTimes = loopTimes.splice(num);
          }
        });
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
          for (let j = 0, length = keys.length; j < length; j++) {
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
    handleSubmit: debounce(
      function () {
        const submit = async () => {
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
        };
        if (!this.canSubmit) {
          uni.showToast({
            title: '请填写完信息再提交！',
            icon: 'none',
          });
          return;
        }
        wx.getSetting({
          withSubscriptions: true, //是否获取用户订阅消息的订阅状态，默认false不返回
          success: (res) => {
            if (res.authSetting['scope.subscribeMessage']) {
              //用户点击了“总是保持以上，不再询问”
              uni.openSetting({
                // 打开设置页
                success: (res) => {
                  // console.log('all: ' + res.authSetting);
                  addCar();
                },
              });
            } else {
              // 用户没有点击“总是保持以上，不再询问”则每次都会调起订阅消息
              uni.requestSubscribeMessage({
                tmplIds: [
                  ...TEMPLATE_IDS.slice(0, 2),
                  ...TEMPLATE_IDS.slice(3, 4),
                ],
                success: (res) => {
                  submit();
                },
                fail: (res) => {
                  uni.showToast({
                    icon: 'none',
                    title: '授权消息推送失败！',
                  });
                },
              });
            }
          },
        });
      },
      3000,
      true
    ),
    handleGetCode() {
      this.getCode(this.carForm.mobile);
    },
    handleBlur(e) {
      uni.hideKeyboard();
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

    .notice-wrap {
      padding: 50rpx 40rpx 150rpx;
      .title {
        color: #000;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 30rpx;
      }
      .content {
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;
        view {
          margin-bottom: 10rpx;
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
    height: 120rpx;
    padding: 15rpx 30rpx;
    background: #fff;
    border-top: 1rpx solid #f2f2f2;
    // display: flex;
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

    .full {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #fff;
      text-align: center;
      border-radius: 45rpx;
    }
  }
}
</style>