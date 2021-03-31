<style lang="scss" scoped>
.enable-wrap {
  position: relative;
  .bg-wrap {
    height: 480rpx;
    background: url('https://cj.huazhe.work/images/shifting-code/bg.png');
    background-size: 100% 100%;
  }
  .form-wrap {
    position: absolute;
    top: 50rpx;
    left: 30rpx;
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
        .number {
          margin-bottom: 5rpx;
        }
      }
      .no-car {
        margin-top: 24rpx;
        image {
          width: 590rpx;
          height: 180rpx;
        }
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
    margin-bottom: 50rpx;
    padding: 0 30rpx;
    & /deep/ button {
      height: 100rpx;
      line-height: 100rpx;
    }
  }

  .unbind {
    text-align: center;
    font-size: 28rpx;
    font-weight: 400;
    color: #666666;
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
          position: relative;

          .tag {
            position: absolute;
            left: 240rpx;
            top: 50rpx;
          }

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
    <view class="bg-wrap" />
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
            v-model="mobileForm.data.mobile"
            placeholder="请输入手机号"
            type="number"
          />
        </u-form-item>
        <u-form-item label="验证码">
          <u-input
            v-model="mobileForm.data.sms_vcode"
            placeholder="请输入验证码"
            type="number"
          />
          <view
            slot="right"
            class="code"
            @click="handleGetCode"
          >
            <text v-if="loading">{{ codeText }}</text>
            <text v-else>获取验证码</text>
          </view>
        </u-form-item>
      </u-form>
      <view class="carinfo">
        <view class="c-header">
          <text>绑定车辆信息</text>
          <image
            src="https://cj.huazhe.work/images/shifting-code/car.png"
            mode="widthFit"
            @click="handleShowCarPopup"
          />
        </view>
        <view
          class="c-content"
          v-if="selectedCar"
        >
          <view class="number">{{ selectedCar.number }}</view>
          <view class="type">{{ selectedCar._type }}</view>
        </view>
        <view
          class="no-car"
          v-else
          @click="navTo('/pages/shifting-code/add-car')"
        >
          <image
            src="https://cj.huazhe.work/images/shifting-code/add_car.png"
            mode="widthFit"
          />
        </view>
      </view>
    </view>
    <view class="user-protocol-wrap">
      <image
        :src="
          agreement
            ? 'https://cj.huazhe.work/images/shifting-code/selected.png'
            : 'https://cj.huazhe.work/images/shifting-code/unselected.png'
        "
        mode="widthFit"
        @click="handleAgree"
      />
      <text>我已阅读并同意</text>
      <text class="link">《用户须知》</text>
    </view>
    <view class="btn-wrap">
      <u-button
        type="warning"
        shape="circle"
        @click="handleSubmit"
      >启用挪车码</u-button>
    </view>
    <u-popup
      mode="bottom "
      v-model="carPopup.visible"
      class="popup-wrap"
    >
      <view class="car-wrap">
        <view class="car-header">
          <text>我的车库</text>
          <text @click="navTo('/pages/shifting-code/add-car')">添加车辆</text>
        </view>
        <view class="car-content">
          <view
            class="row"
            v-for="item in cars"
            :key="item.id"
          >
            <view class="col-left">
              <view class="number">{{ item.number }}</view>
              <view class="type gray">{{ item._type }}</view>
            </view>
            <view class="col-right">
              <image
                src="https://cj.huazhe.work/images/shifting-code/edit_draw.png"
                mode="widthFit"
                @click="navTo(`/pages/shifting-code/edit-car?id=${item.id}`)"
              />
              <image
                src="https://cj.huazhe.work/images/shifting-code/delete_draw.png"
                mode="widthFit"
                @click="handleDelete(item.id)"
              />
            </view>
            <!-- <view class="tag">
              <u-tag
                text="已绑"
                type="warning"
              />
            </view> -->
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import timingMixin from '../../mixins/timingMixin';
import {
  getCarsRes,
  bindCodeCarRes,
  deleteCarRes,
} from '../../api';
import { debounce } from '../../utils/tool';

export default {
  mixins: [timingMixin],

  data() {
    return {
      cars: [],
      agreement: false,
      mobileForm: {
        data: {
          mobile: '',
          sms_vcode: '',
        },
      },
      carPopup: {
        visible: false,
      },
      selectedCar: null,
    };
  },

  async onLoad() {
    this.codeId = uni.getStorageSync('shifting_code_id') || 74;
    this.mobileForm.data.mobile = this.getAppUser().member_mobile;
    await this.getCars();
  },

  methods: {
    handleAgree() {
      this.agreement = !this.agreement;
    },
    handleShowCarPopup() {
      this.carPopup.visible = true;
    },
    handleGetCode() {
      this.getCode(this.mobileForm.data.mobile);
    },
    async getCars() {
      const {
        data: { carList },
      } = await getCarsRes();
      this.cars = carList.map((x) => ({
        ...x,
        _type: x.type == 1 ? '小型汽车(非营运)' : '小型汽车(营运)',
      }));
      this.selectedCar = this.cars[0] ? this.cars[0] : null;
    },
    handleSubmit: debounce(
      async function () {
        if (this.agreement) {
          if (
            !this.selectedCar ||
            !this.mobileForm.data.mobile ||
            !this.mobileForm.data.sms_vcode
          ) {
            uni.showToast({
              icon: 'none',
              title: '请填写完资料再提交~',
            });
            return;
          }
          const reqData = {
            ...this.mobileForm.data,
            id: this.codeId,
            car_id: this.selectedCar.id,
          };
          const { code, data } = await bindCodeCarRes(reqData);
          if (code == 200) {
            this.navTo('/pages/shifting-code/enable-success');
          } else {
            uni.showToast({
              icon: 'none',
              title: data,
            });
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: '请先勾选用户须知~',
          });
        }
      },
      3000,
      true
    ),
    handleUnbind() {
      uni.showModal({
        title: '解绑提示',
        content: '解绑挪车码后，将清空此二维码绑定的车牌号、手机号信息...',
        success: async ({ confirm }) => {
          if (confirm) {
            const { code, data } = await unbindCodeCarRes({
              id: this.codeId,
            });
            if (code == 200) {
              uni.showToast({
                icon: 'none',
                title: data,
              });
              uni.switchTab({
                url: '/pages/home/index',
              });
            }
          }
        },
      });
    },
    handleDelete(car_id) {
      uni.showModal({
        title: '提示',
        content: '确认要删除该车辆吗？',
        success: async ({ confirm }) => {
          if (confirm) {
            const { code, data } = await deleteCarRes({
              car_id,
            });
            if (code == 200) {
              uni.showToast({
                icon: 'none',
                title: data,
              });
              this.getCars();
            }
          }
        },
      });
    },
  },
};
</script>