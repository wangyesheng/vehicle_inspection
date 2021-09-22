<style lang="scss" scoped>
.backhome {
  position: fixed;
  bottom: 80rpx;
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

.refresh {
  position: fixed;
  bottom: 60rpx;
  right: 50rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4rpx 8rpx 0 #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12000;
  image {
    width: 46rpx;
    height: 46rpx;
  }
}
</style>

<template>
  <view
    :class="type == 'refresh' ? 'refresh' : 'backhome'"
    @click="handleBackhome"
  >
    <image :src="`../../static/images/${type}.png`" mode="widthFit" />
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "home",
    },
  },
  methods: {
    handleBackhome() {
      uni.switchTab({
        url: "/pages/home/index",
      });
    },
  },
};
</script>

