<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
const { t } = useLocale()
import country from '@/static/json/countries.json'
import { useDict } from '@/hooks/useDict'
import { wrapperEnv } from '@/utils/env'

const { getType } = useDict()

const { VITE_APP_BASE_URL } = wrapperEnv
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
const lang = ref(false)
const investorType = ref<AnyObj[]>([])
const selectType = ref<number>(0)
// const entityList = ref<AnyObj[]>([])
// const selectEntity = ref<number>(0)
const countryList = ref<AnyObj[]>([])
const selectCountry = ref<number>(0)
const documentType = ref<string[]>(['passport', 'drivelicence', 'identitycard'])
const selectDocumentType = ref<number>(0)
const investorName = ref('')
const formData = ref([
  {
    name: 'docOneFront',
    uri: ''
  },
  {
    name: 'docOneBack',
    uri: ''
  },
  {
    name: 'livePhoto',
    uri: ''
  }
])
console.log('🚀 ~ file: verification.vue:3 ~ country:', countryList)

onMounted(() => {
  getData()
  // getEntityAll()
  countryList.value = Object.values(country)
})

onShow(() => {
  lang.value = uni.getLocale() === 'en'
})

async function getData() {
  const data = await getType({ dictType: 'investment_entity_type' })
  investorType.value = data || []
}

// async function getEntityAll() {
//   const [e, r] = await api.getEntityAll({})
//   if (!e && r) {
//     if (r?.success) {
//       entityList.value = r.data || []
//       console.log(entityList.value)
//     }
//   }
// }

const handlePicker = (e: AnyObj) => {
  if (e.detail.value >= 0) {
    selectType.value = e.detail.value
  }
}

// const handlePickerName = (e: AnyObj) => {
//   if (e.detail.value >= 0) {
//     selectEntity.value = e.detail.value
//   }
// }

const handlePickerCountry = (e: AnyObj) => {
  if (e.detail.value >= 0) {
    selectCountry.value = e.detail.value
  }
}

const handlePickerDocumentType = (e: AnyObj) => {
  if (e.detail.value >= 0) {
    selectDocumentType.value = e.detail.value
  }
}

const handleSelectCamera = (index: number) => {
  uni.chooseImage({
    count: 1, //默认9
    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ['camera'], //从相册选择
    success: function (res) {
      console.log(res.tempFilePaths)
      formData.value[index].uri = res.tempFilePaths[0]
    }
  })
}

const handleSelectPic = (index: number) => {
  uni.chooseImage({
    count: 1, //默认9
    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album'], //从相册选择
    success: function (res) {
      console.log(res.tempFilePaths)
      formData.value[index].uri = res.tempFilePaths[0]
    }
  })
}

const handleCloseImg = (index: number) => {
  formData.value[index].uri = ''
}

