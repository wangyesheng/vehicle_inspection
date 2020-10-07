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
          :list="notifies"
          :volume-icon="false"
          padding="0"
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
          <u-button
            type="warning"
            shape="circle"
            @click="handleNavTo(item.value)"
            v-if="item.value!==3&&item.value!==4"
          >
            {{item.label}}
          </u-button>
          <view
            class="btn-disabled"
            v-else
          >
            {{item.label}}
          </view>
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
            src="../../static/images/home/flag.png"
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

import { diffMonths, zeroPadding } from '../../utils/time';
import { getCarsRes } from '../../api';
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
        content:
          '系统将为你更新到下次年检时间，请检查是否已办理并领取过2020年机动车检验合格标志',
      },
      notifies: ['年检开始啦...', '优惠大放送...', '快来年检啊...'],
      cars: [],
      buttonFlag: undefined,
      buttonFlags: BUTTON_FLAGS,
      selectedCar: undefined,
    };
  },

  onShow() {
    this.getCars();
  },

  methods: {
    async getCars() {
      this.cars = [];
      if (!this.checkLogin()) {
        this.cars.push({
          image: addCarBg,
          canAddCar: true,
          buttonFlag: 0,
        });
        this.buttonFlag = 0;
        return;
      }
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();
      const date = `${currentYear}-${zeroPadding(currentMonth)}-${zeroPadding(
        currentDay
      )}`;
      const {
        data: { carList },
      } = await getCarsRes();
      const cars = carList.map((x) => {
        let layer = {
          ...x,
          image: bannerBg,
          editIcon,
          appointmentDates: getDiffDate(x.start_time, x.end_time),
        };
        const months = diffMonths(x.register_date, date);
        if (months < 70) {
          layer.status = '六年免检';
        } else if (months >= 70) {
          layer.status = '上线检测';
        }

        if (x.is_do === 1) {
          layer.prompt = '年检办理还剩';
          layer.promptValue = x.days;
          layer.isOverdue = false;
          layer.buttonFlag = 1;
        }

        if (x.is_deal === 1) {
          layer.prompt = '年检办理还剩';
          layer.promptValue = x.days;
          layer.isOverdue = false;
          layer.buttonFlag = 2;
        }

        if (x.is_pass === 1) {
          layer.prompt = '年检已逾期';
          layer.promptValue = x.days;
          layer.isOverdue = true;
          layer.buttonFlag = 3;
        }

        if (x.is_do === 0 && x.is_pass === 0) {
          layer.prompt = '距离办理还剩';
          layer.promptValue = x.days;
          layer.isOverdue = false;
          layer.buttonFlag = 4;
        }

        return layer;
      });
      this.cars = cars;
      uni.setStorageSync('app_user_cars', this.cars);

      if (cars.length < 3) {
        this.cars.push({
          image: addCarBg,
          canAddCar: true,
          buttonFlag: 0,
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
        case 0:
          this.navTo('/pages/car/add-form');
          break;
        case 1:
          this.navTo(`/pages/inspection/station?carId=${this.selectedCar.id}`);
          break;
        case 2:
          this.navTo('/pages/reservation/index');
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
      height: 1080rpx;
    }
  }
}
</style>