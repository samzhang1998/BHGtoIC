<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { isPhone, isEmail } from '@/utils'
// import { useUser } from '@/hooks/useUser'
// import { useUniFunction } from '@/hooks/useUniFunction'

const { t } = useLocale()
// const { setUserInfo } = useUser()
// const { backToOne } = useUniFunction()

const navBar = ref({
  title: t('setting.setting25'),
  backgroundColor: 'transparent',
  textColor: '#fff',
  isBack: true
})

const loginForm = ref<any>(null)
const popup = ref<any>(null)
const pageType = ref(1)
const changeType = ref('email')

const loginFormData = ref({
  email: '',
  password: '',
  password2: '',
  code: '',
  number: ''
})

const rules = {
  email: {
    rules: [
      {
        required: true,
        errorMessage: 'please input your email'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (!isEmail(value)) {
            callback(`E-mail format is incorrect`)
          }
          return true
        }
      }
    ]
  },
  number: {
    rules: [
      {
        required: true,
        errorMessage: 'please input your Mobile Number'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (!isPhone(value)) {
            callback(`The Mobile Number format is incorrect!`)
          }
          return true
        }
      }
    ]
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: 'please input your Pin'
      },
      {
        minLength: 4,
        maxLength: 4,
        errorMessage: 'Length should be 4'
      }
    ]
  },
  password2: {
    rules: [
      {
        required: true,
        errorMessage: 'please input your Confirm Pin'
      },
      {
        minLength: 4,
        maxLength: 4,
        errorMessage: 'Length should be 4'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value !== data.password) {
            callback(`Two inputs don't match!`)
          }
          return true
        }
      }
    ]
  }
}

onLoad((options) => {
  changeType.value = options?.type
})

onShow(() => {
  // pageType.value = 2
})

