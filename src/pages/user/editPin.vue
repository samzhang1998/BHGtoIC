<script setup lang="ts">
const navBar = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: true
})
const changeForm = ref<any>(null)
const pageType = ref('edit')
const loginFormData = ref({
  currentPassword: '',
  currentPin: '',
  confirmPin: '',
  pin: ''
})

onLoad((options) => {
  pageType.value = options?.type || 'edit'
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
  currentPin: {
    rules: [
      {
        required: true,
        errorMessage: 'please input Current Pin'
      },
      {
        minLength: 4,
        maxLength: 4,
        errorMessage: 'Length should be 4'
      }
    ]
  },
  pin: {
    rules: [
      {
        required: true,
        errorMessage: 'please input New Pin'
      },
      {
        minLength: 4,
        maxLength: 4,
        errorMessage: 'Length should be 4'
      }
    ]
  },
  confirmPin: {
    rules: [
      {
        required: true,
        errorMessage: 'please input Confirm Pin'
      },
      {
        minLength: 4,
        maxLength: 4,
        errorMessage: 'Length should be 4'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value !== data.pin) {
            callback(`Two inputs don't match!`)
          }
          return true
        }
      }
    ]
  }
}

const handleChangePin = () => {
  changeForm.value
    .validate()
    .then(() => {
      editPin()
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

async function editPin() {
  let params: AnyObj = {
    currentPassword: loginFormData.value.currentPassword,
    confirmPin: loginFormData.value.confirmPin,
    pin: loginFormData.value.pin
  }
  if (pageType.value === 'edit') {
    params.currentPin = loginFormData.value.currentPin
  }
  const [e, r] = await api.editPin(params)
  if (!e && r) {
    if (r?.success) {
      console.log(r?.data)
      uni.showToast({
        icon: 'none',
        title: pageType.value === 'edit' ? 'Edit pin success' : 'Reset pin success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }
  }
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="system">
      <view class="title">{{ pageType === 'edit' ? $t('setting.setting18') : $t('setting.setting25') }}</view>
      <view class="form">
        <uni-forms ref="changeForm" :rules="rules" :modelValue="loginFormData" label-position="top">
          <uni-forms-item :label="$t('me.me23')" name="currentPassword">
            <uni-easyinput v-model="loginFormData.currentPassword" placeholder="" type="password" />
          </uni-forms-item>
          <uni-forms-item :label="$t('setting.setting21')" name="currentPin" v-if="pageType === 'edit'">
            <uni-easyinput v-model="loginFormData.currentPin" maxlength="4" placeholder="" type="password" />
          </uni-forms-item>
          <uni-forms-item :label="$t('setting.setting22')" name="pin">
            <uni-easyinput v-model="loginFormData.pin" placeholder="" maxlength="4" type="password" />
          </uni-forms-item>
          <uni-forms-item :label="$t('setting.setting23')" name="confirmPin">
            <uni-easyinput v-model="loginFormData.confirmPin" placeholder="" maxlength="4" type="password" />
          </uni-forms-item>
        </uni-forms>
        <view class="login-btn" @click="handleChangePin">
          {{ pageType === 'edit' ? $t('setting.setting18') : $t('setting.setting25') }}
        </view>
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
