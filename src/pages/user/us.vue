<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
const { t } = useLocale()
import { wrapperEnv } from '@/utils/env'
import { useDownLoad } from '@/hooks/useDownLoad'
const { downloadFileUrl } = useDownLoad()
const { VITE_APP_CONTACT_URL } = wrapperEnv

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})

const handleDownImg = () => {
  downloadFileUrl(VITE_APP_CONTACT_URL)
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="about">
      <view class="title">{{ $t('about.about10') }}</view>
      <view class="top-img">
        <image class="img" src="../../static/images/us-logo.png"></image>
      </view>
      <view class="info">
        <view class="name">{{ $t('about.about11') }}</view>
        <view class="text">Operations@infinityalpha.com.au</view>
        <view class="name">{{ $t('about.about12') }}</view>
        <view class="text">+1800 686 886</view>
        <view class="name">{{ $t('about.about13') }}</view>
        <view class="text">example, North Sydney, NSW 2060 </view>
        <view class="contact" @click="handleDownImg">
          <image class="code" :src="VITE_APP_CONTACT_URL" mode="widthFix"></image>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.about {
  padding: 0 40rpx 40rpx;
  .title {
    color: #333;
    font-size: 44rpx;
    font-style: normal;
    font-weight: 700;
    padding-bottom: 30rpx;
  }

  .top-img {
    width: 156rpx;
    height: 180rpx;
    margin-top: 20rpx;
    margin-left: 20rpx;

    .img {
      width: 156rpx;
      height: 180rpx;
      display: block;
    }
  }

  .info {
    padding: 30rpx 20rpx;

    .name {
      color: #333;
      font-size: 32rpx;
      font-style: normal;
      font-weight: 600;
    }

    .text {
      color: #828282;
      font-size: 28rpx;
      font-style: normal;
      font-weight: 400;
      padding: 10rpx 0;
    }

    .code {
      // width: 320rpx;
      // height: 320rpx;
      display: block;
    }
  }
}
</style>
