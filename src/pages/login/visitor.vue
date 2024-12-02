<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { useUser } from '@/hooks/useUser'
// import { useUniFunction } from '@/hooks/useUniFunction'
import { isEmail } from '@/utils'

const { t } = useLocale()
const { setUserInfo } = useUser()
// const { backToOne } = useUniFunction()

const navBar = ref({
  title: t('login.visitor'),
  backgroundColor: 'transparent',
  textColor: '#fff',
  isBack: true
})

const loginForm = ref<any>(null)
const popup = ref<any>(null)
const pageType = ref(1)
const privacy = ref(false)

const loginFormData = ref({
  email: '',
  code: ''
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
  }
}

onShow(() => {
  // pageType.value = 2
})

const handleNext = () => {
  if (!privacy.value) {
    uni.showToast({
      title: 'Please view privacy policy',
      icon: 'none'
    })
    return
  }
  loginForm.value
    .validate()
    .then(() => {
      sendCode()
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

const handleShowPrivate = () => {
  uni.navigateTo({
    url: '/pages/login/private'
  })
}

const handleShowTerms = () => {
  uni.navigateTo({
    url: '/pages/login/terms'
  })
}

const handleClose = () => {
  popup.value.close()
}

const handleCheck = () => {
  privacy.value = !privacy.value
}

const handelVerify = () => {
  if (!loginFormData.value.code) {
    uni.showToast({
      icon: 'none',
      title: 'please input code'
    })
    return
  }
  // popup.value.close()
  visitorLogin()
  // pageType.value = 2
}

async function sendCode() {
  let params = {
    email: loginFormData.value.email
  }
  const [e, r] = await api.visitorCodeSend(params)
  console.log('🚀 ~ sendCode ~ r:', r)
  // popup.value.open()

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

async function visitorLogin() {
  let params = {
    email: loginFormData.value.email,
    verificationCode: loginFormData.value.code
  }
  const [e, r] = await api.visitorLogin(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ visitorLogin ~ r:', r)
      let userInfo: IUserState = {
        token: r.data.token,
        roles: ['visitor'],
        clientEmail: r.data.clientEmail
      }
      uni.setStorageSync('userInfo', userInfo)
      setUserInfo(userInfo)
      uni.showToast({
        icon: 'none',
        title: 'Sign up success'
      })
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }, 2000)
      loginFormData.value.code = ''
    } else {
      loginFormData.value.code = ''
    }
  }
}
</script>

<template>
  <view class="recovery">
    <NavBar v-bind="navBar"></NavBar>
    <view class="info" v-if="pageType === 1">
      <view class="title">{{ $t('login.visitor2') }}</view>
      <view class="form">
        <uni-forms ref="loginForm" :rules="rules" :modelValue="loginFormData" label-position="top">
          <uni-forms-item :label="$t('login.email') + ':'" name="email">
            <uni-easyinput v-model="loginFormData.email" placeholder="" />
          </uni-forms-item>
        </uni-forms>
        <view class="login-btn" @click="handleNext">{{ $t('login.next') }}</view>
      </view>
    </view>
    <view class="privacy">
      <radio :checked="privacy" color="#be9670" style="transform: scale(0.6)" @click="handleCheck" />
      <!-- {{ $t('login.privacy') }} -->
      {{ $t('login.login1') }} <text class="ts" @click="handleShowPrivate">{{ $t('login.login2') }}</text
      >,<text class="ts" @click="handleShowTerms">{{ $t('login.login3') }}</text>
    </view>
  </view>
  <uni-popup ref="popup" :is-mask-click="false" type="bottom">
    <view class="pop">
      <view class="close">
        <uni-icons type="closeempty" size="20" color="#000" @click="handleClose"></uni-icons>
      </view>
      <view class="title">{{ $t('login.code') }}</view>
      <view class="text m-tb-20">{{ $t('login.text') }}</view>
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

  .privacy {
    width: 100%;
    border-top: 1rpx solid #ececec;
    height: calc(86rpx + env(safe-area-inset-bottom) / 2);
    padding-bottom: calc(env(safe-area-inset-bottom) / 2);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 0;
    color: #fff;
    font-size: 24rpx;
    font-style: normal;
    font-weight: 400;

    .ts {
      text-decoration: underline;
      padding-left: 10rpx;
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
