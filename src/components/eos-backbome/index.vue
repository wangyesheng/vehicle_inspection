<style lang="scss" scoped>
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
  z-index: 12000;
  image {
    width: 60rpx;
    height: 50rpx;
  }
}
</style>

<template>
  <view
    class="backhome"
    @click="handleBackhome"
  >
    <image
      src="../../static/images/home.png"
      mode="widthFit"
    />
  </view>
</template>

<script>
export default {
  methods: {
    handleBackhome() {
      uni.switchTab({
        url: '/pages/home/index',
      });
    },
  },
};
</script>

