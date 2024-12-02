<script setup lang="ts">
const navBar = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: true
})
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar">
      <template #content>{{ $t('term.term1') }}</template></NavBar
    >
    <view class="box">
      <view class="title">{{ $t('term.term4') }}</view>
      <view class="text">{{ $t('term.term5') }} </view>

      <view class="title">{{ $t('term.term6') }}</view>
      <view class="text">
        {{ $t('term.term7') }}
        {{ $t('term.term8') }}
        {{ $t('term.term9') }}
      </view>

      <view class="title">{{ $t('term.term10') }}</view>
      <view class="text">
        {{ $t('term.term11') }}
      </view>

      <view class="title">{{ $t('term.term12') }}</view>
      <view class="text">
        {{ $t('term.term13') }}
        {{ $t('term.term14') }}
      </view>

      <view class="title">{{ $t('term.term15') }}</view>
      <view class="text">
        {{ $t('term.term16') }}
        {{ $t('term.term17') }}
      </view>

      <view class="title">{{ $t('term.term18') }}</view>
      <view class="text">
        {{ $t('term.term19') }}
        {{ $t('term.term20') }}
        {{ $t('term.term21') }}
      </view>

      <view class="title">{{ $t('term.term22') }}</view>
      <view class="text">{{ $t('term.term23') }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.box {
  padding: 0 40rpx 40rpx;
}
.title {
  font-size: 40rpx;
  font-weight: 600;
  padding-bottom: 20rpx;
}

.text {
  font-size: 30rpx;
  font-weight: 600;
  padding-bottom: 20rpx;
}
</style>
