<style lang="scss" scoped>
.code-wrap {
  padding: 15rpx;
  .row {
    height: 392rpx;
    background: url("../../static/images/shifting-code/main_bg.png");
    background-size: 100% 100%;
    padding: 46rpx 60rpx;
    .header {
      .h-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 24rpx;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
          .brand {
            width: 32rpx;
            height: 32rpx;
            margin-left: 12rpx;
          }
        }
        .operation {
          .switch {
            width: 108rpx;
            height: 48rpx;
            margin-right: 50rpx;
          }
          .edit {
            width: 36rpx;
            height: 36rpx;
          }
        }
      }
      .h-bottom {
        font-size: 40rpx;
        font-weight: bold;
        color: #fefefe;
        opacity: 0.6;
        margin-top: 20rpx;
      }
    }
    .footer {
      margin-top: 50rpx;
      display: flex;
      .col {
        margin-right: 60rpx;
        .label {
          font-size: 24rpx;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
          margin-bottom: 26rpx;
        }
        .value {
          font-size: 40rpx;
          font-weight: bold;
          color: #fefefe;
        }
      }
    }
  }
  .btn-wrap {
    margin-top: 65rpx;
    padding: 0 15rpx;
  }
}
</style>

<template>
  <view class="code-wrap">
    <view class="row">
      <view class="header">
        <view class="h-top">
          <view class="title flex-center">
            <text>挪车码</text>
            <image
              src="../../static/images/shifting-code/brand.png"
              mode="widthFit"
              class="brand"
            />
          </view>

          <view class="operation flex-center">
            <image
              class="switch"
              mode="widthFit"
              :src="
                enable
                  ? require('../../static/images/shifting-code/switch_on.png')
                  : require('../../static/images/shifting-code/switch_off.png')
              "
              @click="handleEnable"
            />
            <image
              class="edit"
              mode="widthFit"
              src="../../static/images/shifting-code/edit.png"
            />
          </view>
        </view>
        <view class="h-bottom"> 43554643 </view>
      </view>
      <view class="footer">
        <view class="col">
          <view class="label">车牌号</view>
          <view class="value">川B·88888</view>
        </view>
        <view class="col">
          <view class="label">手机号</view>
          <view class="value">18862944188</view>
        </view>
      </view>
    </view>
    <view class="btn-wrap">
      <u-button>免费领取挪车码</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      enable: false,
    };
  },

  methods: {
    handleEnable() {
      this.enable = !this.enable;
    },
  },
};
</script>