const handleNext = () => {
  loginForm.value
    .validate()
    .then(() => {
      if (changeType.value === 'email') {
        sendCodeForEmail()
      } else {
        sendCodeForPhone()
      }
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

const handleConfirm = () => {
  loginForm.value
    .validate()
    .then(() => {
      resetPassword()
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

const handleClose = () => {
  popup.value.close()
}

const handelVerify = () => {
  if (!loginFormData.value.code) {
    uni.showToast({
      icon: 'none',
      title: 'please input code'
    })
    return
  }
  popup.value.close()
  pageType.value = 2
}

async function sendCodeForEmail() {
  let params = {
    email: loginFormData.value.email
  }
  const [e, r] = await api.resetPinCodeSend(params)
  if (!e && r) {
    if (r?.success) {
      uni.showToast({
        icon: 'none',
        title: 'send success'
      })
      popup.value.open()
    }
  }
}

async function sendCodeForPhone() {
  let params = {
    mobile: loginFormData.value.number
  }
  const [e, r] = await api.resetPinMsgSend(params)
  if (!e && r) {
    if (r?.success) {
      uni.showToast({
        icon: 'none',
        title: 'send success'
      })
      popup.value.open()
    }
  }
}

async function resetPassword() {
  let params = {
    pin: loginFormData.value.password,
    confirmPin: loginFormData.value.password2,
    verificationCode: loginFormData.value.code
  }
  const [e, r] = await api.editPin(params)
  if (!e && r) {
    if (r?.success) {
      uni.showToast({
        icon: 'none',
        title: 'reset success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }
  }
}
</script>

<template>
  <view class="recovery">
    <NavBar v-bind="navBar"></NavBar>
    <view class="steps">
      <view class="line">
        <view class="round left act">1</view>
        <view :class="pageType === 2 ? 'round right act' : 'round right'">2</view>
      </view>
    </view>
    <view class="info" v-if="pageType === 1">
      <view class="title">{{ $t('login.info') }}</view>
      <view class="form">
        <uni-forms ref="loginForm" :rules="rules" :modelValue="loginFormData" label-position="top">
          <uni-forms-item :label="$t('login.email') + ':'" name="email" v-if="changeType === 'email'">
            <uni-easyinput v-model="loginFormData.email" placeholder="" />
          </uni-forms-item>
          <uni-forms-item :label="$t('login.number') + ':'" name="number" v-if="changeType === 'phone'">
            <view class="flex align-center">
              <view class="phone-num">+61</view>
              <uni-easyinput v-model="loginFormData.number" placeholder="" />
            </view>
          </uni-forms-item>
        </uni-forms>
        <view class="login-btn" @click="handleNext">{{ $t('login.next') }}</view>
      </view>
    </view>
    <view class="info" v-if="pageType === 2">
      <view class="title">{{ $t('setting.setting27') }}</view>
      <view class="form">
        <uni-forms ref="loginForm" :rules="rules" :modelValue="loginFormData" label-position="top">
          <uni-forms-item :label="$t('setting.setting22') + ':'" name="password">
            <uni-easyinput v-model="loginFormData.password" type="number" maxlength="4" placeholder="" />
          </uni-forms-item>
          <uni-forms-item :label="$t('setting.setting23') + ':'" type="password" name="password2">
            <uni-easyinput v-model="loginFormData.password2" placeholder="" maxlength="4" type="number" />
          </uni-forms-item>
        </uni-forms>
        <view class="login-btn" @click="handleConfirm">{{ $t('setting.setting25') }}</view>
      </view>
    </view>
  </view>
  <uni-popup ref="popup" :is-mask-click="false" type="bottom">
    <view class="pop">
      <view class="close">
        <uni-icons type="closeempty" size="20" color="#000" @click="handleClose"></uni-icons>
      </view>
      <view class="title">{{ $t('login.code') }}</view>
      <view class="text m-tb-20">{{ changeType === 'email' ? $t('login.text') : $t('login.text2') }}</view>
      <view>
        <uni-easyinput v-model="loginFormData.code" type="number" :placeholder="$t('login.code')" />
      </view>
      <view class="text">
        {{ $t('login.resend') }}
        <text class="text-BE9670" @click="handleNext">{{ $t('login.resend2') }}</text>
      </view>
      <view class="btn m-t-30" @click="handelVerify">{{ $t('login.verify') }}</view>
    </view>
  </uni-popup>
</template>

<style lang="scss" scoped>
.recovery {
  width: 100vw;
  height: 100vh;
  background: url('../../static/images/login-bg.png') no-repeat center;
  background-size: 100% 100%;
  position: relative;

  .steps {
    padding: 44rpx 0;
    .line {
      height: 4rpx;
      background: #fff;
      position: relative;

      .round {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: #fff;
        border: 4rpx solid #fff;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #be9670;
        font-size: 36rpx;
      }

      .act {
        background: #be9670;
        color: #fff;
      }

      .left {
        left: 260rpx;
      }

      .right {
        right: 260rpx;
      }
    }
  }

  .info {
    padding: 36rpx 56rpx 0;
    .title {
      color: #fff;
      font-size: 40rpx;
      font-style: normal;
      font-weight: 500;
      line-height: 1.5;
      text-transform: uppercase;
    }
  }

  .form {
    .phone-num {
      color: #fff;
      padding-right: 20rpx;
    }
    .login-btn {
      position: absolute;
      bottom: 200rpx;
      left: 56rpx;
      width: calc(100% - 112rpx);
      height: 80rpx;
      border-radius: 10rpx;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #be9670;
      font-size: 32rpx;
      font-style: normal;
      font-weight: 500;
    }

    ::v-deep .uni-forms-item__label {
      color: #fff;
      width: 100% !important;
    }

    ::v-deep .uni-easyinput__content {
      border: none;
    }

    ::v-deep .uni-forms-item__error {
      color: #fff;
    }

    ::v-deep .content-clear-icon {
      color: #be9670 !important;
    }
  }
}

.pop {
  height: 635rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  background: #fff;
  position: relative;
  padding: 60rpx 40rpx;

  .close {
    position: absolute;
    width: 24rpx;
    height: 24rpx;
    top: 60rpx;
    right: 40rpx;
  }

  .title {
    color: #323232;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 400;
  }

  .m-tb-20 {
    margin: 20rpx 0;
    height: 84rpx;
  }

  ::v-deep .uni-easyinput__content {
    border: 1rpx solid #d7dbe6 !important;
    height: 88rpx;
    margin-bottom: 20rpx;
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

  .m-t-30 {
    margin-top: 70rpx;
  }

  ::v-deep .content-clear-icon {
    color: #be9670 !important;
  }
}
</style>
