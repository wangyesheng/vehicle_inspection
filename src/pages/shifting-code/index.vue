<style lang="scss" scoped>
.code-wrap {
  position: relative;
  padding: 15rpx;
  & /deep/ .backhome {
    bottom: 200rpx;
  }
  .row {
    height: 392rpx;
    background: url('https://cj.huazhe.work/images/shifting-code/main_bg.png');
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
            transition: all 0.3s;
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
  .footer-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background: #fff;
    padding: 25rpx 30rpx;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  }
}
</style>

<template>
  <view class="code-wrap">
    <view
      class="row"
      v-for="layer in codes"
      :key="layer.id"
    >
      <view class="header">
        <view class="h-top">
          <view class="title flex-center">
            <text>挪车码</text>
            <image
              src="https://cj.huazhe.work/images/shifting-code/brand.png"
              mode="widthFit"
              class="brand"
              @click="handlePreview(layer.qr)"
            />
          </view>

          <view class="operation flex-center">
            <image
              class="switch"
              mode="widthFit"
              :src="
                layer.status==10
                  ? 'https://cj.huazhe.work/images/shifting-code/switch_on.png'
                  : 'https://cj.huazhe.work/images/shifting-code/switch_off.png'
              "
              @click="handleEnable(layer)"
            />
            <image
              class="edit"
              mode="widthFit"
              src="https://cj.huazhe.work/images/shifting-code/edit.png"
              @click="handleEdit(layer.code)"
            />
          </view>
        </view>
        <view class="h-bottom"> {{layer.code.slice(0,8)}} </view>
      </view>
      <view class="footer">
        <view class="col">
          <view class="label">车牌号</view>
          <view class="value">{{layer.number}}</view>
        </view>
        <view class="col">
          <view class="label">手机号</view>
          <view class="value">{{ layer.mobile }}</view>
        </view>
      </view>
    </view>
    <view class="footer-wrap">
      <u-button
        shape="circle"
        @click="navTo('/pages/service/outlets')"
      >免费领取挪车码</u-button>
    </view>
    <EOSBackhome />
  </view>
</template>

<script>
import { getMyCodesRes, updateCodeStateRes } from '../../api';
import EOSBackhome from '../../components/eos-backbome';

export default {
  components: {
    EOSBackhome,
  },

  data() {
    return {
      codes: [],
    };
  },

  onLoad() {
    this.getMyCodes();
  },

  methods: {
    async getMyCodes() {
      const { code, data } = await getMyCodesRes();
      if (code == 200) {
        this.codes = data.codeList;
      } else {
        uni.showToast({
          icon: 'none',
          title: data,
        });
      }
    },
    async handleEnable(layer) {
      const { code } = await updateCodeStateRes({
        id: layer.id,
        status: layer.status == 10 ? 2 : 10,
      });
      if (code == 200) {
        uni.showToast({
          icon: 'none',
          title: layer.status == 10 ? '挪车码已禁用~' : '挪车码已启用~',
        });
        layer.status = layer.status == 10 ? 2 : 10;
      }
    },
    handleEdit(code) {
      this.navTo(`/pages/shifting-code/bind-edit?code=${code}`);
    },
    handlePreview(qr) {
      uni.previewImage({
        current: 0,
        urls: [qr],
      });
    },
  },
};
</script>