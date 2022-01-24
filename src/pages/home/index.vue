<template>
  <view class="home-container" :style="{ minHeight: sysHeight + 'px' }">
    <view class="header">
      <image :src="headerBg" mode="widthFit" />
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
            src="https://cj.huazhe.work/images/home/speaker.png"
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
      <view class="banner-footer" v-for="item in buttonFlags" :key="item.value">
        <view v-if="buttonFlag === item.value">
          <view class="btn-disabled" v-if="item.value == 0">
            {{ item.label }}
          </view>
          <u-button
            type="warning"
            shape="circle"
            @click="handleNavTo(item.value)"
            v-else
          >
            {{ item.label }}
          </u-button>
        </view>
      </view>
      <view class="reserve-time" v-if="canShowReserveTime">
        已预约年检时间：{{ reserveTime }}
      </view>
    </view>
    <!-- <view class="process-wrap">
      <image
        src="https://cj.huazhe.work/images/home/process.png"
        mode="widthFit"
      />
    </view> -->
    <view class="code-wrap flex-01" @click="navToMiniProgram">
      <image src="../../static/images/home/wash1.png" mode="widthFit" />
      <view class="tips">
        <view>1元自助洗车</view>
        <view>
          <text>绵阳</text>
          <text>24小时共享自助洗车</text>
        </view>
      </view>
      <image
        src="https://cj.huazhe.work/images/home/arrow_right.png"
        mode="widthFit"
      />
    </view>
    <view class="code-wrap flex-01" @click="handleNavTo(3)">
      <image
        src="https://cj.huazhe.work/images/home/code.png"
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
        src="https://cj.huazhe.work/images/home/arrow_right.png"
        mode="widthFit"
      />
    </view>
    <view class="method-wrap">
      <view class="common agent" @click="handleToProcess(1)">
        <text class="deep">年检代办流程</text>
        <text class="shallow">点击查看</text>
      </view>
      <view class="common self" @click="handleToProcess(2)">
        <text class="deep">自驾办理流程</text>
        <text class="shallow">点击查看</text>
      </view>
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
            src="https://cj.huazhe.work/images/home/flag.jpg"
            mode="widthFit"
          />
        </view>
      </view>
    </u-modal>
    <u-popup
      closeable
      mode="bottom"
      class="popup-wrap"
      v-model="methodPopup.visible"
    >
      <view class="header">选择年检方式</view>
      <view class="content">
        <view class="row" @click="handleChooseMethod(1)">
          <view>
            <image src="../../static/images/order/daijia.png" mode="widthFit" />
          </view>
          <view class="right">
            <view class="top">上门代驾</view>
            <view class="bottom">专业人员上门取还车，全程代办，安全省心</view>
          </view>
        </view>
        <view class="row" @click="handleChooseMethod(2)">
          <view>
            <image src="../../static/images/order/zijia.png" mode="widthFit" />
          </view>
          <view class="right">
            <view class="top">自驾到站</view>
            <view class="bottom">自驾前往车检站，享受专员服务，方便舒心</view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import EOSSwiper from "../../components/eos-swiper";

import {
  diffMonths,
  currentFormatDate,
  getDateByDays,
  getDiffDate,
} from "../../utils/time";
import {
  getCarsRes,
  getNoticesRes,
  setCarDealRes,
  getMyCodeCountRes,
  getHomeImageRes,
  getShareImageRes,
} from "../../api";
import { BUTTON_FLAGS } from "../../constant";

