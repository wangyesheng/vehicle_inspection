<template>
  <view></view>
</template>

<script>
import { getIsCheckRes } from "../../api";

export default {
  onLoad() {
    this.getIsCheck();
  },

  methods: {
    async getIsCheck() {
      const data = await getIsCheckRes();
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>