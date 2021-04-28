<template>
  <view class="car-form-container">
    <view
      class="photo-wrap flex-center"
      v-if="driverLicenseSrc"
    >
      <view
        class="image-wrap"
        @click="handlePreview"
      >
        <image
          :src="driverLicenseSrc"
          mode="widthFit"
        />
        <view class="shadow">查看大图</view>
      </view>
      <view class="ext">
        <text @click="handleTakePhoto">重新拍摄</text>
        <text>识别信息有误可手动调整</text>
      </view>
    </view>
    <view
      v-else
      class="driver-license-wrap"
      @click="handleTakePhoto"
    />
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
            placeholder="请填写所有人"
            @blur="handleBlur"
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
            type="number"
            v-model="carForm.data.mobile"
            placeholder="请填写手机号"
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
            type="number"
            v-model="carForm.data.sms_vcode"
            placeholder="请填写验证码"
          />
        </u-form-item>
      </u-form>
    </view>
    <view class="btn-wrap">
      <u-button
        type="primary"
        shape="circle"
        :disabled="disabled"
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
import { editCarRes, getCarInfoRes } from '../../api';
import EOSABCKeyboard from '../../components/eos-abc-keyboard';
import carFormMixin from '../../mixins/carFormMixin';
import timingMixin from '../../mixins/timingMixin';
import { debounce } from '../../utils/tool';

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
          noCode: 0,
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
      driverLicenseSrc: '',
    };
  },

  computed: {
    disabled() {
      let flag = false;
      for (let key in this.carForm.data) {
        if (this.carForm.data[key] === '') {
          flag = true;
          break;
        }
      }
      return flag;
    },
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
    handleTakePhoto() {
      if (!this.checkLogin()) {
        uni.navigateTo({
          url: '/pages/auth/login-nav?from=2',
        });
        return;
      }
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        success: (res) => {
          uni.showLoading({
            title: '正在识别中...',
            mask: true,
          });
          const errFn = () =>
            uni.showToast({
              title: '行驶证识别失败~',
              icon: 'none',
            });
          const { path } = res.tempFiles[0];
          uni.compressImage({
            src: path,
            quality: 0.8,
            success: (compressRes) => {
              this.driverLicenseSrc = compressRes.tempFilePath;
              uni.uploadFile({
                url: `https://cj.huazhe.work/api.php?p=/code/uploadCarCard&key=${
                  this.getAppUser().token
                }`,
                name: 'cardFile',
                filePath: this.driverLicenseSrc,
                success: ({ statusCode, data }) => {
                  if (statusCode == 200) {
                    const response = JSON.parse(data);
                    if (response.code == 200) {
                      const info = response.data;
                      // 只做小型车的平台
                      if (info.lstypename.indexOf('小型') != -1) {
                        let type = '';
                        if (info.usetype == '非营运') {
                          type = '小型汽车(非营运)';
                          this.typeSelect.selectedType = 1;
                        } else {
                          type = '小型汽车(营运)';
                          this.typeSelect.selectedType = 2;
                        }
                        console.log(this.getAppUser());
                        this.carForm.data = {
                          ...this.carForm.data,
                          type,
                          owner: info.realname
                            ? info.realname
                            : this.getAppUser().member_name,
                          engine_number: info.engineno,
                          number: info.lsprefix + info.lsnum,
                          register_date: info.regdate.slice(0, 7),
                        };
                        this.disabled = false;
                      } else {
                        uni.showToast({
                          title: '行驶证识别失败~',
                          icon: 'none',
                        });
                      }
                    } else {
                      errFn();
                    }
                  } else {
                    errFn();
                  }
                  uni.hideLoading();
                },
                res: (err) => {
                  errFn();
                  uni.hideLoading();
                },
              });
            },
            fail: (err) => {
              errFn();
              uni.hideLoading();
            },
          });
        },
      });
    },
    handlePreview() {
      uni.previewImage({
        current: 0,
        urls: [this.driverLicenseSrc],
      });
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
      this.carForm.data.register_date = carInfo.register_date.slice(0, 7);
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
      this.dateSelect.defaultDate = [defaultDate[0], defaultDate[1]];
    },
    handleGetCode() {
      this.getCode(this.carForm.data.mobile);
    },
    handleSubmit: debounce(
      function () {
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
      3000,
      true
    ),
  },
};
</script>

<style lang="scss" scoped>
.car-form-container {
  height: 480rpx;
  background: url('https://cj.huazhe.work/images/shifting-code/bg.png');
  background-size: 100% 100%;
  padding: 50rpx 30rpx;

  & /deep/ .u-form-item {
    padding: 26rpx 38rpx;

    input {
      text-align: right;
    }
  }

  .driver-license-wrap {
    height: 300rpx;
    background: url('https://cj.huazhe.work/images/shifting-code/scan.png');
    background-size: 100% 100%;
  }

  .photo-wrap {
    height: 200rpx;
    background: #ffffff;
    box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.1);
    border-radius: 12rpx;
    padding-left: 32rpx;

    .image-wrap {
      width: 180rpx;
      height: 136rpx;
      border-radius: 5rpx;
      margin-right: 30rpx;
      position: relative;

      image {
        width: 100%;
        height: 100%;
      }
      .shadow {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        color: #fff;
        text-align: center;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 0 0 5rpx 5rpx;
      }
    }
    .ext {
      display: flex;
      flex-direction: column;
      text:first-child {
        font-size: 32rpx;
        font-weight: 500;
        color: #000000;
        margin-bottom: 20rpx;
      }
      text:last-child {
        font-size: 28rpx;
        font-weight: 400;
        color: #666;
      }
    }
  }

  .form-wrap {
    background: #ffffff;
    box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.1);
    border-radius: 12rpx;
    margin-top: 30rpx;
    margin-bottom: 80rpx;
  }

  .btn-wrap {
    padding-bottom: 80rpx;
  }
}
</style>