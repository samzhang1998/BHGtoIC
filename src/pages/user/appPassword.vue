<script setup lang="ts">
const navBar = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: true
})

const userInfo = ref<AnyObj>({})
const pinStatus = ref(false)
const pinSwitchStatus = ref(false)

onShow(() => {
  pinSwitchStatus.value = true
  getInfo()
})

onHide(() => {
  pinSwitchStatus.value = false
})

async function getInfo() {
  let params = {}
  const [e, r] = await api.getUserInfo(params)
  if (!e && r) {
    if (r?.success) {
      userInfo.value = r?.data || {}
      pinStatus.value = r?.data?.enablePin || false
      console.log('🚀 ~ getInfo ~ userInfo:', userInfo.value)
    }
  }
}

const handleChangePin = (e: any) => {
  console.log('🚀 ~ handleChangePin ~ value:', e.detail.value)
  if (e.detail.value && !userInfo.value?.enablePin) {
    uni.navigateTo({
      url: '/pages/user/pin?type=set'
    })
  } else {
    uni.navigateTo({
      url: '/pages/user/checkPin?type=closePin'
    })
  }
}

const handleToEdit = () => {
  if (userInfo.value?.enablePin) {
    uni.navigateTo({
      url: '/pages/user/editPin?type=edit'
    })
  }
}

const handleResetPin = () => {
  if (userInfo.value?.enablePin) {
    uni.navigateTo({
      url: '/pages/user/changeResetPin'
    })
  }
}

const handleSave = () => {
  uni.navigateBack()
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="system">
      <view class="title">{{ $t('setting.setting15') }}</view>
      <view class="list">
        <view class="item flex justify-between align-center">
          <view class="left flex align-center">{{ $t('setting.setting16') }}</view>
          <view class="right flex align-center">
            <block v-if="pinSwitchStatus">
              <switch :checked="pinStatus" color="#BE9670" style="transform: scale(0.8)" @change="handleChangePin" />
            </block>
          </view>
        </view>
        <view class="item" v-if="pinStatus">
          <view class="pin-btn" @click="handleToEdit">{{ $t('setting.setting18') }}</view>
          <view class="forget" @click="handleResetPin">
            {{ $t('setting.setting19') }}<text class="text-reset">{{ $t('setting.setting20') }}</text>
          </view>
        </view>
      </view>
      <view class="btn" @click="handleSave"> {{ $t('setting.setting4') }} </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.system {
  padding: 0 40rpx;
  .title {
    color: #333;
    font-size: 44rpx;
    font-style: normal;
    font-weight: 700;
    padding-bottom: 20rpx;
  }

  .list {
    border-radius: 20rpx;
    background: #fff;
    box-shadow: 0px 8rpx 76rpx 0px rgba(189, 189, 189, 0.25);
    padding: 0 30rpx 30rpx;

    .item {
      min-height: 80rpx;

      .left {
        color: #12151b;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
      }

      .right {
        color: #be9670;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 400;
      }

      .m-l-10 {
        margin-left: 10rpx;
      }

      .m-r-10 {
        margin-right: 20rpx;
      }

      .pin-btn {
        height: 88rpx;
        border: 2rpx solid #e0e0e0;
        border-radius: 10rpx;
        margin: 30rpx 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #be9670;
        font-size: 28rpx;
      }

      .forget {
        text-align: right;
        font-size: 28rpx;
        color: #828282;

        .text-reset {
          color: #be9670;
        }
      }
    }

    .item + .item {
      border-top: 2rpx solid #f4f4f4;
    }
  }

  .btn {
    width: 660rpx;
    height: 80rpx;
    border-radius: 10rpx;
    background: #be9670;
    color: #fff;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 45rpx;
    bottom: 200rpx;
  }
}
</style>
