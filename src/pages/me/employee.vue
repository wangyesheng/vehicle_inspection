<template>
    <view class="employee-container" :style="{ minHeight: sysHeight + 'px' }">
        <u-navbar :title="companyName" title-color="#fff" back-icon-color="#fff" back-icon-name="arrow-left" :background="{ background: '#5e93ec' }" />
        <view class="polyfill content-wrap" :style="{ minHeight: sysHeight - 112 + 'px' }" v-if="employees.length">
            <view class="record-wrap" v-for="item in employees" :key="item">
                <image :src="item.headpic?item.headpic:'https://cj.huazhe.work/images/me/male.png'" mode="widthFit" />
                <view>
                    <view class="name">{{item.username}}</view>
                    <view class="time">邀请注册时间：{{item.register_time}}</view>
                </view>
            </view>
        </view>
        <view class="polyfill no-data-wrap" :style="{ minHeight: sysHeight - 112 + 'px' }" v-else>
            <view>
                <image src="https://cj.huazhe.work/images/inspection/no_appointment.png" mode="widthFit" />
                <view>暂无成员~</view>
            </view>
        </view>
    </view>
</template>

<script>
import { getEmployeesByCIdRes } from "../../api";
export default {
  data() {
    return {
      sysHeight: 0,
      companyName: "",
      employees: []
    };
  },

  mounted() {
    this.sysHeight = this.getSysHeight();
  },

  onLoad(options) {
    this.cid = options.cid;
    this.companyName = options.companyName;
    this.getEmployeesByCId();
  },

  methods: {
    async getEmployeesByCId() {
      const { data: { memberList } } = await getEmployeesByCIdRes({
        cid: this.cid
      });
      this.employees = memberList;
    }
  }
};
</script>

<style lang="scss" scoped>
.employee-container {
  background: #5e93ec;
  padding: 30rpx;
  position: relative;
  z-index: 1;

  .polyfill {
    background: #fff;
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