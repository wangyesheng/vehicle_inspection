<template>
  <view class="contact-wrap">
    <view class="banner"></view>
    <view class="btn-wrap">
      <u-button type="warning">拨打车主电话</u-button>
    </view>
    <view class="tips"> 为了保护双方因此，本次通话将启用虚拟号码 </view>
    <view class="pull flex-vc">
        <text>免费领取挪车码</text>
        <image
            src="../../static/images/shifting-code/right_arrow.png"
            mode="widthFit"
        />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.contact-wrap {
  .banner {
    height: 458rpx;
    // background: url("../../static/images/shifting-code/contact_bg.png");
    background-size: 100% 100%;
  }
  .btn-wrap {
    margin-top: 52rpx;
    padding: 0 30rpx;
    & /deep/ button {
      height: 100rpx;
      line-height: 100rpx;
    }
  }
  .tips {
    margin-top: 30rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
  }
  .pull {
    text-align: center;
    margin-top: 128rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #5e93ec;
    
    image{
        width: 16rpx;
        height: 26rpx;
        margin-left: 10rpx;
    }
  }
}
</style>