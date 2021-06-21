<template>
  <view
    class="customer-container"
    :style="{ minHeight: sysHeight + 'px' }"
  >
    <view
      class="unit-wrap"
      v-if="appUser.gid==='2'"
      @click="handleNavTo"
    >
      <view class="label">已发展协议单位</view>
      <view class="value">
        <text>{{companyLength}}家</text>
        <u-icon name="arrow-right" />
      </view>
    </view>
    <view
      class="content-wrap ployfill"
      v-if="customers.length"
      :style="{ minHeight: sysHeight - 40 + 'px' }"
    >
      <view
        class="record-wrap"
        v-for="(item,index) in customers"
        :key="index"
      >
        <view class="user-header">
          <image
            :src="item.headpic?item.headpic:'https://cj.huazhe.work/images/me/male.png'"
            mode="widthFit"
          />
          <text class="name">{{item.username}}</text>
        </view>
        <view v-if="item.clist.length>0">
          <view
            class="car-wrap"
            v-for="carItem in item.clist"
            :key="carItem.id"
          >
            <text class="car-num">{{carItem.number}}</text>
            <text class="car-status red">{{carItem.status_desc}}</text>
            <text class="car-prompt">{{carItem.prompt }}</text>
            <text class="red">{{carItem.days}}</text>
            <text>天</text>
            <view
              class="call"
              v-if="carItem.status==1 && carItem.is_pass==0 && carItem.days<=30 "
              @click="handleCall(carItem.member_id, carItem.mobile)"
            >
              <image
                src="../../static/images/phone.png"
                mode="widthFit"
              />
            </view>
          </view>
        </view>
        <view
          class="car-wrap"
          v-else
        >
          <text>暂未绑定车辆~</text>
        </view>

      </view>
    </view>
    <view
      class="no-data-wrap ployfill"
      :style="{ minHeight: sysHeight - 40 + 'px' }"
      v-else
    >
      <view>
        <image
          src="https://cj.huazhe.work/images/inspection/no_appointment.png"
          mode="widthFit"
        />
        <view>暂无邀请的好友~</view>
        <view class="btn-wrap_wechat">
          <button
            open-type="share"
            @click="handleShare"
          />
        </view>
        <view class="btn-wrap_timeline">
          <button @click="handleShareToTimeline" />
        </view>
      </view>
    </view>
    <view
      class="footer-wrap"
      v-if="customers.length"
    >
      <view class="btn-wrap_wechat">
        <button
          open-type="share"
          @click="handleShare"
        />
      </view>
      <view class="btn-wrap_timeline">
        <button @click="handleShareToTimeline" />
      </view>
    </view>

    <canvas
      :style="{width:posterWidth, height:posterHeight, position:'fixed', left:'9999px', top:'0'}"
      canvas-id="posterCanvas"
      id="posterCanvas"
      class="canvas"
    ></canvas>
    <!-- 遮罩层 -->
    <view
      class="mask"
      v-if="showMask"
      @click="showMask=false"
    >
      <!-- 生成的海报图 -->
      <image
        :style="{width:posterWidth,height:posterHeight}"
        :src="lastPoster"
        mode="aspectFill"
      ></image>
      <u-button
        type="warning"
        shape="circle"
        @click="saveToAlbum"
      >
        保存至相册
      </u-button>
    </view>
  </view>
</template>

<script>
import {
  getMyCustomersRes,
  getMyCompaniesRes,
  callVirtualMobileRes,
} from '../../api';

import {
  loadImage,
  createPoster,
  canvasToTempFilePath,
  saveImageToPhotosAlbum,
} from '../../utils/poster';

function savePathToLocal(buffer, ext) {
  const fs = uni.getFileSystemManager();
  return new Promise((resolve, reject) => {
    const filePath = `${wx.env.USER_DATA_PATH}/temp_qrcode.${ext}`;
    fs.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error('ERROR_PATH_SAVE'));
      },
    });
  });
}

