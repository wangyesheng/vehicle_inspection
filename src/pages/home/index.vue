<template>
  <view
    class="home-container"
    :style="{ minHeight: sysHeight+'px'}"
  >
    <view class="header">
      <image
        src="../../static/images/home/header-bg.jpg"
        mode="widthFit"
      />
    </view>
    <view class="banner-wrap">
      <view class="banner-top">
        <u-notice-bar
          mode="horizontal"
          type="none"
          padding="0"
          :list="notifies"
          :volume-icon="false"
        >
          <image
            slot="speaker"
            src="../../static/images/home/speaker.png"
            mode="widthFit"
          />
        </u-notice-bar>
      </view>
      <view class="banner-center">
        <eos-swiper
          height="336"
          :autoplay="false"
          :list="cars"
          @on-processed="onProcessed"
          @change="handleSwiperChange"
        />
      </view>
      <view
        class="banner-footer"
        v-for="item in buttonFlags"
        :key="item.value"
      >
        <view v-if="buttonFlag===item.value">
          <view
            class="btn-disabled"
            v-if="item.value==0"
          >
            {{item.label}}
          </view>
          <u-button
            type="warning"
            shape="circle"
            @click="handleNavTo(item.value)"
            v-else
          >
            {{item.label}}
          </u-button>
        </view>
      </view>
      <view
        class="reserve-time"
        v-if="canShowReserveTime"
      >
        已预约年检时间：{{reserveTime}}
      </view>
    </view>
    <!-- <view class="process-wrap">
      <image
        src="../../static/images/home/process.png"
        mode="widthFit"
      />
    </view> -->
    <view
      class="code-wrap flex-01"
      @click="handleNavTo(3)"
    >
      <image
        src="../../static/images/home/code.png"
        mode="widthFit"
      />
      <view class="tips">
        <view>我的挪车码</view>
        <view>
          <text>虚拟呼叫</text>
          <text>隐私保护</text>
          <text>永久免费</text>
        </view>
      </view>
      <image
        src="../../static/images/home/arrow_right.png"
        mode="widthFit"
      />
    </view>
    <u-modal
      title="温馨提示"
      v-model="processedModal.visible"
      :show-cancel-button="true"
      :title-style="{ fontSize: 36, fontWeight: 'bold', color: '#000' }"
      @confirm="handleConfirm"
    >
      <view class="content-wrap">
        <view class="c-main">{{ processedModal.content }}</view>
        <view class="c-image">
          <image
            src="../../static/images/home/flag.jpg"
            mode="widthFit"
          />
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import EOSSwiper from '../../components/eos-swiper';
import bannerBg from '../../static/images/home/banner_bg.png';
import editIcon from '../../static/images/home/edit_icon.png';
import addCarBg from '../../static/images/home/add_car_bg.png';

import {
  diffMonths,
  currentFormatDate,
  getDateByDays,
  getDiffDate,
} from '../../utils/time';
import {
  getCarsRes,
  getNoticesRes,
  setCarDealRes,
  getMyCodeCountRes,
} from '../../api';
import { BUTTON_FLAGS } from '../../constant';