export default {
  components: {
    "eos-swiper": EOSSwiper,
  },

  data() {
    return {
      processedModal: {
        visible: false,
        content: "系统将为你更新到下次年检时间，请确认是否已办理线上年检！",
      },
      notifies: [],
      cars: [],
      buttonFlag: undefined,
      buttonFlags: BUTTON_FLAGS,
      selectedCar: undefined,
      canShowReserveTime: false,
      reserveTime: "",
      sysHeight: 0,
      headerBg: "",
      methodPopup: {
        visible: false,
      },
    };
  },

  async onShareTimeline(_) {
    const appUser = this.getAppUser();
    let query;
    if (appUser.member_mobile) {
      query = `sharerId=${appUser.member_id}`;
    }
    const {
      data: { sharepic },
    } = await getShareImageRes();
    return {
      query,
      title: "汽车年审，还可以更快更简单",
      imageUrl: sharepic,
    };
  },

  onLoad(options) {
    console.log(options);
    this.sysHeight = this.getSysHeight();
    this.shiftingCodeCount = 0;
    // 海报分享二维码
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      const params = scene.split("&");
      console.log("params", params);
      params.forEach((item) => {
        const [key, value] = item.split("=");
        console.log("key, value", key, value);
        if (key == "sharerId" && value) {
          uni.setStorageSync("sharer_id", value);
        }
        if (key == "activityId" && value) {
          uni.setStorageSync("activity_id", value);
        }
      });
    }
    // 邀请微信好友
    if (options.sharerId) {
      uni.setStorageSync("sharer_id", options.sharerId);
    }
    if (options.activityId) {
      uni.setStorageSync("activity_id", options.activityId);
    }
  },

  onShow() {
    if (uni.getStorageSync("wantedNavToMiniProgram")) {
      uni.navigateToMiniProgram({
        appId: "wxe897189e473d3762",
        path: "pages/shop/buy_card?code=D82C8D1619AD8176D665453CFB2E55F08ADPHYSVHU19HZAPYL",
        envVersion: "release",
        fail: (error) => {
          console.log("navigateToMiniProgram", error);
        },
      });
      uni.setStorageSync("wantedNavToMiniProgram", false);
    }
    Promise.all([
      this.getCars(),
      this.getNotices(),
      this.getMyCodeCount(),
      this.getHomeImage(),
    ]);
  },

  methods: {
    navToMiniProgram() {
      if (!this.checkLogin()) {
        uni.navigateTo({
          url: "/pages/auth/login-nav?from=1",
        });
        return;
      }
      if (this.cars.length > 1) {
        // 已经添加车辆的直接跳转
        uni.navigateToMiniProgram({
          appId: "wxe897189e473d3762",
          path: "pages/shop/buy_card?code=D82C8D1619AD8176D665453CFB2E55F08ADPHYSVHU19HZAPYL",
          envVersion: "release",
          fail: (error) => {
            console.log("navigateToMiniProgram", error);
          },
        });
      } else {
        // 进入录入车辆页面
        this.navTo("/pages/car/add-form-chore?from=1");
      }
    },
    async getHomeImage() {
      const {
        data: { indexpic },
      } = await getHomeImageRes();
      this.headerBg = indexpic;
    },
    handleToProcess(flag) {
      flag == 1
        ? this.navTo("/pages/home/agent")
        : this.navTo("/pages/home/self");
    },
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
          image: "https://cj.huazhe.work//images/home/add_car_bg.png",
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
          editIcon: "https://cj.huazhe.work//images/home/edit_icon.png",
          number: x.number.toUpperCase(),
          image: "https://cj.huazhe.work/images/home/banner_bg.png",
        };
        const months = diffMonths(x.register_date, currentFormatDate);
        if (x.type == 1) {
          // 非营运
          if (months < 70) {
            layer._status = "六年免检";
          } else if (months >= 70 && months < 118) {
            layer._status = "两年一检";
          } else if (months >= 118 && months < 178) {
            layer._status = "一年一检";
          } else if (months >= 178) {
            layer._status = "一年两检";
          }
        } else {
          // 营运
          if (months <= 58) {
            layer._status = "一年一检";
          } else {
            layer._status = "一年两检";
          }
        }

        if (x.now < x.start_time || x.now > x.end_time) {
          // 未到期，不可预约
          layer.labelPrefix = "下次";
          layer.buttonFlag = 0;
        } else if (x.now > x.start_time && x.now < x.end_time) {
          layer.labelPrefix = "此次";
          layer.buttonFlag = 2;
          layer.appointmentDates = getDiffDate(
            x.start_time_str,
            x.end_time_str
          );
        } else if (
          Number(x.reserve_time) > x.start_time &&
          Number(x.reserve_time) < x.end_time
        ) {
          layer.labelPrefix = "此次";
          layer.buttonFlag = 1;
        }
        // switch (x.status) {
        //   // 未到期，不可预约
        //   case 0:
        //     layer.prompt = "距上线年检还剩";
        //     layer.isOverdue = false;
        //     layer.buttonFlag = 0;
        //     break;
        //   // 已预约
        //   case 1:
        //     if (layer.is_pass == 0) {
        //       // 未逾期
        //       layer.prompt = "距年检逾期还剩";
        //       layer.isOverdue = false;
        //     } else {
        //       layer.prompt = "年检已逾期";
        //       layer.isOverdue = true;
        //     }
        //     layer.buttonFlag = 1;
        //     break;
        //   // 已办理
        //   case 2:
        //     layer.prompt = "距上线年检还剩";
        //     layer.isOverdue = false;
        //     layer.buttonFlag = 0;
        //     break;
        //   // 可预约
        //   case 3:
        //     layer.prompt = "距年检逾期还剩";
        //     layer.isOverdue = false;
        //     layer.buttonFlag = 2;
        //     layer.appointmentDates = getDiffDate(x.start_time, x.end_time);
        //     break;
        //   // 已逾期
        //   case 4:
        //     layer.prompt = "年检已逾期";
        //     layer.isOverdue = true;
        //     layer.buttonFlag = 2;
        //     const date = getDateByDays(30 - x.days);
        //     console.log(date, currentFormatDate);
        //     // 2020-12-29 2020-12-29
        //     layer.appointmentDates = getDiffDate(currentFormatDate, date);
        //     break;
        // }
        return layer;
      });
      uni.setStorageSync("app_user_cars", this.cars);
      if (this.cars.length < 3) {
        this.cars.push({
          image: "https://cj.huazhe.work//images/home/add_car_bg.png",
          canAddCar: true,
          buttonFlag: -1,
        });
      }
      this.selectedCar = this.cars[0];
      this.buttonFlag = this.cars[0].buttonFlag;
      this.canShowReserveTime = this.buttonFlag == 1 ? true : false;
      this.reserveTime = this.selectedCar.reserve_date;
    },
    handleNavTo(flag) {
      if (!this.checkLogin()) {
        uni.navigateTo({
          url: "/pages/auth/login-nav?from=1",
        });
        return;
      }
      switch (flag) {
        case -1:
          this.navTo("/pages/car/add-form-chore");
          break;
        case 1:
          this.navTo("/pages/reservation/index");
          break;
        case 2:
          this.methodPopup.visible = true;
          break;
        case 3:
          this.shiftingCodeCount == 0
            ? this.navTo("/pages/shifting-code/apply")
            : this.navTo("/pages/shifting-code/index");
          break;
      }
    },
    handleChooseMethod(flag) {
      flag == 1
        ? this.navTo(`/pages/order/index?carId=${this.selectedCar.id}`)
        : this.navTo(`/pages/inspection/station?carId=${this.selectedCar.id}`);
    },
    onProcessed() {
      this.processedModal.visible = true;
    },
    handleSwiperChange(value) {
      const scope = this.cars.find((x, idx) => value === idx);
      this.selectedCar = scope;
      this.buttonFlag = scope.buttonFlag;
      this.canShowReserveTime = scope.buttonFlag == 1 ? true : false;
      this.reserveTime = scope.reserve_date;
    },
    async handleConfirm() {
      const { code, data } = await setCarDealRes({
        car_id: this.selectedCar.id,
      });
      if (code == 200) {
        this.getCars();
      } else {
        uni.showToast({
          title: data,
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  background: #5e93ec;
  padding: 0 30rpx 30rpx;

  .method-wrap {
    display: flex;
    justify-content: space-between;
    .common {
      width: 320rpx;
      height: 120rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 30rpx;
      background: #fff;
      border-radius: 10rpx;
      .deep {
        font-size: 28rpx;
        font-weight: 500;
        color: #000000;
      }

      .shallow {
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
      }
    }

    .agent {
      // background: url("../../static/images/home/agent.png") no-repeat;
    }

    .self {
      // background: url("../../static/images/home/self.png") no-repeat;
    }
  }

  .popup-wrap {
    height: 500rpx;

    & /deep/ .u-icon__icon {
      top: 0 !important;
    }

    .header {
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.1);
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }

    .content {
      padding: 50rpx 30rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .row {
        height: 180rpx;
        width: 690rpx;
        border: 1rpx solid #cccccc;
        border-radius: 10rpx;
        margin-bottom: 30rpx;

        display: flex;
        align-items: center;
        justify-content: center;

        image {
          width: 90rpx;
          height: 90rpx;
        }

        .right {
          margin-left: 24rpx;

          .top {
            text-align: left;
            font-size: 32rpx;
            font-weight: bold;
            color: #000000;
          }

          .bottom {
            font-size: 26rpx;
            font-weight: 400;
            color: #999999;
          }
        }
      }
    }
  }

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
        font-size: 30rpx;
        font-weight: 500;
        color: #999;
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
    margin-bottom: 30rpx;

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
