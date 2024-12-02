<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
const { t } = useLocale()
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="about">
      <view class="title">{{ $t('about.about1') }}</view>
      <view class="img-box p-b-30">
        <image class="img" src="../../static/images/about-img1.png"></image>
      </view>
      <view class="title2 p-b-20">{{ $t('about.about2') }}</view>
      <view class="text p-b-30">
        <view>
          {{ $t('about.about3') }}
        </view>
        <view>
          {{ $t('about.about4') }}
        </view>
      </view>
      <view class="img-box p-b-30">
        <image class="img" src="../../static/images/about-img2.png"></image>
      </view>
      <view class="title2 p-b-10">{{ $t('about.about5') }}</view>
      <view class="sub-title p-b-10">{{ $t('about.about6') }}</view>
      <view class="text p-b-20">
        {{ $t('about.about7') }}
      </view>
      <view class="sub-title p-b-10">{{ $t('about.about8') }}</view>
      <view class="text">
        {{ $t('about.about9') }}
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

  .p-b-30 {
    padding-bottom: 30rpx;
  }

  .p-b-20 {
    padding-bottom: 20rpx;
  }

  .p-b-10 {
    padding-bottom: 10rpx;
  }

  .img-box {
    .img {
      width: 100%;
      height: 224rpx;
      display: block;
    }
  }

  .title2 {
    color: #be9670;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 700;
  }

  .text {
    color: #828282;
    font-size: 28rpx;
    font-style: normal;
    font-weight: 400;
  }

  .sub-title {
    color: #4f4f4f;
    font-size: 30rpx;
    font-style: normal;
    font-weight: 500;
  }
}
</style>
