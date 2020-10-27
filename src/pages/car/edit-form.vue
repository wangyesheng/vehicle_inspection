<template>
  <view class="car-form-container">
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
        label="号牌种类"
        prop="type"
      >
        <u-input
          type="select"
          placeholder="请选择号牌种类"
          v-model="carForm.data.type"
          @click="handleShowTypeSelect"
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
        label="所有人"
        prop="owner"
      >
        <u-input
          v-model="carForm.data.owner"
          placeholder="请填写所有人姓名或公司名称"
        />
      </u-form-item>
      <u-form-item
        label="注册登记日期"
        prop="register_date"
      >
        <u-input
          type="select"
          placeholder="请选择注册登记日期"
          v-model="carForm.data.register_date"
          @click="handleShowDateSelect"
        />
      </u-form-item>
      <u-form-item
        label="手机号"
        prop="mobile"
      >
        <u-input
          disabled
          v-model="carForm.data.mobile"
          placeholder="请填写手机号"
          @click="handleShowMobileKeyboard"
        />
      </u-form-item>
      <u-form-item
        label="验证码"
        prop="sms_vcode"
      >
        <u-button
          slot="left"
          size="medium"
          :custom-style="{padding:'18rpx 20rpx'}"
          @click="handleGetCode"
        >
          <text v-if="loading">{{ codeText }}</text>
          <text v-else>获取验证码</text>
        </u-button>
        <u-input
          v-model="carForm.data.sms_vcode"
          placeholder="请填写验证码"
        />
      </u-form-item>
    </u-form>
    <view class="btn-wrap">
      <u-button
        type="primary"
        @click="handleSubmit"
      >提交</u-button>
    </view>
    <u-select
      v-model="typeSelect.visible"
      :list="typeSelect.types"
      :default-value="typeSelect.defaultSelectTypes"
      @confirm="handleTypeConfirm"
    />
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
      :tooltip="false"
      :safe-area-inset-bottom="true"
      v-model="keyboard.carVisible"
      @change="handleCarNumChange"
      @backspace="handleCarNumBackspace"
    />
    <u-keyboard
      ref="numKeyboard"
      :tooltip="false"
      :safe-area-inset-bottom="true"
      v-model="keyboard.mobileVisible"
      @change="handleMobileChange"
      @backspace="handleMobileBackspace"
    />
    <u-popup
      mode="bottom"
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
import { getDateInterval, getMaxDay } from '../../utils/time';
import { editCarRes, getCarInfoRes } from '../../api';
import EOSABCKeyboard from '../../components/eos-abc-keyboard';
import carFormMixin from '../../mixins/carFormMixin';
import timingMixin from '../../mixins/timingMixin';

const { years, months, defaultDate } = getDateInterval();

export default {
  components: {
    'eos-abc-keyboard': EOSABCKeyboard,
  },

  data() {
    return {
      carForm: {
        data: {
          number: '',
          type: '',
          engine_number: '',
          owner: '',
          register_date: '',
          mobile: '',
          sms_vcode: '',
        },
        rules: {
          number: [
            {
              required: true,
              message: '请填写车牌号码',
              trigger: 'change',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择号牌种类',
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
              message: '请选择注册登记日期',
              trigger: 'change',
            },
          ],
          mobile: [
            {
              required: true,
              message: '请填写手机号',
              trigger: 'change',
            },
            {
              pattern: /^1[3456789]\d{9}$/,
              message: '手机号格式错误',
              trigger: 'change',
            },
          ],
          sms_vcode: [
            {
              required: true,
              message: '请填写验证码',
              trigger: 'change',
            },
          ],
        },
      },
      typeSelect: {
        visible: false,
        types: [
          {
            value: 1,
            label: '小型汽车(非营运)',
          },
          {
            value: 2,
            label: '小型汽车(营运)',
          },
        ],
        selectedType: 1,
        defaultSelectTypes: [0],
      },
      dateSelect: {
        visible: false,
        dateSource: [years, months],
        defaultDate,
      },
    };
  },

  mixins: [carFormMixin, timingMixin],

  onLoad(ops) {
    this.carId = ops.id;
    this.getCarInfo();
  },

  onReady() {
    this.$refs.carForm.setRules(this.carForm.rules);
  },

  methods: {
    handleShowTypeSelect() {
      this.typeSelect.visible = true;
    },
    handleTypeConfirm(e) {
      this.carForm.data.type = e[0].label;
      this.typeSelect.selectedType = e[0].value;
    },
    handleShowDateSelect() {
      this.dateSelect.visible = true;
    },
    handledDateConfirm(e) {
      this.carForm.data.register_date = `${e[0].label}-${e[1].label}`;
    },
    async getCarInfo() {
      const {
        data: { carInfo },
      } = await getCarInfoRes({ car_id: this.carId });
      this.carForm.data.number = carInfo.number;
      this.carForm.data.type =
        carInfo.type === '1' ? '小型汽车(非营运)' : '小型汽车(营运)';
      this.typeSelect.selectedType = +carInfo.type;
      this.typeSelect.defaultSelectTypes = [+carInfo.type - 1];
      this.carForm.data.engine_number = carInfo.engine_number;
      this.carForm.data.owner = carInfo.owner;
      this.carForm.data.register_date = carInfo.register_date;
      this.carForm.data.mobile = carInfo.mobile;
      const dates = this.carForm.data.register_date.split('-').slice(0, 2);
      const _dates = [];
      dates.forEach((d) => {
        if (d.startsWith('0')) {
          d = d.charAt(d.length - 1);
        }
        _dates.push(+d);
      });
      const { defaultDate } = getDateInterval(_dates[0], _dates[1]);
      this.dateSelect.defaultDate = defaultDate;
    },
    handleGetCode() {
      this.getCode(this.carForm.data.mobile);
    },
    handleSubmit() {
      this.$refs.carForm.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.carForm.data,
            type: this.typeSelect.selectedType,
            id: this.carId,
          };
          const { code, data } = await editCarRes(reqData);
          if (code === 200) {
            uni.switchTab({
              url: '/pages/home/index',
            });
          } else {
            uni.showToast({
              icon: 'none',
              title: data,
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.car-form-container {
  & /deep/ .u-form-item {
    padding: 26rpx 38rpx;

    input {
      text-align: right;
    }
  }

  .btn-wrap {
    padding: 80rpx 30rpx;
  }
}
</style>