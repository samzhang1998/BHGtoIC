<script setup lang="ts">
import upload from './components/upload.vue'
import { wrapperEnv } from '@/utils/env'
import { useDownLoad } from '@/hooks/useDownLoad'
const { downloadFileUrl } = useDownLoad()
// import { useLocale } from '@/hooks/useLocale'
// const { t } = useLocale()
const { VITE_APP_ReInvestment_URL } = wrapperEnv

const eId = ref('')
const fId = ref('')
const cId = ref('')
const fileList = ref<AnyObj[]>([])
const isShowToast = ref<boolean>(false)

onLoad((options) => {
  console.log('🚀 ~ file: investmentDetails.vue:14 ~ onLoad ~ options:', options)
  eId.value = options?.eId || ''
  fId.value = options?.fId || ''
  cId.value = options?.cId || ''
})

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})

const handleSave = async () => {
  if (fileList.value.length <= 0) return
  const list = fileList.value.map((item) => {
    return item.url
  })
  console.log(list)

  const params = {
    fileUrl: list,
    entityId: eId.value,
    clientId: cId.value,
    fundId: fId.value
  }

  const [e, r] = await api.reInvestment(params)
  console.log(r)

  if (!e && r) {
    if (r?.success) {
      isShowToast.value = true
      setTimeout(() => {
        isShowToast.value = false
        uni.navigateBack()
      }, 2000)
    }
  }
}

const saveFileList = (list: AnyObj[]) => {
  fileList.value = list
}

const handleDeleteItem = (index: number) => {
  fileList.value.splice(index, 1)
}

const handleDownPdf = () => {
  downloadFileUrl(VITE_APP_ReInvestment_URL)
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="verification">
      <view class="title">{{ $t('inv.inv46') }}</view>
      <view class="form">
        <view class="item">
          <view class="name">{{ $t('inv.inv47') }}</view>
          <view class="download">
            <view>{{ $t('inv.inv48') }}</view>
            <view @click="handleDownPdf">
              <image class="common-icon" src="../../static/icon/download.png"></image>
            </view>
          </view>
          <view class="upload-box">
            <upload :entityId="eId" :fundId="fId" @saveList="saveFileList"></upload>
          </view>
        </view>

        <view class="item">
          <view class="name" v-if="fileList.length > 0">{{ $t('inv.inv49') }}</view>
          <view class="upload-list" v-for="(item, index) in fileList" :key="index">
            <view>{{ item.name }}</view>
            <view class="close" @click="handleDeleteItem(index)">
              <uni-icons type="closeempty" :size="12" color="#828282"></uni-icons>
            </view>
          </view>
        </view>
      </view>
      <view class="btn" @click="handleSave"> {{ $t('inv.inv50') }} </view>
    </view>
    <Toast :is-show="isShowToast"></Toast>
  </view>
</template>
<style lang="scss" scoped>
.verification {
  padding: 0 40rpx;
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

      .download {
        color: #828282;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 600;
        display: flex;
        align-items: center;
        padding-bottom: 30rpx;
      }

      .common-icon {
        margin-left: 30rpx;
        width: 20rpx;
        height: 20rpx;
        display: block;
      }

      .upload-list {
        color: #4f4f4f;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 600;
        display: flex;
        align-items: center;
      }

      .close {
        margin-left: 30rpx;
      }

      .upload-box {
        height: 266rpx;
      }

      .upload {
        height: 266rpx;
        border-radius: 20rpx;
        border: 4rpx dashed #e8e8e8;
        background: #fbfafa;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

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
    position: fixed;
    left: 45rpx;
    bottom: 200rpx;
  }
}
</style>
