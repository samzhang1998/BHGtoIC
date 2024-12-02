<script setup lang="ts">
import dayjs from 'dayjs'
import { getFilenameFromUrl } from '@/utils'
import { useDownLoad } from '@/hooks/useDownLoad'
import { useLocale } from '@/hooks/useLocale'
const { langStatus } = useLocale()
const navBar = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: true
})
const nId = ref('')
const notify = ref<AnyObj>({})
const { downloadFileUrl } = useDownLoad()

onLoad((options) => {
  nId.value = options?.nId || ''
})

onShow(() => {
  getDetail()
})

async function getDetail() {
  let params = {
    id: nId.value
  }
  const [e, r] = await api.getNotifyDetail(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: detail.vue:32 ~ getDetail ~ r:', r?.data)
      notify.value = r?.data || {}
    }
  }
}

const handleDown = () => {
  downloadFileUrl(notify.value.file)
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="system">
      <view class="title">{{ $t('notification.notification2') }}</view>
      <view class="sub-title">{{ notify?.createdAt ? dayjs(notify.createdAt).format('YYYY.MM.DD') : '' }}</view>
      <view class="sub-title text-center">{{ langStatus ? notify.titleCn || notify.title : notify.title }}</view>
      <view class="text">
        {{ langStatus ? notify.messageCn || notify.message : notify.message }}
      </view>
      <view class="sub-title" v-if="notify?.file">{{ $t('notification.notification3') }}</view>
      <view class="download" v-if="notify?.file">
        <view class="left">{{ getFilenameFromUrl(notify?.file) }}</view>
        <view class="right" @click="handleDown">
          <image class="common-icon" src="../../static/icon/download.png"></image>
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
    font-size: 34rpx;
    font-style: normal;
    font-weight: 400;
    padding-bottom: 20rpx;
  }

  .text {
    color: #828282;
    font-size: 28rpx;
    font-weight: 400;
    text-indent: 48rpx;
    line-height: 1.6;
    min-height: 300rpx;
    border: 2rpx solid #eee;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
  }
  .download {
    color: #828282;
    font-size: 26rpx;
    font-style: normal;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      width: 80%;
    }
    .right {
      width: 10%;
    }
  }
  .common-icon {
    margin-left: 30rpx;
    width: 20rpx;
    height: 20rpx;
    display: block;
  }
}
</style>
