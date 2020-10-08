<template>
  <view class="car-add-form-container">
    <u-form ref="carForm" label-width="auto" label-align="center" :model="carForm.data" :label-style="{
        color: '#000',
        fontSize: '28rpx',
        fontWeight: 600,
      }">
      <u-form-item label="车牌号码" prop="number">
        <u-input v-model="carForm.data.number" placeholder="请填写车牌号码" />
      </u-form-item>
      <u-form-item label="号牌种类" prop="type">
        <u-input type="select" placeholder="请选择号牌种类" v-model="carForm.data.type" @click="handleShowTypeSelect" />
      </u-form-item>
      <u-form-item label="发动机号" prop="engine_number">
        <u-input v-model="carForm.data.engine_number" placeholder="请填写发动机号" />
      </u-form-item>
      <u-form-item label="所有人" prop="owner">
        <u-input v-model="carForm.data.owner" placeholder="请填写所有人" />
      </u-form-item>
      <u-form-item label="注册登记日期" prop="register_date">
        <u-input type="select" placeholder="请选择注册登记日期" v-model="carForm.data.register_date" @click="handleShowDateSelect" />
      </u-form-item>
      <u-form-item label="手机号" prop="mobile">
        <u-input v-model="carForm.data.mobile" placeholder="请填写手机号" />
      </u-form-item>
      <u-form-item label="验证码" prop="sms_vcode">
        <u-button slot="left" size="medium" :custom-style="{padding:'18rpx 20rpx'}" @click="handleGetCode">
          <text v-if="loading">{{ codeText }}</text>
          <text v-else>获取验证码</text>
        </u-button>
        <u-input v-model="carForm.data.sms_vcode" placeholder="请填写验证码" />
      </u-form-item>
    </u-form>
    <view class="btn-wrap">
      <u-button type="primary" @click="handleSubmit">提交</u-button>
    </view>
    <u-select v-model="typeSelect.visible" :list="typeSelect.types" @confirm="handleTypeConfirm"></u-select>
    <u-select mode="mutil-column" v-model="dateSelect.visible" :default-value="dateSelect.defaultDate" :list="dateSelect.dateSource" @confirm="handledDateConfirm"></u-select>
  </view>
</template>

<script>
import { getDateInterval, getMaxDay } from "../../utils/time";
import { addCarRes, getVerificationCodeRes } from "../../api";

const { years, months, days, defaultDate } = getDateInterval();
export default {
  data() {
    return {
      carForm: {
        data: {
          number: "",
          type: "",
          engine_number: "",
          owner: "",
          register_date: "",
          mobile: "",
          sms_vcode: ""
        },
        rules: {
          number: [
            {
              required: true,
              message: "请填写车牌号码",
              trigger: "blur"
            }
          ],
          type: [
            {
              required: true,
              message: "请选择号牌种类",
              trigger: "blur"
            }
          ],
          engine_number: [
            {
              required: true,
              message: "请填写发动机号",
              trigger: "blur"
            }
          ],
          owner: [
            {
              required: true,
              message: "请填写所有人",
              trigger: "blur"
            }
          ],
          register_date: [
            {
              required: true,
              message: "请选择注册登记日期",
              trigger: "blur"
            }
          ],
          mobile: [
            {
              required: true,
              message: "请填写手机号",
              trigger: "blur"
            },
            {
              pattern: /^1[3456789]\d{9}$/,
              message: "手机号格式错误",
              trigger: "blur"
            }
          ],
          sms_vcode: [
            {
              required: true,
              message: "请填写验证码",
              trigger: "blur"
            }
          ]
        }
      },
      typeSelect: {
        visible: false,
        types: [
          {
            value: 1,
            label: "小型汽车(非营运)"
          },
          {
            value: 2,
            label: "小型汽车(营运)"
          }
        ],
        selectedType: 1
      },
      dateSelect: {
        visible: false,
        dateSource: [years, months, days],
        defaultDate
      },
      codeText: "60秒后重发",
      loading: false,
      carId: null
    };
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
      this.carForm.data.register_date = `${e[0].label}-${e[1].label}-${
        e[2].label
      }`;
    },
    async handleGetCode() {
      if (this.carForm.data.mobile.length === 11) {
        if (this.loading) return;
        this.loading = true;
        const { code, data } = await getVerificationCodeRes({
          mobile: this.carForm.data.mobile
        });
        if (code === 200) {
          this.timing();
        } else {
          uni.showToast({
            icon: "none",
            title: data
          });
          this.loading = false;
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "请填写正确的手机号码"
        });
      }
    },
    handleSubmit() {
      this.$refs.carForm.validate(async valid => {
        if (valid) {
          const reqData = {
            ...this.carForm.data,
            type: this.typeSelect.selectedType
          };
          const { code, data } = await addCarRes(reqData);
          if (code === 200) {
            uni.switchTab({
              url: "/pages/home/index"
            });
          } else {
            uni.showToast({
              icon: "none",
              title: data
            });
          }
        }
      });
    },
    timing(second = 60) {
      setTimeout(() => {
        second--;
        if (second == 0) {
          this.codeText = `60秒后重发`;
          this.loading = false;
        } else {
          this.codeText = `${second}秒后重发`;
          this.timing(second);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.car-add-form-container {
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