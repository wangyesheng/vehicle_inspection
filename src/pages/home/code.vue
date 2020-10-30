<template>
  <view class="container">
    <tki-qrcode
      cid="qrcode1"
      ref="qrcode"
      :val="val"
      :size="size"
      :unit="unit"
      :background="background"
      :foreground="foreground"
      :pdground="pdground"
      :icon="icon"
      :iconSize="iconsize"
      :lv="lv"
      :onval="onval"
      :loadMake="loadMake"
      :usingComponents="true"
      @result="qrR"
    />
  </view>
</template>
<script>
import tkiQrcode from '../../components/eos-qrcode/index.vue';
export default {
  data() {
    return {
      ifShow: true,
      val: 'www.baidu.com', // 要生成的二维码值
      size: 200, // 二维码大小
      unit: 'upx', // 单位
      background: '#b4e9e2', // 背景色
      foreground: '#309286', // 前景色
      pdground: '#32dbc6', // 角标色
      icon: '', // 二维码图标
      iconsize: 40, // 二维码图标大小
      lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
      onval: false, // val值变化时自动重新生成二维码
      loadMake: true, // 组件加载完成后自动生成二维码
      src: '', // 二维码生成后的图片地址或base64
    };
  },
  methods: {
    
    qrR(res) {
      this.src = res;
    },
    
  },
  components: {
    tkiQrcode,
  },
  onLoad: function () {},
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.qrimg {
  display: flex;
  justify-content: center;
}
.qrimg-i {
  margin-right: 10px;
}
slider {
  width: 100%;
}
input {
  width: 100%;
  margin-bottom: 20upx;
}
.btns {
  display: flex;
  flex-direction: column;
  width: 100%;
}
button {
  width: 100%;
  margin-top: 10upx;
}
</style>