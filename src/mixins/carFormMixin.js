export default {
  data() {
    return {
      keyboard: {
        carVisible: false,
        engineVisible: false,
      },
    };
  },
  methods: {
    handleBlur() {
      uni.hideKeyboard();
    },
    handleShowCarKeyboard() {
      this.keyboard.carVisible = true;
    },
    handleCarNumChange(value) {
      this.carForm.data.number += value;
    },
    handleCarNumBackspace() {
      if (this.carForm.data.number.length) {
        this.carForm.data.number = this.carForm.data.number.substr(
          0,
          this.carForm.data.number.length - 1
        );
      }
    },
    handleShowEngineKeyboard() {
      this.keyboard.engineVisible = true;
    },
    handleCloseEnginePopup() {
      this.keyboard.engineVisible = false;
    },
    handleEngineNumChange(value) {
      this.carForm.data.engine_number += value;
    },
    handleEngineNumBackspace() {
      if (this.carForm.data.engine_number.length) {
        this.carForm.data.engine_number = this.carForm.data.engine_number.substr(
          0,
          this.carForm.data.engine_number.length - 1
        );
      }
    },
  },
};
