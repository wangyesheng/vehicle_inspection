<script>
export default {
  onLaunch: function () {
    console.log('App Launch');
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary-color {
  color: $u-type-primary;
}

.btn-text {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  outline: none;
  margin: 0;
  padding: 20rpx;
  font-size: 32rpx;
  color: #fff;
  background: transparent;
  font-weight: bold;
}


</style>
