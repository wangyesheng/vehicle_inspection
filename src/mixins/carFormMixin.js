export default {
  data() {
    return {
      keyboard: {
        carVisible: false,
        engineVisible: false,
        mobileVisible: false,
      },
    };
  },
  methods: {
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
    handleShowMobileKeyboard() {
      this.keyboard.mobileVisible = true;
    },
    handleMobileChange(value) {
      this.carForm.data.mobile += value;
    },
    handleMobileBackspace() {
      if (this.carForm.data.mobile.length) {
        this.carForm.data.mobile = this.carForm.data.mobile.substr(
          0,
          this.carForm.data.mobile.length - 1
        );
      }
    },
  },
};
