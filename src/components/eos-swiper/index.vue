<template>
  <view
    class="u-swiper-wrap"
    :style="{
      borderRadius: `${borderRadius}rpx`,
    }"
  >
    <swiper
      @change="change"
      @animationfinish="animationfinish"
      :interval="interval"
      :circular="circular"
      :duration="duration"
      :autoplay="autoplay"
      :previous-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
      :next-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
      :style="{
        height: height + 'rpx',
      }"
    >
      <swiper-item
        class="u-swiper-item"
        v-for="(item, index) in list"
        :key="index"
      >
        <view
          class="u-list-image-wrap"
          @tap.stop.prevent="listClick(index)"
          :class="[current != index ? 'u-list-scale' : '']"
          :style="{
            borderRadius: `${borderRadius}rpx`,
            transform:
              effect3d && current != index ? 'scaleY(0.9)' : 'scaleY(1)',
            margin: effect3d && current != index ? '0 20rpx' : 0,
            backgroundImage: `url(${item[name]})`,
            backgroundSize: '100% 100%',
          }"
        >
          <view
            class="cover-wrap"
            v-if="!item.canAddCar"
          >
            <view class="cover-header">
              <view class="cover-header-l">
                <view class="car-num">{{ item.number }}</view>
                <view class="car-desc">小型汽车({{item.type==='1'?'非营运':'营运'}})</view>
              </view>
              <view class="cover-header-r">
                <view class="tag-default">{{ item._status }}</view>
              </view>
            </view>
            <view class="cover-footer">
              <view
                class="cover-footer-l"
                :style="{ color: item.isOverdue ? '#FF474F' : '#fff' }"
              >
                <text class="prompt-label">{{ item.prompt }}</text>
                <text class="prompt-value">{{ `${item.days}天` }}</text>
                <text
                  class="btn-plain position"
                  v-if="item.status==3||item.status==4"
                  @click="handleProcessed"
                >
                  我已办理
                </text>
              </view>
              <view
                class="cover-footer-r"
                @click="handleNavTo(item.id)"
              >
                <image
                  :src="item.editIcon"
                  mode="widthFit"
                />
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view
      class="u-swiper-indicator"
      :style="{
        top:
          indicatorPos == 'topLeft' ||
          indicatorPos == 'topCenter' ||
          indicatorPos == 'topRight'
            ? '12rpx'
            : 'auto',
        bottom:
          indicatorPos == 'bottomLeft' ||
          indicatorPos == 'bottomCenter' ||
          indicatorPos == 'bottomRight'
            ? '-10rpx'
            : 'auto',
        justifyContent: justifyContent,
        padding: `0 ${effect3d ? '74rpx' : '24rpx'}`,
      }"
      v-if="list.length!==1"
    >
      <block v-if="mode == 'rect'">
        <view
          class="u-indicator-item-rect"
          :class="{ 'u-indicator-item-rect-active': index == current }"
          v-for="(item, index) in list"
          :key="index"
        ></view>
      </block>
      <block v-if="mode == 'dot'">
        <view
          class="u-indicator-item-dot"
          :class="{ 'u-indicator-item-dot-active': index == current }"
          v-for="(item, index) in list"
          :key="index"
        ></view>
      </block>
      <block v-if="mode == 'round'">
        <view
          class="u-indicator-item-round"
          :class="{ 'u-indicator-item-round-active': index == current }"
          v-for="(item, index) in list"
          :key="index"
        ></view>
      </block>
      <block v-if="mode == 'number'">
        <view class="u-indicator-item-number">{{ current + 1 }}/{{ list.length }}</view>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  name: 'eos-swiper',
  props: {
    // 轮播图的数据,格式如：[{image: 'xxxx', title: 'xxxx'}，{image: 'yyyy', title: 'yyyy'}]，其中title字段可选
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否显示title标题
    title: {
      type: Boolean,
      default: false,
    },
    // 用户自定义的指示器的样式
    indicator: {
      type: Object,
      default() {
        return {};
      },
    },
    // 圆角值
    borderRadius: {
      type: [Number, String],
      default: 8,
    },
    // 隔多久自动切换
    interval: {
      type: [String, Number],
      default: 3000,
    },
    // 指示器的模式，rect|dot|number|round
    mode: {
      type: String,
      default: 'round',
    },
    // list的高度，单位rpx
    height: {
      type: [Number, String],
      default: 250,
    },
    // 指示器的位置，topLeft|topCenter|topRight|bottomLeft|bottomCenter|bottomRight
    indicatorPos: {
      type: String,
      default: 'bottomCenter',
    },
    // 是否开启缩放效果
    effect3d: {
      type: Boolean,
      default: false,
    },
    // 3D模式的情况下，激活item与前后item之间的距离，单位rpx
    effect3dPreviousMargin: {
      type: [Number, String],
      default: 50,
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: true,
    },
    // 自动轮播时间间隔，单位ms
    duration: {
      type: [Number, String],
      default: 500,
    },
    // 是否衔接滑动，即到最后一张时接着滑动，是否自动切换到第一张
    circular: {
      type: Boolean,
      default: true,
    },
    // 图片的裁剪模式
    imgMode: {
      type: String,
      default: 'aspectFill',
    },
    // 从list数组中读取的图片的属性名
    name: {
      type: String,
      default: 'image',
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '#f3f4f6',
    },
  },
  watch: {
    // 如果外部的list发生变化，判断长度是否被修改，如果前后长度不一致，重置current值，避免溢出
    list(nVal, oVal) {
      if (nVal.length !== oVal.length) this.current = 0;
    },
  },
  data() {
    return {
      current: 0, // 当前活跃的swiper-item的index
    };
  },
  computed: {
    justifyContent() {
      if (this.indicatorPos == 'topLeft' || this.indicatorPos == 'bottomLeft')
        return 'flex-start';
      if (
        this.indicatorPos == 'topCenter' ||
        this.indicatorPos == 'bottomCenter'
      )
        return 'center';
      if (this.indicatorPos == 'topRight' || this.indicatorPos == 'bottomRight')
        return 'flex-end';
    },
    titlePaddingBottom() {
      let tmp = 0;
      if (this.mode == 'none') return '12rpx';
      if (
        ['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(
          this.indicatorPos
        ) >= 0 &&
        this.mode == 'number'
      ) {
        tmp = '60rpx';
      } else if (
        ['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(
          this.indicatorPos
        ) >= 0 &&
        this.mode != 'number'
      ) {
        tmp = '40rpx';
      } else {
        tmp = '12rpx';
      }
      return tmp;
    },
  },
  methods: {
    listClick(index) {
      this.$emit('click', index);
    },
    change(e) {
      let current = e.detail.current;
      this.current = current;
      // 发出change事件，表示当前自动切换的index，从0开始
      this.$emit('change', current);
    },
    // 头条小程序不支持animationfinish事件，改由change事件
    // 暂不监听此事件，因为不再给swiper绑定current属性
    animationfinish(e) {
      // #ifndef MP-TOUTIAO
      // this.current = e.detail.current;
      // #endif
    },
    handleNavTo(id) {
      this.navTo(`/pages/car/edit-form-chore?id=${id}`);
    },
    handleProcessed() {
      this.$emit('on-processed');
    },
  },
};
</script>

