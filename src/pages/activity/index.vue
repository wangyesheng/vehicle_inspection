<template>
  <view class="activity-wrap">
    <view class="row" v-for="(item, index) in activities" :key="index">
      <view class="content">
        <view class="left">
          <image src="../../static/images/activity/tpy.png"></image>
        </view>
        <view class="right">
          <view class="title">{{ item.ac_name }}</view>
          <view class="time">{{ item.startTime }} - {{ item.endTime }}</view>
          <view class="status">
            <u-tag
              shape="circleLeft"
              :text="item.status.label"
              :type="item.status.type"
            />
          </view>
        </view>
      </view>
      <view class="detail" @click="() => (popupVisible = true)">
        <text>查看权益详情</text>
      </view>
    </view>
    <u-popup v-model="popupVisible" mode="center" width="80%">
      <view class="illustrate">
        <text> 1.小型私家车年检，检测费仅需240元；</text>
        <text>
          2.免费获取“上门代驾”代办机动车年检服务1次（限绵阳主城区内）；
        </text>
        <text> 3.预约“自驾到站”进行车辆年检，再享10元现金优惠补贴；</text>
        <text>
          4.预约”自驾到站“，专人免费现场代办，承诺1小时完成线上检测；
        </text>
        <text> 5.首次上线未通过，复检免费；</text>
        <text> 权益说明：</text>
        <text> 1.该权益仅针对太平洋保险车辆有效；</text>
        <text> 2.该活动仅针对小、轻（微）型私家车有效；</text>
        <text> 3.该活动仅针对“对应的添加车辆”有效；</text>
        <text> 4.该活动解释权归“川B年检”平台，有疑问请咨询平台客服；</text>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getMyActivityRes } from "../../api";

export default {
  onLoad() {
    this.getMyActivity();
  },

  data() {
    return {
      activities: [],
      popupVisible: false,
    };
  },

  methods: {
    async getMyActivity() {
      const {
        data: { info },
      } = await getMyActivityRes();
      this.activities.push({
        ...info,
        startTime: this.$u.timeFormat(info.ac_start_time * 1000, "yyyy.mm.dd"),
        endTime: this.$u.timeFormat(info.ac_end_time * 1000, "yyyy.mm.dd"),
        status:
          info.is_sign == 0
            ? {
                label: "暂无权益",
                type: "error",
              }
            : info.is_sign == 1 && info.is_check == 0
            ? {
                type: "primary",
                label: "未核销",
              }
            : {
                type: "warning",
                label: "已核销",
              },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-wrap {
  background: #f5f5f5;
  min-height: 100vh;
  .row {
    background: #fff;
    padding: 30rpx 30rpx 0;
    .content {
      display: flex;
      align-items: center;
      padding-bottom: 10rpx;
      border-bottom: 2rpx solid #f5f5f5;
      .left {
        image {
          width: 180rpx;
          height: 180rpx;
          border-radius: 10rpx;
        }
      }
      .right {
        padding-left: 30rpx;
        view {
          padding-top: 10rpx;
        }
        .title {
          font-size: 32rpx;
          font-weight: 600;
        }

        .time {
          color: #666;
        }
      }
    }
    .detail {
      text-align: center;
      color: #666;
      padding: 20rpx;
    }
  }
  .illustrate {
    display: flex;
    flex-direction: column;
    padding: 30rpx;
    font-weight: 500;
    color: #666;
    text {
      display: inline-block;
      margin: 10rpx 0;
    }
  }
}
</style>