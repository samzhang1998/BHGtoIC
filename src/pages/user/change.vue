<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
const { t } = useLocale()
import { useUser } from '@/hooks/useUser'

const { loginOut } = useUser()
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
const changeForm = ref<any>(null)
const loginFormData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  currentPassword: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Current Password'
      },
      {
        minLength: 8,
        maxLength: 16,
        errorMessage: 'Length should be 8 to 16'
      }
    ]
  },
  newPassword: {
    rules: [
      {
        required: true,
        errorMessage: 'please input New Password'
      },
      {
        minLength: 8,
        maxLength: 16,
        errorMessage: 'Length should be 8 to 16'
      }
    ]
  },
  confirmPassword: {
    rules: [
      {
        required: true,
        errorMessage: 'please input Confirm Password'
      },
      {
        minLength: 8,
        maxLength: 16,
        errorMessage: 'Length should be 8 to 16'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value !== data.newPassword) {
            callback(`Two inputs don't match!`)
          }
          return true
        }
      }
    ]
  }
}

const handleLogin = () => {
  changeForm.value
    .validate()
    .then(() => {
      // sendCode()
      resetPassword()
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

async function resetPassword() {
  let params = {
    confirmPassword: loginFormData.value.confirmPassword,
    currentPassword: loginFormData.value.currentPassword,
    password: loginFormData.value.newPassword
  }
  const [e, r] = await api.editPassword(params)
  if (!e && r) {
    if (r?.success) {
      console.log(r?.data)
      loginOut()
    }
  }
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="system">
      <view class="title">{{ $t('me.me22') }}</view>
      <view class="form">
        <uni-forms ref="changeForm" :rules="rules" :modelValue="loginFormData" label-position="top">
          <uni-forms-item :label="$t('me.me23')" name="currentPassword">
            <uni-easyinput v-model="loginFormData.currentPassword" placeholder="" type="password" />
          </uni-forms-item>
          <uni-forms-item :label="$t('me.me24')" name="newPassword">
            <uni-easyinput v-model="loginFormData.newPassword" placeholder="" type="password" />
          </uni-forms-item>
          <uni-forms-item :label="$t('me.me25')" name="confirmPassword">
            <uni-easyinput v-model="loginFormData.confirmPassword" placeholder="" type="password" />
          </uni-forms-item>
        </uni-forms>

        <view class="login-btn" @click="handleLogin">{{ $t('me.me26') }}</view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.system {
  padding: 0 40rpx 40rpx;
  .title {
    color: #333;
    font-size: 44rpx;
    font-style: normal;
    font-weight: 700;
    padding-bottom: 20rpx;
  }

  .sub-title {
    color: #000;
    font-size: 28rpx;
    font-style: normal;
    font-weight: 400;
    padding-bottom: 20rpx;
  }

  .form {
    // padding: 66rpx 56rpx 0;

    .login-btn {
      position: absolute;
      bottom: 200rpx;
      left: 56rpx;
      width: calc(100% - 112rpx);
      height: 80rpx;
      border-radius: 10rpx;
      background: #be9670;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 32rpx;
      font-style: normal;
      font-weight: 500;
    }

    ::v-deep .uni-forms-item__label {
      color: #000;
      width: 300rpx !important;
      padding: 0 !important;
    }

    ::v-deep .uni-easyinput__content {
      border: none;
      border-radius: 20rpx;
      background: #fff;
      box-shadow: 0 8rpx 76rpx 0 rgba(189, 189, 189, 0.25);
    }

    ::v-deep .uni-forms-item__error {
      color: #000;
    }

    ::v-deep .content-clear-icon {
      color: #be9670 !important;
    }
  }
}
</style>
