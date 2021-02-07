<style lang="scss" scoped>
.add-car-wrap {
  & /deep/ .u-form-item {
    padding: 26rpx 38rpx;

    input {
      text-align: right;
    }
  }
  .driver-license-wrap {
    height: 320rpx;
    .take-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .camera {
        border-radius: 50%;
        background-color: #333;
        width: 80rpx;
        height: 80rpx;
      }
    }
    .photo-wrap {
      display: flex;
      align-items: center;
    }
  }
  .btn-wrap {
    padding: 30rpx;
  }
}
</style>

<template>
  <view class="add-car-wrap">
    <view class="driver-license-wrap">
      <view
        v-if="driverLicenseSrc"
        class="photo-wrap"
      >
        <image
          :src="driverLicenseSrc"
          mode="widthFit"
        />
        <view>
          <text>重新拍摄</text>
          <text>识别信息有误可手动调整</text>
        </view>
      </view>
      <view
        class="take-wrap"
        v-else
      >
        <view
          class="camera"
          @click="handleTakePhoto"
        />
        <view>扫描行驶证自动识别车辆信息</view>
      </view>
    </view>
    <view class="form-wrap">
      <u-form
        ref="carForm"
        label-width="auto"
        label-align="center"
        :model="carForm.data"
        :label-style="{
            color: '#000',
            fontSize: '28rpx',
            fontWeight: 600,
        }"
      >
        <u-form-item
          label="车牌号码"
          prop="number"
        >
          <u-input
            disabled
            placeholder="请填写车牌号码"
            v-model="carForm.data.number"
            @click="handleShowCarKeyboard"
          />
        </u-form-item>

        <u-form-item
          label="发动机号"
          prop="engine_number"
        >
          <u-input
            disabled
            placeholder="请填写发动机号"
            v-model="carForm.data.engine_number"
            @click="handleShowEngineKeyboard"
          />
        </u-form-item>
        <u-form-item
          label="注册日期"
          prop="register_date"
        >
          <u-input
            type="select"
            placeholder="请选择注册日期"
            v-model="carForm.data.register_date"
            @click="handleShowDateSelect"
          />
        </u-form-item>
        <u-form-item
          label="所有人"
          prop="owner"
        >
          <u-input
            v-model="carForm.data.owner"
            placeholder="请填写所有人"
            @blur="handleBlur"
          />
        </u-form-item>
      </u-form>
    </view>
    <view class="btn-wrap">
      <u-button type="primary">保存</u-button>
    </view>
    <u-select
      mode="mutil-column"
      v-model="dateSelect.visible"
      :default-value="dateSelect.defaultDate"
      :list="dateSelect.dateSource"
      @confirm="handledDateConfirm"
    />
    <u-keyboard
      ref="carNumKeyboard"
      mode="car"
      :mask="false"
      :tooltip="false"
      :safe-area-inset-bottom="true"
      v-model="keyboard.carVisible"
      @change="handleCarNumChange"
      @backspace="handleCarNumBackspace"
    />
    <u-popup
      mode="bottom"
      :mask="false"
      v-model="keyboard.engineVisible"
    >
      <eos-abc-keyboard
        ref="abcKeyboard"
        @change="handleEngineNumChange"
        @backspace="handleEngineNumBackspace"
        @close="handleCloseEnginePopup"
      />
    </u-popup>
  </view>
</template>

<script>
import { getDateInterval } from '../../utils/time';
import EOSABCKeyboard from '../../components/eos-abc-keyboard';
import carFormMixin from '../../mixins/carFormMixin';

const { years, months, defaultDate } = getDateInterval();

export default {
  components: {
    'eos-abc-keyboard': EOSABCKeyboard,
  },

  mixins: [carFormMixin],

  data() {
    return {
      carForm: {
        data: {
          number: '',
          engine_number: '',
          owner: '',
          register_date: '',
        },
        rules: {
          number: [
            {
              required: true,
              message: '请填写车牌号码',
              trigger: 'change',
            },
          ],
          engine_number: [
            {
              required: true,
              message: '请填写发动机号',
              trigger: 'change',
            },
          ],
          owner: [
            {
              required: true,
              message: '请填写所有人',
              trigger: 'change',
            },
          ],
          register_date: [
            {
              required: true,
              message: '请选择注册日期',
              trigger: 'change',
            },
          ],
        },
      },
      dateSelect: {
        visible: false,
        dateSource: [years, months],
        defaultDate,
      },
      driverLicenseSrc: '',
    };
  },

  onReady() {
    this.$refs.carForm.setRules(this.carForm.rules);
  },

  methods: {
    handleShowDateSelect() {
      this.dateSelect.visible = true;
    },
    handledDateConfirm(e) {
      this.carForm.data.register_date = `${e[0].label}-${e[1].label}`;
    },
    handleTakePhoto() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        success: ({ tempFilePaths }) => {
          this.driverLicenseSrc = tempFilePaths[0];
        },
      });
    },
  },
};
</script>