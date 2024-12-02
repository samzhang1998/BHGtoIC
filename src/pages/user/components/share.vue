<script setup lang="ts">
const userForm = ref<any>(null)
import { isPhone } from '@/utils'

const emits = defineEmits(['close'])
const userItem = ref<AnyObj>({
  phone: ''
})
const rules = {
  phone: {
    rules: [
      { required: true, errorMessage: 'please input Phone Number' },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (!isPhone(value)) {
            callback(`The phone format is incorrect!`)
          }
          return true
        }
      }
    ]
  }
}

onMounted(() => {})

const handlePopupStatus = async () => {
  emits('close', false)
}

const handleEditUser = () => {
  userForm.value
    .validate()
    .then(() => {
      handelShare()
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

const handelShare = async () => {
  let params = {
    phone: userItem.value.phone
  }
  const [e, r] = await api.shareApp(params)
  console.log(params)

  if (!e && r) {
    if (r?.success) {
      uni.showToast({
        icon: 'none',
        title: 'Send Success'
      })
      setTimeout(() => {
        emits('close', false)
      }, 1000)
    }
  }
}
</script>

<template>
  <view class="pop">
    <view class="title">{{ $t('me.me18') }}</view>
    <view class="close">
      <uni-icons type="closeempty" size="20" color="#000" @click="handlePopupStatus()"></uni-icons>
    </view>
    <uni-forms ref="userForm" :rules="rules" :modelValue="userItem" label-position="top" err-show-type="toast">
      <uni-forms-item name="phone">
        <view class="item">
          <view class="name">{{ $t('me.me19') }}:</view>
          <view class="input">
            <view class="code"> +61 </view>
            <view class="text">
              <uni-easyinput v-model="userItem.phone" placeholder="" />
            </view>
            <view class="send-btn" @click="handleEditUser">{{ $t('me.me20') }}</view>
          </view>
        </view>
      </uni-forms-item>
    </uni-forms>
  </view>
</template>

<style lang="scss" scoped>
.pop {
  height: 400rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  background: #fff;
  position: relative;
  z-index: 101;
  padding: 60rpx 40rpx;

  .pop-scroll {
    height: 1000rpx;
  }

  .close {
    position: absolute;
    width: 24rpx;
    height: 24rpx;
    top: 60rpx;
    right: 40rpx;
    z-index: 102;
  }

  .title {
    color: #323232;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30rpx;
  }

  .item {
    min-height: 120rpx;

    .name {
      color: #333;
      font-size: 32rpx;
      font-style: normal;
      font-weight: 600;
    }

    .sub-name {
      color: #000;
      font-size: 28rpx;
      font-style: normal;
      font-weight: 500;
    }

    .input {
      // border-bottom: 2rpx solid #ededed;
      padding-top: 10rpx;
      color: #939393 !important;
      font-size: 28rpx !important;
      font-style: normal !important;
      font-weight: 400 !important;
      display: flex;
      align-items: center;

      .code {
        width: 100rpx;
        height: 54rpx;
        border-radius: 10rpx;
        border: 2rpx solid #e0e0e0;
        background: #f8f8f8;
        color: #4f4f4f;
        font-size: 30rpx;
        font-style: normal;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .text {
        width: 316rpx;
        height: 54rpx;
        border-radius: 10rpx;
        background: #f8f8f8;
        margin-left: 20rpx;
        overflow: hidden;
      }

      .send-btn {
        margin-left: 40rpx;
        width: 130rpx;
        height: 54rpx;
        border-radius: 10rpx;
        background: #be9670;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
      }
    }

    .picker {
      height: 60rpx;
    }
  }

  ::v-deep .uni-easyinput__content {
    border: 2rpx solid #e0e0e0;
    height: 54rpx;
    background: #f8f8f8;
    color: #939393 !important;
    font-size: 28rpx !important;
    font-style: normal !important;
    font-weight: 400 !important;
    padding: 0 10rpx;
  }

  ::v-deep .uni-easyinput__content-input {
    padding: 0 !important;
  }

  ::v-deep .uni-forms-item__label {
    display: none !important;
  }

  ::v-deep .uni-forms-item {
    margin-bottom: 0 !important;
  }

  .text-BE9670 {
    color: #be9670;
    text-decoration-line: underline;
  }

  .btn {
    height: 88rpx;
    background: #be9670;
    color: #fff;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .p-b-10 {
    padding-bottom: 10rpx;
  }

  .m-t-30 {
    margin-top: 100rpx;
  }

  .m-t-26 {
    margin-top: 26rpx;
  }

  ::v-deep .content-clear-icon {
    color: #be9670 !important;
  }
}
</style>
