<script setup lang="ts">
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff'
})

const showMore = ref(false)

const handleShowMore = () => {
  showMore.value = !showMore.value
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar">
      <template #content>
        <view class="bar-title act">{{ $t('club.title') }}</view>
      </template>
    </NavBar>
    <view class="club">
      <view class="img-box p-b-40">
        <image class="img" src="../../static/images/club-img1.png"></image>
      </view>
      <view :class="showMore ? 'text m-b-40' : 'text hide-text m-b-40'">
        <view :class="showMore ? '' : 'content'">
          <text class="sub">{{ $t('club.title2') }}</text> {{ $t('club.text') }}
          <text class="text-be9670" @click="handleShowMore" v-if="showMore">{{ `${$t('club.text8')}<<` }}</text>
        </view>
        <view class="more" v-if="!showMore">
          <text>...</text><text class="more-text" @click="handleShowMore">{{ $t('club.text7') }}>></text>
        </view>
      </view>
      <view class="title2 p-b-20"> {{ $t('club.member') }} </view>
      <view class="text2">
        <view class="left">·</view>
        <view class="right">
          {{ $t('club.text2') }}
        </view>
      </view>
      <view class="text2">
        <view class="left">·</view>
        <view class="right">{{ $t('club.text3') }}</view>
      </view>
      <view class="text2">
        <view class="left">·</view>
        <view class="right">{{ $t('club.text4') }}</view>
      </view>
      <view class="text2">
        <view class="left">·</view>
        <view class="right">{{ $t('club.text5') }}</view>
      </view>
      <view class="text2">
        <view class="left">·</view>
        <view class="right">{{ $t('club.text6') }}</view>
      </view>
      <!-- <view class="text2">
        <view class="left">·</view>
        <view class="right">{{ $t('club.text7') }}</view>
      </view>
      <view class="text2">
        <view class="left">·</view>
        <view class="right">
          {{ $t('club.text8') }}
        </view>
      </view>
      <view class="text2">
        <view class="left">·</view>
        <view class="right">
          {{ $t('club.text9') }}
        </view>
      </view> -->
    </view>
    <TabBar></TabBar>
  </view>
</template>
<style lang="scss" scoped>
.club {
  padding: 0 40rpx 40rpx;

  .m-b-40 {
    margin-bottom: 40rpx;
  }
  .p-b-40 {
    padding-bottom: 40rpx;
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

  .text {
    color: #4f4f4f;
    font-size: 28rpx;
    font-style: normal;
    font-weight: 400;
    position: relative;

    .sub {
      color: #be9670;
    }

    .content {
      overflow: hidden;
      text-overflow: ellipsis; /*超出则...代替*/
      display: -webkit-box;
      -webkit-line-clamp: 5; /* 行数*/
      line-clamp: 5; /*行数*/
      -webkit-box-orient: vertical;
    }

    .more {
      background: #fff;
      position: absolute;
      right: 0;
      bottom: 0;
      .more-text {
        padding-left: 20rpx;
        color: #be9670;
      }
    }
  }

  .title2 {
    color: #be9670;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 600;
  }

  .text2 {
    color: #be9670;
    font-size: 28rpx;
    font-style: normal;
    font-weight: 400;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .left {
      width: 30rpx;
      // font-weight: bold;
    }

    .right {
      width: calc(100% - 30rpx);
    }
  }
}
</style>
