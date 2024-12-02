<script setup lang="ts">
import { getFilenameFromUrl } from '@/utils'
import dayjs from 'dayjs'
import { useDownLoad } from '@/hooks/useDownLoad'
const { downloadFileUrl } = useDownLoad()
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
const aId = ref('')
const audit = ref<AnyObj>({})
onLoad((options) => {
  aId.value = options?.aId || ''
})

onShow(() => {
  getDetail()
})

const handleSave = () => {
  let url = ''
  let type = 'navigateTo'
  if (audit.value.auditType === 'Re-Investment Request') {
    const reData = audit.value?.reShow || {}
    url = `/pages/investment/reInvestment?eId=${reData.entityId}&fId=${reData.fundId}&cId=${reData.clientId}`
  } else if (audit.value.auditType === 'Entity Update') {
    type = 'reLaunch'
    url = `/pages/investment/index?eId=${audit.value?.entityId}`
  } else if (audit.value.auditType === 'Client Update') {
    type = 'reLaunch'
    url = `/pages/user/index?uId=${audit.value?.creator}`
  }
  if (type === 'navigateTo') {
    uni.navigateTo({
      url: url
    })
  } else {
    uni.reLaunch({
      url: url
    })
  }
}

async function getDetail() {
  let params = {
    id: aId.value
  }
  const [e, r] = await api.getAuditDetail(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: detail.vue:32 ~ getDetail ~ r:', r?.data)
      if (r.data?.entityContent && r?.data.auditType !== 'Re-Investment Request') {
        r.data.entityContent = JSON.parse(r.data?.entityContent)
        let entriesList: any = Object.entries(r.data.entityContent)
        const list = []
        for (let i = 0; i < entriesList.length; i++) {
          let select = Object.entries(entriesList[i][1])
          let item = {
            name: `Current ${entriesList[i][0]}`,
            value: select[0][0]
          }
          let item2 = {
            name: `New ${entriesList[i][0]}`,
            value: select[0][1]
          }
          list.push(item)
          list.push(item2)
        }
        console.log(list)
        r.data.entityContentShow = list
      } else if (r?.data.auditType === 'Re-Investment Request') {
        r.data.reShow = JSON.parse(r.data.entityContent)
      }
      audit.value = r?.data || {}
      console.log(audit.value)
    }
  }
}

const handleShowFile = (item: string) => {
  downloadFileUrl(item)
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="system">
      <view class="title">{{ audit.auditType }}</view>
      <view class="sub-title">{{ $t('submission.submission2') }}</view>
      <view class="list">
        <view class="item">
          <view class="left">{{ $t('submission.submission3') }}</view>
          <view class="right">{{ audit.auditType }}</view>
        </view>
        <view class="item">
          <view class="left">{{ $t('submission.submission4') }}</view>
          <view class="right">{{ audit?.createdAt ? dayjs(audit.createdAt).format('YYYY.MM.DD') : '' }}</view>
        </view>
        <view class="item">
          <view class="left">{{ $t('submission.submission5') }}</view>
          <view class="right">{{ audit.status }}</view>
        </view>
      </view>
      <view class="sub-title">{{ $t('submission.submission6') }}</view>
      <view class="list" v-if="audit?.auditType !== 'Re-Investment Request'">
        <view class="item" v-for="(item, index) in audit.entityContentShow" :key="index">
          <view class="left">{{ item.name }}</view>
          <view class="right">{{ item.value }}</view>
        </view>
      </view>
      <view class="list" v-else>
        <!-- <view class="item" v-for="(item, index) in audit.reShow" :key="index"> -->
        <view class="item" v-for="(item, index) in audit.reShow.fileUrl" :key="index">
          <view class="left">{{ $t('submission.submission7') }}</view>
          <view class="right width-70" @click="handleShowFile(item)">{{ item ? getFilenameFromUrl(item) : '' }}</view>
        </view>
      </view>
      <view class="btn" @click="handleSave" v-if="audit.status === 'Rejected'">
        {{ $t('submission.submission8') }}
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
  }

  .list {
    border-radius: 20rpx;
    background: #fff;
    box-shadow: 0px 8rpx 76rpx 0px rgba(189, 189, 189, 0.25);
    padding: 0 30rpx;
    margin: 10rpx 0 40rpx;

    .item {
      height: 80rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        color: #000;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
        width: 30%;
      }

      .right {
        color: #969696;
        font-size: 24rpx;
        font-style: normal;
        font-weight: 400;
        text-align: right;
      }

      .width-70 {
        width: 70%;
        color: #be9670;
      }
    }

    .item + .item {
      border-top: 2rpx solid #f4f4f4;
    }
  }

  .btn {
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
    margin-top: 40rpx;
    // position: fixed;
    // left: 45rpx;
    // bottom: 200rpx;
  }
}
</style>
