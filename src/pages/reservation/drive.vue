<template>
  <view class="drive-wrap"></view>
</template>

<script>
import { getCarAgencies } from '../../api';
export default {
  data() {
    return {};
  },

  async onLoad() {
    const data = await getCarAgencies();
    console.log(data);
  },
};
</script>

<style lang="scss" scoped>
</style>