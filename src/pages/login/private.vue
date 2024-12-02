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
      <template #content>{{ $t('private.private1') }}</template>
    </NavBar>
    <view class="box">
      <view class="title">{{ $t('private.private4') }}</view>

      <view class="text">{{ $t('private.private5') }}</view>

      <view class="title">{{ $t('private.private6') }}</view>

      <view class="text">{{ $t('private.private7') }}</view>
      <view class="text">
        {{ $t('private.private8') }}
        {{ $t('private.private9') }}
        {{ $t('private.private10') }}
        {{ $t('private.private11') }}
        {{ $t('private.private12') }}
      </view>

      <view class="title">{{ $t('private.private13') }}</view>

      <view class="text">
        {{ $t('private.private14') }}
        {{ $t('private.private15') }}
      </view>

      <view class="title">{{ $t('private.private16') }}</view>

      <view class="text">
        {{ $t('private.private17') }}
        {{ $t('private.private18') }}
        {{ $t('private.private19') }}
        {{ $t('private.private20') }}
        {{ $t('private.private21') }}
      </view>

      <view class="title"> {{ $t('private.private22') }} </view>

      <view class="text">
        {{ $t('private.private23') }}
      </view>
      <view class="title"> {{ $t('private.private24') }} </view>

      <view class="text">
        {{ $t('private.private25') }}
      </view>
      <view class="title"> {{ $t('private.private26') }} </view>

      <view class="text">
        {{ $t('private.private27') }}
      </view>
      <view class="title"> {{ $t('private.private28') }} </view>
      <view class="text">
        {{ $t('private.private29') }}
        {{ $t('private.private30') }}
      </view>
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