<style lang="scss" scoped>
.u-swiper-wrap {
  position: relative;
  // overflow: hidden;
  transform: translateY(0);
}

.u-swiper-image {
  width: 100%;
  will-change: transform;
  height: 100%;
  display: block;
  /* #ifdef H5 */
  pointer-events: none;
  /* #endif */
}

.u-swiper-indicator {
  padding: 0 24rpx;
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 1;
}

.u-indicator-item-rect {
  width: 26rpx;
  height: 8rpx;
  margin: 0 6rpx;
  transition: all 0.5s;
  background-color: rgba(0, 0, 0, 0.3);
}

.u-indicator-item-rect-active {
  background-color: rgba(255, 255, 255, 0.8);
}

.u-indicator-item-dot {
  width: 14rpx;
  height: 14rpx;
  margin: 0 6rpx;
  border-radius: 20rpx;
  transition: all 0.5s;
  background-color: rgba(0, 0, 0, 0.3);
}

.u-indicator-item-dot-active {
  background-color: rgba(255, 255, 255, 0.8);
}

.u-indicator-item-round {
  width: 14rpx;
  height: 8rpx;
  margin: 0 6rpx;
  // border-radius: 20rpx;
  transition: all 0.5s;
  background-color: #ccc;
}

.u-indicator-item-round-active {
  width: 34rpx;
  background-color: #5e93ec;
}

.u-indicator-item-number {
  padding: 6rpx 16rpx;
  line-height: 1;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.u-list-scale {
  transform-origin: center center;
}

.u-list-image-wrap {
  width: 670rpx;
  height: 336rpx;
  flex: 1;
  transition: all 0.5s;
  overflow: hidden;
  box-sizing: content-box;
  position: relative;

  .cover-wrap {
    position: absolute;
    top: 36rpx;
    left: 52rpx;
    right: 52rpx;
    bottom: 36rpx;
    color: #fff;

    .tag-default {
      width: 124rpx;
      height: 48rpx;
      background: #ffffff;
      border-radius: 4rpx;
      font-size: 24rpx;
      font-weight: bold;
      color: #5e93ec;
      opacity: 0.9;
      text-align: center;
      line-height: 48rpx;
    }

    .btn-plain {
      display: inline-block;
      width: 124rpx;
      border: 2rpx solid #ffffff;
      border-radius: 4rpx;
      padding: 6rpx;
      text-align: center;
      margin-left: 20rpx;
      color: #fff !important;
      font-size: 24rpx;
    }
    .cover-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 68rpx;
      .cover-header-l {
        .car-desc {
          font-size: 28rpx;
          font-weight: 400;
        }
        .car-num {
          font-size: 56rpx;
          font-weight: bold;
          margin-bottom: 12rpx;
        }
      }

      .cover-header-r {
        margin-top: 12rpx;
      }
    }

    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cover-footer-l {
        .prompt-label {
          font-weight: 400;
          font-size: 28rpx;
        }
        .prompt-value {
          font-weight: bold;
          font-size: 48rpx;
          margin-left: 10rpx;
        }
        .position {
          position: relative;
          left: 0;
          bottom: 8rpx;
          z-index: 10;
        }
      }
      .cover-footer-r {
        margin-top: 10rpx;
        image {
          width: 36rpx;
          height: 36rpx;
        }
      }
    }
  }
}

.u-swiper-title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 28rpx;
  padding: 12rpx 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.u-swiper-item {
  display: flex;
  overflow: hidden;
  align-items: center;
}
</style>