export default {
  components: {
    'eos-swiper': EOSSwiper,
  },

  data() {
    return {
      processedModal: {
        visible: false,
        content: '系统将为你更新到下次年检时间，请确认是否已办理线上年检！',
      },
      notifies: [],
      cars: [],
      buttonFlag: undefined,
      buttonFlags: BUTTON_FLAGS,
      selectedCar: undefined,
      canShowReserveTime: false,
      reserveTime: '',
      sysHeight: 0,
    };
  },

  onLoad(options) {
    this.sysHeight = this.getSysHeight();
    this.shiftingCodeCount = 0;
    // 海报分享二维码
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      const sharerId = scene.split('=')[1];
      uni.setStorageSync('sharer_id', sharerId);
    }
    // 邀请微信好友
    if (options.sharerId) {
      uni.setStorageSync('sharer_id', options.sharerId);
    }
  },

  onShow() {
    Promise.all([this.getCars(), this.getNotices(), this.getMyCodeCount()]);
  },

  methods: {
    async getMyCodeCount() {
      if (!this.checkLogin()) {
        return;
      }
      const {
        code,
        data: { count },
      } = await getMyCodeCountRes();
      if (code == 200) {
        this.shiftingCodeCount = count;
      }
    },
    async getNotices() {
      const {
        data: { noticeList },
      } = await getNoticesRes();
      this.notifies = noticeList.map((x) => x.note);
    },
    async getCars() {
      this.cars = [];
      if (!this.checkLogin()) {
        this.cars.push({
          image: addCarBg,
          canAddCar: true,
          buttonFlag: -1,
        });
        this.buttonFlag = -1;
        return;
      }
      const {
        data: { carList },
      } = await getCarsRes();
      this.cars = carList.map((x) => {
        let layer = {
          ...x,
          editIcon,
          number: x.number.toUpperCase(),
          image: bannerBg,
        };
        const months = diffMonths(x.register_date, currentFormatDate);
        if (x.type == 1) {
          // 非营运
          if (months < 70) {
            layer._status = '六年免检';
          } else if (months >= 70 && months < 118) {
            layer._status = '两年一检';
          } else if (months >= 118 && months < 178) {
            layer._status = '一年一检';
          } else if (months >= 178) {
            layer._status = '一年两检';
          }
        } else {
          // 营运
          if (months <= 58) {
            layer._status = '一年一检';
          } else {
            layer._status = '一年两检';
          }
        }

        switch (x.status) {
          // 未到期，不可预约
          case 0:
            layer.prompt = '距上线年检还剩';
            layer.isOverdue = false;
            layer.buttonFlag = 0;
            break;
          // 已预约
          case 1:
            if (layer.is_pass == 0) {
              // 未逾期
              layer.prompt = '距年检逾期还剩';
              layer.isOverdue = false;
            } else {
              layer.prompt = '年检已逾期';
              layer.isOverdue = true;
            }
            layer.buttonFlag = 1;
            break;
          // 已办理
          case 2:
            layer.prompt = '距上线年检还剩';
            layer.isOverdue = false;
            layer.buttonFlag = 0;
            break;
          // 可预约
          case 3:
            layer.prompt = '距年检逾期还剩';
            layer.isOverdue = false;
            layer.buttonFlag = 2;
            layer.appointmentDates = getDiffDate(x.start_time, x.end_time);
            break;
          // 已逾期
          case 4:
            layer.prompt = '年检已逾期';
            layer.isOverdue = true;
            layer.buttonFlag = 2;
            const date = getDateByDays(30 - x.days);
            console.log(date, currentFormatDate);
            // 2020-12-29 2020-12-29
            layer.appointmentDates = getDiffDate(currentFormatDate, date);
            break;
        }
        return layer;
      });
      uni.setStorageSync('app_user_cars', this.cars);
      if (this.cars.length < 3) {
        this.cars.push({
          image: addCarBg,
          canAddCar: true,
          buttonFlag: -1,
        });
      }
      this.selectedCar = this.cars[0];
      this.buttonFlag = this.cars[0].buttonFlag;
      this.canShowReserveTime = this.selectedCar.status == 1 ? true : false;
      this.reserveTime = this.selectedCar.reserve_date;
    },
    handleNavTo(flag) {
      if (!this.checkLogin()) {
        uni.navigateTo({
          url: '/pages/auth/login-nav?from=1',
        });
        return;
      }
      switch (flag) {
        case -1:
          this.navTo('/pages/car/add-form');
          break;
        case 1:
          this.navTo('/pages/reservation/index');
          break;
        case 2:
          this.navTo(`/pages/inspection/station?carId=${this.selectedCar.id}`);
          break;
        case 3:
          this.shiftingCodeCount == 0
            ? this.navTo('/pages/shifting-code/apply')
            : this.navTo('/pages/shifting-code/index');
          break;
      }
    },
    onProcessed() {
      this.processedModal.visible = true;
    },
    handleSwiperChange(value) {
      const scope = this.cars.find((x, idx) => value === idx);
      this.selectedCar = scope;
      this.buttonFlag = scope.buttonFlag;
      this.canShowReserveTime = scope.status == 1 ? true : false;
      this.reserveTime = scope.reserve_date;
    },
    async handleConfirm() {
      const { code, data } = await setCarDealRes({
        car_id: this.selectedCar.id,
      });
      if (code == 200) {
        this.getCars();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  background: #5e93ec;
  padding: 0 30rpx 30rpx;
  .content-wrap {
    .c-main {
      padding: 33rpx 41rpx 30rpx 37rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: #000;
    }
    .c-image {
      margin-bottom: 40rpx;
      text-align: center;
      image {
        width: 228rpx;
        height: 240rpx;
        border-radius: 20rpx;
      }
    }
  }
  .banner-wrap {
    width: 690rpx;
    height: 600rpx;
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(94, 147, 236, 0.2);
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    padding: 32rpx 0;
    .reserve-time {
      text-align: center;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      padding: 10rpx 0;
    }
    .banner-top {
      padding: 0 28rpx;
      margin-bottom: 20rpx;
      image {
        width: 32rpx;
        height: 29rpx;
      }

      & /deep/ .u-notice-text {
        color: #666 !important;
      }
    }

    .banner-center {
      margin-bottom: 30rpx;
      padding: 0rpx 10rpx;
    }

    .banner-footer {
      padding: 0 28rpx;
      .btn-disabled {
        height: 90rpx;
        background: #e6e6e6;
        box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(204, 204, 204, 0.3);
        border-radius: 45rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
        line-height: 90rpx;
      }
    }
  }
  .header {
    image {
      width: 100%;
      height: 260rpx;
    }
  }
  .process-wrap {
    image {
      width: 100%;
      height: 1540rpx;
    }
  }
  .code-wrap {
    height: 200rpx;
    background: #ffffff;
    box-shadow: 0 0 20rpx 0 rgba(94, 147, 236, 0.2);
    border-radius: 8rpx;
    image:first-child {
      width: 100rpx;
      height: 100rpx;
    }

    .tips {
      view:first-child {
        font-size: 42rpx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 10rpx;
      }
      view:last-child {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        text {
          margin-right: 20rpx;
        }
      }
    }

    image:last-child {
      width: 16rpx;
      height: 26rpx;
    }
  }
}
</style>