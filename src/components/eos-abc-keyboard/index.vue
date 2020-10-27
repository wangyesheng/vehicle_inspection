<template>
  <view
    class="u-keyboard"
    @touchmove.stop.prevent
  >
    <view class="u-keyboard-grids">
      <block>
        <view
          class="u-keyboard-grids-item"
          v-for="(group, i) in EngKeyBoardList"
          :key="i"
        >
          <view
            :hover-stay-time="100"
            @tap="carInputClick(i, j)"
            hover-class="u-carinput-hover"
            class="u-keyboard-grids-btn"
            v-for="(item, j) in group"
            :key="j"
          >
            {{ item }}
          </view>
        </view>
        <view
          @touchstart="backspaceClick"
          @touchend="clearTimer"
          :hover-stay-time="100"
          class="u-keyboard-back"
          hover-class="u-hover-class"
        >
          <u-icon
            :size="38"
            name="backspace"
            :bold="true"
          ></u-icon>
        </view>
        <view
          :hover-stay-time="100"
          class="u-keyboard-complete"
          hover-class="u-carinput-hover"
          @tap="handleComplete"
        >
          <text>完成</text>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  name: 'eos-abc-keyboard',
  props: {
    // 是否打乱键盘按键的顺序
    random: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    EngKeyBoardList() {
      let data = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        'Q',
        'W',
        'E',
        'R',
        'T',
        'Y',
        'U',
        'I',
        'O',
        'P',
        'A',
        'S',
        'D',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        'Z',
        'X',
        'C',
        'V',
        'B',
        'N',
        'M',
      ];
      let tmp = [];
      if (this.random) data = this.$u.randomArray(data);
      tmp[0] = data.slice(0, 10);
      tmp[1] = data.slice(10, 20);
      tmp[2] = data.slice(20, 30);
      tmp[3] = data.slice(30, 36);
      return tmp;
    },
  },
  methods: {
    // 点击键盘按钮
    carInputClick(i, j) {
      const value = this.EngKeyBoardList[i][j];
      this.$emit('change', value);
    },
    // 点击退格键
    backspaceClick() {
      this.$emit('backspace');
      clearInterval(this.timer); //再次清空定时器，防止重复注册定时器
      this.timer = null;
      this.timer = setInterval(() => {
        this.$emit('backspace');
      }, 250);
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    handleComplete() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.u-keyboard-grids {
  background: rgb(215, 215, 217);
  padding: 24rpx 0;
  position: relative;
}

.u-keyboard-grids-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-keyboard-grids-btn {
  text-decoration: none;
  width: 62rpx;
  flex: 0 0 64rpx;
  height: 80rpx;
  display: inline-block;
  font-size: 36rpx;
  text-align: center;
  line-height: 80rpx;
  background-color: #fff;
  margin: 8rpx 5rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 0rpx #888992;
  font-weight: 500;
}

.u-carinput-hover {
  background-color: rgb(185, 188, 195) !important;
}

.u-keyboard-back {
  position: absolute;
  width: 96rpx;
  right: 22rpx;
  bottom: 32rpx;
  height: 80rpx;
  background-color: rgb(185, 188, 195);
  display: flex;
  align-items: center;
  border-radius: 8rpx;
  justify-content: center;
  box-shadow: 0 2rpx 0rpx #888992;
}

.u-keyboard-complete {
  font-size: 24rpx;
  box-shadow: 0 2rpx 0rpx #888992;
  position: absolute;
  width: 96rpx;
  left: 22rpx;
  line-height: 1;
  bottom: 32rpx;
  height: 80rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  border-radius: 8rpx;
  justify-content: center;
}

.u-keyboard-complete text {
  color: rgb(237, 112, 64);
  font-size: 30rpx;
}
</style>
