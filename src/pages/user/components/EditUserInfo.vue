<script setup lang="ts">
import { injectStrict } from '@/utils'
import { isPhone } from '@/utils'

import { UserKey } from '@/symbols/user'
const userForm = ref<any>(null)
const { uId, info } = injectStrict(UserKey)

const emits = defineEmits(['close'])
const userItem = ref<AnyObj>({
  name: '',
  mobile: '',
  birth: ''
  // bsb: ''
})
const rules = {
  name: {
    rules: [{ required: true, errorMessage: 'please input name' }]
  },
  mobile: {
    rules: [
      { required: true, errorMessage: 'please input Phone' },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (!isPhone(value)) {
            callback(`The mobile format is incorrect!`)
          }
          return true
        }
      }
    ]
  },
  birth: {
    rules: [{ required: true, errorMessage: 'please select Birthday' }]
  }
}

onMounted(() => {
  userItem.value.name = info.value.name
  userItem.value.mobile = info.value.phone
  userItem.value.birth = info.value.birthday
  // userItem.value.bsb = info.value?.bsb
})

const handleDateChange = (e: AnyObj) => {
  userItem.value.birth = e.detail.value
}

const handlePopupStatus = async () => {
  emits('close')
}

const handleEditUser = () => {
  userForm.value
    .validate()
    .then(() => {
      handelEdit()
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

const handelEdit = async () => {
  let params = {
    name: userItem.value.name,
    mobile: userItem.value.mobile,
    birth: userItem.value.birth,
    id: uId.value
  }
  // console.log('444', params)

  const [e, r] = await api.editClient(params)

  if (!e && r) {
    if (r?.success) {
      // uni.showToast({
      //   icon: 'none',
      //   title: 'Submitted for review'
      // })
      setTimeout(() => {
        emits('close', 'open')
      }, 1000)
    }
  }
}
</script>

<template>
  <view class="pop">
    <view class="title">{{ $t('me.me13') }}</view>
    <view class="close">
      <uni-icons type="closeempty" size="20" color="#000" @click="handlePopupStatus()"></uni-icons>
    </view>
    <uni-forms ref="userForm" :rules="rules" :modelValue="userItem" label-position="top" err-show-type="toast">
      <uni-forms-item name="name">
        <view class="item">
          <view class="name">{{ $t('me.me14') }}</view>
          <view class="input">
            <uni-easyinput v-model="userItem.name" placeholder="" />
          </view>
        </view>
      </uni-forms-item>
      <uni-forms-item name="mobile">
        <view class="item">
          <view class="name">{{ $t('me.me15') }}</view>
          <view class="input">
            <view class="flex align-center">
              <view class="phone-num">+61</view>
              <uni-easyinput v-model="userItem.mobile" placeholder="" />
            </view>
          </view>
        </view>
      </uni-forms-item>
      <uni-forms-item name="birth">
        <view class="item">
          <view class="name">{{ $t('me.me16') }}</view>
          <view class="input">
            <picker mode="date" :value="userItem.birth" @change="handleDateChange">
              <view class="picker flex align-center">{{ userItem.birth }}</view>
            </picker>
          </view>
        </view>
      </uni-forms-item>
    </uni-forms>
    <view class="btn m-t-30" @click="handleEditUser">{{ $t('me.me17') }}</view>
  </view>
</template>

<style lang="scss" scoped>
.pop {
  height: 800rpx;
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
      border-bottom: 2rpx solid #ededed;
      color: #939393 !important;
      font-size: 28rpx !important;
      font-style: normal !important;
      font-weight: 400 !important;

      .phone-num {
        color: #000;
        padding-right: 20rpx;
      }
    }

    .picker {
      height: 60rpx;
    }
  }

  ::v-deep .uni-easyinput__content {
    border: none;
    height: 60rpx;
    color: #939393 !important;
    font-size: 28rpx !important;
    font-style: normal !important;
    font-weight: 400 !important;
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
