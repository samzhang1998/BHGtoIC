<script setup lang="ts">
import { useFunds } from './hooks/useFunds'
import { isEmail, isPhone } from '@/utils'
import { useDict } from '@/hooks/useDict'
import { useLocale } from '@/hooks/useLocale'
const { langStatus } = useLocale()
const { getType } = useDict()
const { getFundsAll } = useFunds()
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
const fId = ref('')
const lang = ref(false)
const investorType = ref<AnyObj[]>([])
const selectType = ref<number>(0)

const fundsList = ref<AnyObj[]>([])
const selectFunds = ref<number>(0)
const isShowToast = ref<boolean>(false)

const loginForm = ref<any>(null)

const formData = ref({
  contactName: '',
  contactNumber: '',
  email: '',
  term: '',
  amount: '',
  others: ''
})

const rules = {
  contactName: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input contact name'
      }
    ]
  },
  contactNumber: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Contact Number'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (!isPhone(value)) {
            callback(`The contact number format is incorrect`)
          }
          return true
        }
      }
    ]
  },
  email: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Email'
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
  term: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Investment Term'
      }
    ]
  },
  amount: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Investment Amount'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (Number(value) < Number(fundsList.value[selectFunds.value].purchaseMinAmount)) {
            callback(`The minimum investment amount is ${fundsList.value[selectFunds.value].purchaseMinAmount}`)
          }
          return true
        }
      }
    ]
  }
}

onLoad((options) => {
  formData.value.term = options?.m || ''
  fId.value = options?.fId || ''
})

onMounted(() => {
  getData()
  getAllProduct()
})

onShow(() => {
  lang.value = uni.getLocale() === 'en'
})

async function getData() {
  const data = await getType({ dictType: 'investment_entity_type' })
  investorType.value = data || []
}

const getAllProduct = async () => {
  const data = await getFundsAll({
    pageNum: 1,
    pageSize: 1000000
  })
  console.log('🚀 ~ file: index.vue:24 ~ getAllProduct ~ data:', data?.list)
  fundsList.value = data?.list
  const index = data?.list.findIndex((item: AnyObj) => {
    return item.id === Number(fId.value)
  })
  // console.log(index)
  if (index !== -1) {
    selectFunds.value = index
    console.log('🚀 ~ getAllProduct ~ selectFunds:', fundsList.value[index])
    formData.value.amount = fundsList.value[index].purchaseMinAmount || ''
  }
}

const handlePicker = (e: AnyObj) => {
  if (e.detail.value >= 0) {
    selectType.value = e.detail.value
  }
}

const handlePickerFund = (e: AnyObj) => {
  if (e.detail.value >= 0) {
    selectFunds.value = e.detail.value
  }
}

