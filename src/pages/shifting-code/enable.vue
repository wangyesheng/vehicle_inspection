<style lang="scss" scoped>
.enable-wrap {
  position: relative;
  .bg-wrap {
    height: 480rpx;
    background: url("../../static/images/shifting-code/bg.png");
    background-size: 100% 100%;
  }
  .form-wrap {
    position: absolute;
    top: 50rpx;
    left: 30rpx;
    // height: 530rpx;
    width: 690rpx;
    background: #fff;
    box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.1);
    border-radius: 12rpx;
    padding: 30rpx 50rpx 50rpx;
    & /deep/ input {
      font-size: 42rpx;
      font-weight: bold;
      color: #000000;
    }
    .code {
      font-size: 28rpx;
      font-weight: 400;
      color: #5e93ec;
    }

    .carinfo {
      margin-top: 54rpx;
      .c-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        font-weight: 500;
        color: #222222;
        image {
          width: 40rpx;
          height: 32rpx;
        }
      }
      .c-content {
        margin-top: 24rpx;
        width: 590rpx;
        height: 180rpx;
        background: #5e93ec;
        border-radius: 10rpx;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 48rpx;
      }
    }
  }
  .user-protocol-wrap {
    margin-top: 380rpx;
    margin-left: 40rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #333;
    image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 10rpx;
    }
    .link {
      color: #5e93ec;
    }
  }
  .btn-wrap {
    margin-top: 90rpx;
    padding: 0 30rpx;
    & /deep/ button {
      height: 100rpx;
      line-height: 100rpx;
    }
  }

  .popup-wrap {
    .car-wrap {
      height: 800rpx;
      max-height: 800rpx;
      padding: 0 30rpx;
      .car-header {
        height: 90rpx;
        display: flex;
        justify-content: space-between;
        font-size: 32rpx;
        padding: 40rpx 0 18rpx 0;

        text:first-child {
          font-weight: bold;
          color: #000000;
        }
        text:last-child {
          font-weight: 500;
          color: #5e93ec;
        }
      }
      .car-content {
        margin-top: 30rpx;
        .row {
          height: 180rpx;
          background: #ffffff;
          box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.12);
          border-radius: 10rpx;
          margin-bottom: 30rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 50rpx;
          .col-right {
            image {
              width: 32rpx;
              height: 32rpx;
            }
            image:first-child {
              margin-right: 50rpx;
            }
          }
        }
      }
    }
  }

  .number {
    font-size: 40rpx;
    font-weight: bold;
  }
  .type {
    font-size: 26rpx;
    font-weight: 400;
  }
  .gray {
    color: #666666;
  }
}
</style>

<template>
  <view class="enable-wrap">
    <view class="bg-wrap"> </view>
    <view class="form-wrap">
      <u-form
        :model="mobileForm.data"
        label-position="top"
        :label-style="{
          fontSize: '28rpx',
          fontWeight: 500,
          color: '#222',
        }"
      >
        <u-form-item label="绑定手机号">
          <u-input
            v-model="mobileForm.data.phone"
            placeholder="请输入手机号"
            type="number"
          />
        </u-form-item>
        <u-form-item label="验证码">
          <u-input
            v-model="mobileForm.data.code"
            placeholder="请输入验证码"
            type="number"
          />
          <view slot="right" class="code">获取验证码</view>
        </u-form-item>
      </u-form>
      <view class="carinfo">
        <view class="c-header">
          <text>绑定车辆信息</text>
          <image
            src="../../static/images/shifting-code/car.png"
            mode="widthFit"
            @click="handleShowCarPopup"
          />
        </view>
        <view class="c-content">
          <view class="number">川B·88888</view>
          <view class="type">小型汽车/非营运</view>
        </view>
      </view>
    </view>
    <view class="user-protocol-wrap">
      <image
        :src="
          agreement
            ? require('../../static/images/shifting-code/selected.png')
            : require('../../static/images/shifting-code/unselected.png')
        "
        mode="widthFit"
        @click="handleAgree"
      />
      <text>我已阅读并同意</text>
      <text class="link">《用户须知》</text>
    </view>
    <view class="btn-wrap">
      <u-button type="warning">启用挪车码</u-button>
    </view>
    <u-popup mode="bottom " v-model="carPopup.visible" class="popup-wrap">
      <view class="car-wrap">
        <view class="car-header">
          <text>我的车库</text>
          <text>添加车辆</text>
        </view>
        <view class="car-content">
          <view class="row" v-for="item in 3" :key="item">
            <view class="col-left">
              <view class="number">川B·88888</view>
              <view class="type gray">小型汽车/非营运</view>
            </view>
            <view class="col-right">
              <image
                src="../../static/images/shifting-code/edit_draw.png"
                mode="widthFit"
              />
              <image
                src="../../static/images/shifting-code/delete_draw.png"
                mode="widthFit"
              />
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mobileForm: {
        data: {
          phone: "",
          code: "",
        },
      },
      agreement: false,
      carPopup: {
        visible: false,
      },
    };
  },

  methods: {
    handleAgree() {
      this.agreement = !this.agreement;
    },
    handleShowCarPopup() {
      this.carPopup.visible = true;
    },
  },
};
</script>