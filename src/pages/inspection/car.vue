<template>
  <view class="car-form-container" :style="{ height: `${sysHeight}px` }">
    <view class="banner-wrap">
      <view class="b-l">送检车辆</view>
      <view class="b-r">
        <view class="car-wrap">
          <image src="../../static/images/inspection/car.png" mode="widthFit" />
          <text class="num">川B88888</text>
        </view>
        <view class="desc">小型汽车(非营运)</view>
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
              v-model="carForm.station"
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
            <u-input v-model="carForm.mobile" placeholder="请填写手机号" />
          </u-form-item>
          <u-form-item label="验证码">
            <u-input
              v-model="carForm.verificationCode"
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
      <view class="right">
        <text>提交预约单</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      carForm: {
        station: "",
        date: "",
        time: "",
        mobile: "",
        code: "",
      },
      sysHeight: 0,
    };
  },

  onLoad() {
    const sysHeight = uni.getSystemInfoSync().windowHeight;
    this.sysHeight = sysHeight;
  },

  methods: {
    handleNavTo() {
      uni.navigateBack();
    },
    handleShowDateSelect() {},
    handleShowTimeSelect() {},
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
      background: #ccc;
      font-size: 32rpx;
      font-weight: 500;
      color: #fff;
      text-align: center;
    }
  }
}
</style>