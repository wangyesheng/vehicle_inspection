<template>
    <view class="company-container" :style="{ minHeight: sysHeight + 'px' }">
        <view class="polyfill content-wrap" v-if="companies.length" :style="{ minHeight: sysHeight - 40 + 'px' }">
            <view class="row" v-for="item in companies" :key="item.id" @click="handleNavTo(item)">
                <view class="label">{{item.name}}</view>
                <view class="value">
                    <text>{{item.staff_num}}名员工</text>
                    <u-icon name="arrow-right" />
                </view>
            </view>
        </view>
        <view class="polyfill no-data-wrap" :style="{ minHeight: sysHeight - 40 + 'px' }" v-else>
            <view>
                <image src="https://cj.huazhe.work/images/inspection/no_appointment.png" mode="widthFit" />
                <view>暂无协议单位~</view>
            </view>
        </view>
    </view>
</template>

<script>
import { getMyCompaniesRes } from "../../api";
export default {
  data() {
    return {
      sysHeight: 0,
      companies: []
    };
  },

  mounted() {
    this.sysHeight = this.getSysHeight();
    this.getMyCompanies();
  },

  methods: {
    async getMyCompanies() {
      const { data: { myCompanyList } } = await getMyCompaniesRes();
      this.companies = myCompanyList;
    },
    handleNavTo(item) {
      this.navTo(`/pages/me/employee?cid=${item.id}&companyName=${item.name}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.company-container {
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
    .row {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      background: #fff;
      border-bottom: 1rpx solid #f2f2f2;
      border-radius: 8rpx;
      min-height: 100rpx;
      padding: 35rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label {
        font-size: 32rpx;
        font-weight: bold;
        color: #000000;
        width: 70%;
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