export default {
  data() {
    return {
      sysHeight: 0,
      customers: [],
      appUser: this.getAppUser(),
      companyLength: 0,

      // 海报图和canvas的宽高
      posterWidth: '750rpx',
      posterHeight: '1017rpx',
      ready: false,
      showMask: false,
      imageUrl: `https://cj.huazhe.work/images/code.png?timespan=${new Date().getTime()}`,
      // 存本地缓存图片
      bgImage: '',
      // 最后生成的海报缓存图片
      lastPoster: '',
    };
  },

  mounted() {
    this.sysHeight = this.getSysHeight();
    this.pageIndex = 1;
    this.total = 0;
    this.getMyCustomers(this.pageIndex++);
    if (this.appUser.gid === '2') {
      this.getMyCompanies();
    }
  },

  onReachBottom() {
    if (this.rowtotal != this.total) {
      this.getMyCustomers(this.pageIndex++);
    }
  },

  methods: {
    async handleCall(to_id, mobile) {
      const {
        code,
        data: { xMobile },
      } = await callVirtualMobileRes({
        to_id,
        mobile,
      });
      if (code == 200) {
        uni.makePhoneCall({
          phoneNumber: xMobile,
          success: () => {},
        });
      }
    },
    async getMyCustomers(pageIndex) {
      const {
        data: { offlineList },
        rowtotal,
      } = await getMyCustomersRes({ page: pageIndex });
      this.rowtotal = rowtotal;
      this.total += offlineList.length;
      const _customers = offlineList
        .filter((x) => x.usermobile !== '')
        .map((y) => {
          y.clist.forEach((z) => {
            switch (z.status) {
              // 未到期，不可预约
              case 0:
                z.prompt = '距上线年检还剩';
                break;
              // 已预约
              case 1:
                if (z.is_pass == 0) {
                  // 未逾期
                  z.prompt = '距年检逾期还剩';
                } else {
                  z.prompt = '年检已逾期';
                }
                break;
              // 已办理
              case 2:
                z.prompt = '距上线年检还剩';
                break;
              // 可预约
              case 3:
                z.prompt = '距年检逾期还剩';
                break;
              // 已逾期
              case 4:
                z.prompt = '年检已逾期';
                break;
            }
          });
          return y;
        });
      this.customers =
        this.pageIndex == 1 ? _customers : [...this.customers, ..._customers];
    },
    async getMyCompanies() {
      const {
        data: { myCompanyList },
      } = await getMyCompaniesRes();
      this.companyLength = myCompanyList ? myCompanyList.length : 0;
    },
    handleNavTo() {
      this.navTo('/pages/me/company');
    },
    handleShare() {
      const path = `/pages/home/index?sharerId=${this.appUser.member_id}`;
      return {
        path,
        title: '汽车年审，还可以更快更简单',
        imageUrl: 'https://fanr.oss-cn-shanghai.aliyuncs.com/data/11.png',
      };
    },
    handleShareToTimeline() {
      const appUser = this.getAppUser();
      if (appUser.member_mobile) {
        uni.showLoading({
          title: '海报生成中...',
        });
        wx.cloud.init();
        wx.cloud.callFunction({
          name: 'getQRCode',
          data: {
            sharerId: appUser.member_id,
          },
          complete: async ({ result }) => {
            const ext = result.contentType.split('/')[1];
            try {
              const qrcode = await savePathToLocal(result.buffer, ext);
              const state = await this.loadingResources(this.imageUrl);
              if (qrcode && state) {
                this.ready = true;
                this.createImage(qrcode);
              }
            } catch (error) {
              uni.showToast({
                title: '海报生成失败~',
                icon: 'none',
              });
            }
          },
          fail: (err) => {
            uni.showToast({
              title: '云函数调用失败~',
              icon: 'none',
            });
          },
        });
      }
    },
    // 加载图片资源
    async loadingResources(imgurl) {
      this.bgImage = await loadImage(imgurl);
      return true;
    },
    // 保存至相册
    async saveToAlbum() {
      try {
        await saveImageToPhotosAlbum(this.lastPoster);
        uni.showToast({
          title: '保存成功，快去朋友圈分享吧！',
          icon: 'none',
        });
        setTimeout(() => {
          this.showMask = false;
        }, 3000);
      } catch (error) {
        uni.showToast({
          title: '保存失败！',
          icon: 'none',
        });
      }
    },
    // 生成海报
    async createImage(qrcode) {
      if (!this.ready) return;
      // 获取上下文对象
      const ctx = uni.createCanvasContext('posterCanvas');
      // 创建海报
      // 图片需设置x,y,width,height
      // 文字需要设置 text, x,y
      await createPoster(ctx, [
        {
          type: 'image',
          url: this.bgImage,
          config: {
            x: 0,
            y: 0,
            w: 375,
            h: 508,
          },
        },
        {
          type: 'image',
          url: qrcode,
          config: {
            x: 140,
            y: 240,
            w: 100,
            h: 100,
          },
        },
      ]);
      try {
        const imagePath = await canvasToTempFilePath('posterCanvas', this);
        this.lastPoster = imagePath;
        uni.hideLoading();
        this.showMask = true;
      } catch (error) {
        uni.showToast({
          title: '海报生成失败~',
          icon: 'none',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-container {
  background: #5e93ec;
  padding: 30rpx;
  position: relative;
  z-index: 1;

  .container {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .canvas {
    border: 1px solid;
  }
  .image {
    width: 550rpx;
    height: 980rpx;
  }
  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: rgba($color: #000000, $alpha: 0.4);
    left: 0;
    top: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .ployfill {
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(94, 148, 236, 0.2);
    border-radius: 8rpx;
    padding-bottom: 90rpx;
  }
  .content-wrap {
    .record-wrap {
      position: relative;
      padding: 35rpx 30rpx;
      .call {
        position: absolute;
        top: 38rpx;
        right: 60rpx;
        image {
          width: 42rpx;
          height: 42rpx;
        }
      }
      &:not(:last-child) {
        border-bottom: 1rpx solid #f2f2f2;
      }
      .user-header {
        display: flex;
        height: 60rpx;
        line-height: 60rpx;
        margin-bottom: 10rpx;

        image {
          width: 56rpx;
          height: 56rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        .name {
          font-size: 28rpx;
          font-weight: 500;
          color: #343434;
          margin-bottom: 25rpx;
        }
      }

      .car-wrap {
        font-size: 26rpx;
        font-weight: 400;
        color: rgba(120, 120, 120, 0.8);
        margin-bottom: 5rpx;

        .car-num {
          color: #343434;
          margin-right: 10rpx;
        }

        .car-status {
          margin-right: 10rpx;
        }

        .red {
          color: #ff0000;
        }
      }
    }
  }

  .footer-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    height: 120rpx;
    background: #fff;
    padding: 15rpx 30rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  }

  .btn-wrap_wechat {
    button {
      width: 330rpx;
      height: 90rpx;
      background-image: url('https://cj.huazhe.work/images/me/wechat.png');
      background-size: 100% 100%;
      border-radius: 45rpx;
    }
    button::after {
      border-color: transparent;
    }
  }

  .btn-wrap_wechat_large {
    button {
      width: 690rpx;
      height: 90rpx;
      background-image: url('https://cj.huazhe.work/images/me/wechat_large.png');
      background-size: 100% 100%;
      border-radius: 45rpx;
    }
    button::after {
      border-color: transparent;
    }
  }

  .btn-wrap_timeline {
    button {
      width: 330rpx;
      height: 90rpx;
      background-image: url('https://cj.huazhe.work/images/me/timeline.png');
      background-size: 100% 100%;
      border-radius: 45rpx;
    }
    button::after {
      border-color: transparent;
    }
  }

  .full {
    width: 100%;
  }

  .unit-wrap {
    height: 100rpx;
    background: #fff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(94, 148, 236, 0.2);
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    padding: 32rpx 35rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      font-size: 32rpx;
      font-weight: bold;
      color: #000000;
    }
    .value {
      font-size: 28rpx;
      font-weight: 400;
      color: #9a9a9a;

      & /deep/ .u-icon {
        position: relative;
        left: 0;
        bottom: 2rpx;
      }
    }
  }
  .no-data-wrap {
    padding: 20rpx 0 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 199rpx;
      height: 155rpx;
    }
    view {
      font-size: 28rpx;
      font-weight: 500;
      color: #9a9a9a;
      margin-top: 30rpx;
      text-align: center;
    }
  }

  .code-banner-wrap {
    image {
      width: 750rpx;
      height: 1017rpx;
    }
  }
}
</style>