const handleSave = async () => {
  loginForm.value
    .validate()
    .then(async () => {
      let params = {
        fundId: fundsList.value[selectFunds.value].id,
        email: formData.value.email,
        name: formData.value.contactName,
        investmentAmount: formData.value.amount,
        investmentTerm: formData.value.term,
        investorType: investorType.value[selectType.value]?.value,
        phone: formData.value.contactNumber,
        message: formData.value.others,
        type: 2
      }
      const [e, r] = await api.enquirySubmit(params)
      if (!e && r) {
        if (r?.success) {
          isShowToast.value = true
          setTimeout(() => {
            isShowToast.value = false
            uni.navigateBack()
          }, 2000)
        }
      }
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="verification">
      <view class="title">{{ $t('home.invest1') }}</view>
      <!-- <view class="form">
        <view class="item">
          <view class="form-name">{{ $t('home.invest4') }}</view>
          <view class="fund">
            <picker
              @change="handlePickerFund"
              :value="selectFunds"
              range-key="name"
              :range="fundsList"
              :disabled="true"
            >
              <view class="picker flex justify-center align-center">
                {{
                  langStatus
                    ? fundsList[selectFunds]?.nameCN || fundsList[selectFunds]?.name
                    : fundsList[selectFunds]?.name
                }}
              </view>
            </picker>
          </view>
        </view>
        <view class="item">
          <view class="form-name require">{{ $t('home.invest10') }}</view>
          <view class="input">
            <picker @change="handlePicker" :value="selectType" range-key="code" :range="investorType">
              <view class="picker flex justify-between align-center">
                <view>{{ investorType[selectType]?.code }}</view>
                <view>
                  <uni-icons type="bottom" color="#BE9670" size="14"></uni-icons>
                </view>
              </view>
            </picker>
          </view>
        </view>
        <view class="item">
          <view class="form-name p-b-20">{{ $t('home.invest11') }}</view>
          <view class="name require">{{ $t('home.invest12') }}</view>
          <view class="input">
            <input v-model="formData.contactName" />
          </view>
        </view>
        <view class="item">
          <view class="name require">{{ $t('home.invest14') }}</view>
          <view class="input">
            <input v-model="formData.contactNumber" />
          </view>
        </view>
        <view class="item">
          <view class="name require">{{ $t('home.invest13') }}</view>
          <view class="input">
            <input v-model="formData.email" />
          </view>
        </view>
        <view class="item">
          <view class="name require">{{ $t('home.invest15') }}</view>
          <view class="input">
            <input v-model="formData.term" />
          </view>
        </view>
        <view class="item">
          <view class="name require">{{ $t('home.invest16') }}</view>
          <view class="input">
            <input v-model="formData.amount" type="number" />
          </view>
        </view>
        <view class="item">
          <view class="name">{{ $t('home.invest17') }}</view>
          <view class="input">
            <textarea v-model="formData.others" auto-height></textarea>
          </view>
        </view>
      </view> -->
      <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
        <uni-forms-item :label="$t('home.invest4')" :label-width="300" name="" required>
          <view class="fund">
            <picker
              @change="handlePickerFund"
              :value="selectFunds"
              range-key="name"
              :range="fundsList"
              :disabled="true"
            >
              <view class="picker flex justify-center align-center">
                {{
                  langStatus
                    ? fundsList[selectFunds]?.nameCN || fundsList[selectFunds]?.name
                    : fundsList[selectFunds]?.name
                }}
              </view>
            </picker>
          </view>
        </uni-forms-item>
        <uni-forms-item :label="$t('home.invest10')" name="" :label-width="300" required>
          <view class="input">
            <picker @change="handlePicker" :value="selectType" range-key="code" :range="investorType">
              <view class="picker">
                <view>{{ investorType[selectType]?.code }}</view>
                <view>
                  <uni-icons type="bottom" color="#BE9670" size="14"></uni-icons>
                </view>
              </view>
            </picker>
          </view>
        </uni-forms-item>
        <view class="form-name p-b-20">{{ $t('home.invest11') }}</view>
        <uni-forms-item :label="$t('home.invest12')" name="contactName" :label-width="300" required>
          <view class="input">
            <uni-easyinput v-model="formData.contactName" placeholder="" />
          </view>
        </uni-forms-item>
        <uni-forms-item :label="$t('home.invest14')" name="contactNumber" :label-width="300" required>
          <view class="input">
            <view class="phone-num">+61</view>
            <uni-easyinput v-model="formData.contactNumber" placeholder="" />
          </view>
        </uni-forms-item>
        <uni-forms-item :label="$t('home.invest13')" name="email" :label-width="300" required>
          <view class="input">
            <uni-easyinput v-model="formData.email" placeholder="" />
          </view>
        </uni-forms-item>
        <uni-forms-item :label="$t('home.invest15')" name="term" :label-width="300" required>
          <view class="input">
            <uni-easyinput v-model="formData.term" placeholder="" />
          </view>
        </uni-forms-item>
        <uni-forms-item :label="$t('home.invest16')" name="amount" :label-width="300" required>
          <view class="input">
            <uni-easyinput v-model="formData.amount" placeholder="" />
          </view>
        </uni-forms-item>
        <uni-forms-item :label="$t('home.invest17')" name="others" :label-width="300">
          <view class="input">
            <uni-easyinput v-model="formData.others" placeholder="" type="textarea" />
          </view>
        </uni-forms-item>
      </uni-forms>
      <view class="btn" @click="handleSave"> {{ $t('home.invest18') }} </view>
    </view>
    <Toast :is-show="isShowToast"></Toast>
  </view>
</template>
<style lang="scss" scoped>
.verification {
  padding: 0 40rpx 80rpx;
  .title {
    color: #333;
    font-size: 44rpx;
    font-style: normal;
    font-weight: 700;
    padding-bottom: 40rpx;
  }

  // ::v-deep .uni-forms-item__label {
  //   color: #fff;
  // }

  ::v-deep .uni-easyinput__content {
    border: none;
  }

  // ::v-deep .uni-forms-item__error {
  //   color: #fff;
  // }

  ::v-deep .content-clear-icon {
    color: #be9670 !important;
  }

  .fund {
    border: 1rpx solid #be9670;
    background: #d6bda5;
    color: #fff;
    font-size: 28rpx;
    font-style: normal;
    font-weight: 400;
    border-radius: 10rpx;

    .picker {
      min-height: 80rpx;
      padding: 0 20rpx;
    }
  }

  .input {
    width: 100%;
    min-height: 80rpx;
    border-radius: 20rpx;
    background: #fff;
    box-shadow: 0 8rpx 76rpx 0 rgba(189, 189, 189, 0.25);
    // padding: 0 30rpx;
    display: flex;
    // justify-content: center;
    align-items: center;

    .picker {
      width: calc(100vw - 80rpx);
      padding: 0 20rpx;
      height: 80rpx;
      // background: red;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .phone-num {
      padding: 0 20rpx;
    }

    // input {
    //   height: 80rpx;
    // }

    // textarea {
    //   padding: 20rpx 0;
    // }
  }

  .form {
    .item {
      .form-name {
        color: #000;
        font-size: 34rpx;
        font-style: normal;
        font-weight: 400;
      }

      .require::before {
        content: '*';
        color: #f56c6c;
        font-size: 30rpx;
        padding-right: 4rpx;
      }

      .p-b-20 {
        padding-bottom: 20rpx;
      }
      .name {
        color: #000;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        padding-bottom: 8rpx;
      }

      .fund {
        border: 1rpx solid #be9670;
        background: #d6bda5;
        color: #fff;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
        border-radius: 10rpx;

        .picker {
          min-height: 80rpx;
          padding: 0 20rpx;
        }
      }

      .input {
        min-height: 80rpx;
        border-radius: 20rpx;
        background: #fff;
        box-shadow: 0 8rpx 76rpx 0 rgba(189, 189, 189, 0.25);
        padding: 0 30rpx;

        .picker {
          height: 80rpx;
        }

        input {
          height: 80rpx;
        }

        textarea {
          padding: 20rpx 0;
        }
      }
    }

    .item + .item {
      margin-top: 24rpx;
    }
  }

  .btn {
    margin-top: 40rpx;
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
    // position: fixed;
    // left: 45rpx;
    // bottom: 200rpx;
  }
}
</style>