const handleSave = async () => {
  if (!investorName.value) {
    uni.showToast({
      icon: 'none',
      title: 'Please input Investor Name'
    })
    return
  }
  if (!formData.value[0].uri) {
    uni.showToast({
      icon: 'none',
      title: 'Please Upload document 1 Front '
    })
    return
  }
  if (!formData.value[2].uri) {
    uni.showToast({
      icon: 'none',
      title: 'Please Upload live photo'
    })
    return
  }
  let params = {
    countryCode: countryList.value[selectCountry.value].abb2,
    docOneType: documentType.value[selectCountry.value],
    entityType: investorType.value[selectType.value]?.value,
    entityName: investorName.value
    // entityId: entityList.value[selectEntity.value].id
  }
  console.log(params)
  uni.showLoading({
    title: 'Loading...',
    mask: true
  })
  uni.uploadFile({
    url: `${VITE_APP_BASE_URL}/api/v1/account/kyc-verify`,
    files: formData.value,
    formData: params,
    header: {
      token: uni.getStorageSync('userInfo')?.token || ''
    },
    success: (uploadFileRes) => {
      uni.hideLoading()
      const data = JSON.parse(uploadFileRes.data)
      console.log(data)

      if (data?.success) {
        uni.showToast({
          icon: 'none',
          title: ''
        })
      } else {
        uni.showToast({
          icon: 'none',
          title: data?.error || data?.message
        })
      }
    }
  })
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="verification">
      <view class="title">{{ $t('setting.setting14') }}</view>
      <view class="form">
        <view class="item">
          <view class="name">{{ $t('setting.setting5') }}</view>
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
          <view class="name">{{ $t('setting.setting6') }}</view>
          <view class="input">
            <input v-model="investorName" placeholder="Please input Investor Name" />
          </view>
        </view>
        <!-- <view class="item">
          <view class="name">Entity Name</view>
          <view class="input">
            <picker @change="handlePickerName" :value="selectEntity" range-key="entityName" :range="entityList">
              <view class="picker flex justify-between align-center">
                <view>{{ entityList[selectEntity]?.entityName }}</view>
                <view>
                  <uni-icons type="bottom" color="#BE9670" size="14"></uni-icons>
                </view>
              </view>
            </picker>
          </view>
        </view> -->
        <view class="item">
          <view class="name">{{ $t('setting.setting7') }}</view>
          <view class="input">
            <picker
              @change="handlePickerCountry"
              :value="selectCountry"
              :range-key="lang ? 'en' : 'cn'"
              :range="countryList"
            >
              <view class="picker flex justify-between align-center">
                <view>{{ lang ? countryList[selectCountry]?.en : countryList[selectCountry]?.cn }}</view>
                <view>
                  <uni-icons type="bottom" color="#BE9670" size="14"></uni-icons>
                </view>
              </view>
            </picker>
          </view>
        </view>
        <view class="item">
          <view class="name">{{ $t('setting.setting8') }}</view>
          <view class="input">
            <picker @change="handlePickerDocumentType" :value="selectDocumentType" :range="documentType">
              <view class="picker flex justify-between align-center">
                <view>{{ documentType[selectDocumentType] }}</view>
                <view>
                  <uni-icons type="bottom" color="#BE9670" size="14"></uni-icons>
                </view>
              </view>
            </picker>
          </view>
        </view>
        <view class="item">
          <view class="name">{{ $t('setting.setting9') }}</view>
          <view class="upload">
            <template v-if="formData[0].uri">
              <image class="" :src="formData[0].uri" mode="heightFix"></image>
              <uni-icons class="close" type="close" color="#BE9670" size="18" @click="handleCloseImg(0)"></uni-icons>
            </template>
            <view class="flex justify-center align-center flex-direction" v-else @click="handleSelectPic(0)">
              <image class="img" src="../../static/icon/upload.png"></image>
              <view class="text">{{ $t('setting.setting10') }}</view>
            </view>
          </view>
          <view class="upload">
            <template v-if="formData[1].uri">
              <image class="" :src="formData[1].uri" mode="heightFix"></image>
              <uni-icons class="close" type="close" color="#BE9670" size="18" @click="handleCloseImg(1)"></uni-icons>
            </template>
            <view class="flex justify-center align-center flex-direction" v-else @click="handleSelectPic(1)">
              <image class="img" src="../../static/icon/upload.png"></image>
              <view class="text">{{ $t('setting.setting11') }}</view>
            </view>
          </view>
          <view class="upload">
            <template v-if="formData[2].uri">
              <image class="" :src="formData[2].uri" mode="heightFix"></image>
              <uni-icons class="close" type="close" color="#BE9670" size="18" @click="handleCloseImg(2)"></uni-icons>
            </template>
            <view class="flex justify-center align-center flex-direction" v-else @click="handleSelectCamera(2)">
              <image class="img" src="../../static/icon/photo.png"></image>
              <view class="text">{{ $t('setting.setting12') }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="btn" @click="handleSave"> {{ $t('setting.setting13') }} </view>
    </view>
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

  .form {
    .item {
      .name {
        color: #000;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        padding-bottom: 8rpx;
      }

      .input {
        height: 80rpx;
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
      }

      .upload {
        height: 266rpx;
        border-radius: 20rpx;
        border: 4rpx dashed #e8e8e8;
        background: #fbfafa;
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .close {
          position: absolute;
          right: 20rpx;
          top: 0;
        }

        .img {
          width: 140rpx;
          height: 140rpx;
        }

        .text {
          color: #828282;
          font-size: 28rpx;
          font-style: normal;
          font-weight: 400;
        }
      }

      .upload + .upload {
        margin-top: 30rpx;
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
