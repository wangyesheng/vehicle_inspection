<template>
  <view
    class="customer-container"
    :style="{ minHeight: sysHeight + 'px' }"
  >
    <view
      class="unit-wrap"
      v-if="appUser.gid==='2'"
      @click="handleNavTo"
    >
      <view class="label">已发展协议单位</view>
      <view class="value">
        <text>{{companyLength}}家</text>
        <u-icon name="arrow-right" />
      </view>
    </view>
    <view
      class="content-wrap ployfill"
      v-if="customers.length"
      :style="{ minHeight: sysHeight - 40 + 'px' }"
    >
      <view
        class="record-wrap"
        v-for="item in customers"
        :key="item"
      >
        <image
          :src="item.headpic?item.headpic:require('../../static/images/me/male.png')"
          mode="widthFit"
        />
        <view>
          <view class="name">{{item.username}}</view>
          <view class="time">邀请注册时间：{{item.register_time}}</view>
        </view>
      </view>
    </view>
    <view
      class="no-data-wrap ployfill"
      :style="{ minHeight: sysHeight - 40 + 'px' }"
      v-else
    >
      <view>
        <image
          src="../../static/images/inspection/no_appointment.png"
          mode="widthFit"
        />
        <view>暂无邀请的好友~</view>
        <view class="btn-wrap_wechat">
          <button
            open-type="share"
            @click="handleShare"
          />
        </view>
        <view class="btn-wrap_timeline">
          <button
            open-type="share"
            @click="handleShareToTimeline"
          />
        </view>
      </view>
    </view>
    <view class="footer-wrap">
      <view class="btn-wrap_wechat">
        <button
          open-type="share"
          @click="handleShare"
        />
      </view>
      <view class="btn-wrap_timeline">
        <button
          open-type="share"
          @click="handleShareToTimeline"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { getMyCustomersRes, getMyCompaniesRes } from '../../api';
export default {
  data() {
    return {
      sysHeight: 0,
      customers: [],
      appUser: this.getAppUser(),
      companyLength: 0,
    };
  },

  mounted() {
    this.sysHeight = this.getSysHeight();
    this.getMyCustomers();
    if (this.appUser.gid === '2') {
      this.getMyCompanies();
    }
  },

  methods: {
    async getMyCustomers() {
      const {
        data: { offlineList },
      } = await getMyCustomersRes();
      this.customers = offlineList;
    },
    async getMyCompanies() {
      const {
        data: { myCompanyList },
      } = await getMyCompaniesRes();
      this.companyLength = myCompanyList ? myCompanyList.length : 0;
    },
    handleNavTo() {
      this.navTo('/pages/me/company');
    },
    handleShare() {
      const path = `/pages/home/index?sharerId=${this.appUser.member_id}`;
      return {
        path,
        title: '1小时快速审车，5颗星贴心服务',
        imageUrl: 'https://cj.huazhe.work/static/images/share.png',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-container {
  background: #5e93ec;
  padding: 30rpx;
  position: relative;
  z-index: 1;
  .ployfill {
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(94, 148, 236, 0.2);
    border-radius: 8rpx;
  }
  .content-wrap {
    .record-wrap {
      border-bottom: 1rpx solid #f2f2f2;
      padding: 35rpx 30rpx;
      display: flex;
      align-items: center;
      image {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      .name {
        font-size: 32rpx;
        font-weight: 500;
        color: #343434;
        margin-bottom: 25rpx;
      }
      .time {
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(120, 120, 120, 0.8);
      }
    }
  }

  .footer-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    height: 120rpx;
    background: #fff;
    padding: 15rpx 30rpx;
    display: flex;
    justify-content: space-around;
    align-items:center;
  }

  .btn-wrap_wechat {
    button {
      width: 330rpx;
      height: 90rpx;
      background-image: url('../../static/images/me/wechat.png');
      background-size: 100% 100%;
      border-radius: 45rpx;
    }
    button::after {
      border-color: transparent;
    }
  }

  .btn-wrap_timeline {
    button {
      width: 330rpx;
      height: 90rpx;
      background-image: url('../../static/images/me/timeline.png');
      background-size: 100% 100%;
      border-radius: 45rpx;
    }
    button::after {
      border-color: transparent;
    }
  }

  .unit-wrap {
    height: 100rpx;
    background: #fff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(94, 148, 236, 0.2);
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    padding: 32rpx 35rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      font-size: 32rpx;
      font-weight: bold;
      color: #000000;
    }
    .value {
      font-size: 28rpx;
      font-weight: 400;
      color: #9a9a9a;

      & /deep/ .u-icon {
        position: relative;
        left: 0;
        bottom: 2rpx;
      }
    }
  }
  .no-data-wrap {
    padding: 20rpx 0 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 199rpx;
      height: 155rpx;
    }
    view {
      font-size: 28rpx;
      font-weight: 500;
      color: #9a9a9a;
      margin-top: 30rpx;
      text-align: center;
    }
  }
}
</style>