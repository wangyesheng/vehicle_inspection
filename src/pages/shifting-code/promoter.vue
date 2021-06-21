<style lang="scss" scoped>
.promoter-wrap {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 50rpx;
  position: relative;
  background: #f5f5f5;
  view {
    width: 100%;
    margin-bottom: 36rpx;
  }

  .backhome {
    position: fixed;
    bottom: 100rpx;
    right: 50rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 4rpx 8rpx 0 #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 60rpx;
      height: 50rpx;
    }
  }
}
</style>

<template>
  <view class="promoter-wrap">
    <view>
      <u-button
        type="primary"
        shape="circle"
        @click="handleSubmit"
      >我要推广</u-button>
    </view>
    <view>
      <u-button
        shape="circle"
        @click="navTo('/pages/shifting-code/enable')"
      >自己用~</u-button>
    </view>
    <EOSBackhome />
  </view>
</template>

<script>
import { bindInviterCodeRes } from '../../api';
import EOSBackhome from '../../components/eos-backbome';

export default {
  components: {
    EOSBackhome,
  },

  onLoad(ops) {
    this.codeId = ops.codeId;
  },

  methods: {
    handleSubmit() {
      uni.showModal({
        title: '提示',
        content: '确定要绑定该推广二维码吗？',
        success: async (res) => {
          if (res.confirm) {
            const { data } = await bindInviterCodeRes({
              code_id: this.codeId,
            });
            uni.showToast({
              title: data,
              icon: 'none',
            });
          }
        },
      });
    },
  },
};
</script>