<template>
  <view class="home-container">
    <view class="header">
      <image
        src="../../static/images/home/header-bg.png"
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
    </view>
    <view class="process-wrap">
      <image
        src="../../static/images/home/process.png"
        mode="widthFit"
      />
    </view>
    <u-modal
      title="温馨提示"
      v-model="processedModal.visible"
      :show-cancel-button="true"
      :title-style="{ fontSize: 36, fontWeight: 'bold', color: '#000' }"
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

import { diffMonths, currentFormatDate } from '../../utils/time';
import { getCarsRes, getNoticesRes } from '../../api';
import { BUTTON_FLAGS } from '../../constant';
import { getDiffDate } from '../../utils/time';

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
    };
  },

  onLoad(options) {
    if (options.sharerId) {
      uni.setStorageSync('sharer_id', options.sharerId);
    }
  },

  onShow() {
    Promise.all([this.getCars(), this.getNotices()]);
  },

  methods: {
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
          appointmentDates: getDiffDate(x.start_time, x.end_time),
        };
        if (x.type == 1) {
          const months = diffMonths(x.register_date, currentFormatDate);
          if (months < 70) {
            layer._status = '六年免检';
          } else if (months >= 70) {
            layer._status = '上线检测';
          }
        } else {
          layer._status = '上线检测';
        }

        switch (x.status) {
          // 未到期，不可预约
          case 0:
            layer.prompt = '距上线年检还剩';
            layer.promptValue = x.days;
            layer.isOverdue = false;
            layer.buttonFlag = 0;
            break;
          // 已预约
          case 1:
            layer.prompt = '距年检逾期还剩';
            layer.promptValue = x.days;
            layer.isOverdue = false;
            layer.buttonFlag = 1;
            break;
          // 已办理
          case 2:
            layer.prompt = '距上线年检还剩';
            layer.promptValue = x.days;
            layer.isOverdue = false;
            layer.buttonFlag = 0;
            break;
          // 可预约
          case 3:
            layer.prompt = '距年检逾期还剩';
            layer.promptValue = x.days;
            layer.isOverdue = false;
            layer.buttonFlag = 2;
            break;
          // 已逾期
          case 4:
            layer.prompt = '年检已逾期';
            layer.promptValue = x.days;
            layer.isOverdue = true;
            layer.buttonFlag = 2;
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
    },
    handleNavTo(flag) {
      if (!this.checkLogin()) {
        uni.navigateTo({
          url: `/pages/auth/login-nav`,
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
      }
    },
    onProcessed() {
      this.processedModal.visible = true;
    },
    handleSwiperChange(value) {
      const scope = this.cars.find((x, idx) => value === idx);
      this.selectedCar = scope;
      this.buttonFlag = scope.buttonFlag;
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
    .banner-top {
      padding: 0 28rpx;
      margin-bottom: 30rpx;
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
}
</style>