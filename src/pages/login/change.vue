<script setup lang="ts">
import phone from '@/static/icon/phone.png'
import email from '@/static/icon/email.png'
import { useLocale } from '@/hooks/useLocale'

const lang = ref(false)
const { t, handleLanguageChange } = useLocale()

const handleChange = () => {
  lang.value = !lang.value
  handleLanguageChange(lang.value ? 'en' : 'zh-Hans')
  navBar.value.title = t('login.login')
}

const navBar = ref({
  title: t('login.login'),
  backgroundColor: 'transparent',
  textColor: '#fff',
  isBack: true
})

onLoad(() => {})

onShow(() => {
  lang.value = uni.getLocale() === 'en'
})

const handleToChange = (str: string) => {
  const path = str === 'email' ? '/pages/login/recovery?type=email' : '/pages/login/recovery?type=phone'
  uni.navigateTo({
    url: path
  })
}
</script>

<template>
  <view class="login">
    <NavBar v-bind="navBar"></NavBar>
    <view class="lang">
      <view></view>
      <view class="flex align-center justify-center" @click="handleChange">
        {{ lang ? 'English' : '中文' }}
        <uni-icons type="bottom" color="#fff" size="16"></uni-icons>
      </view>
    </view>

    <view class="content">
      <view class="title">{{ $t('login.change1') }}</view>
      <view class="title">{{ $t('login.change2') }}</view>
      <view class="text">{{ $t('login.change3') }}</view>
    </view>

    <view class="box">
      <view class="top" @click="handleToChange('phone')">
        <view class="icon">
          <image class="img" :src="phone"></image>
        </view>
        <view>{{ $t('login.change4') }}</view>
      </view>
      <view class="bottom" @click="handleToChange('email')">
        <view class="icon">
          <image class="img" :src="email"></image>
        </view>
        <view>{{ $t('login.change5') }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: url('../../static/images/login-bg.png') no-repeat center;
  background-size: 100% 100%;
  position: relative;

  .lang {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 400;
    padding: 0 60rpx;
  }

  .content {
    margin: 10rpx 50rpx 80rpx;
    color: #fff;

    .title {
      font-size: 48rpx;
      font-style: normal;
      font-weight: 700;
    }

    .text {
      font-size: 28rpx;
      padding-top: 10rpx;
      font-weight: 400;
    }
  }

  .box {
    margin: 0 50rpx;
    .top,
    .bottom {
      background-color: #bda38c;
      height: 300rpx;
      border-radius: 10rpx;
      display: flex;
      // justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: 700;
      padding: 0 80rpx;
    }

    .top + .bottom {
      margin-top: 28rpx;
    }

    .icon {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background-color: #7c6b5d;
      margin-right: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .img {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
}
</style>
