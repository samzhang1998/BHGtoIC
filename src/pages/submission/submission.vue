<script setup lang="ts">
import dayjs from 'dayjs'
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})

const auditList = ref<AnyObj[]>([])
const pageNum = ref(1)
const pageSize = ref(20)
const showUp = ref(false)

onMounted(() => {
  getAudit()
})

onReachBottom(() => {
  pageNum.value = pageNum.value + 1
  getAudit()
})

onPageScroll((e) => {
  if (e.scrollTop > 150) {
    showUp.value = true
  } else {
    showUp.value = false
  }
})

const handleToDetail = (item: AnyObj) => {
  console.log(item)
  uni.navigateTo({
    url: `/pages/submission/detail?aId=${item.id}`
  })
}

async function getAudit() {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }
  const [e, r] = await api.getAudit(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: submission.vue:42 ~ getAudit ~ r:', r.data.list)
      if (pageNum.value === 1) {
        auditList.value = r.data?.list || []
      } else {
        if (r.data?.list.length <= 0) {
          pageNum.value = pageNum.value - 1
          uni.showToast({
            icon: 'none',
            title: `There's no more`
          })
        } else {
          auditList.value = auditList.value.concat(r.data?.list || [])
        }
      }
    }
  }
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="submission">
      <view class="title">{{$t('submission.submission1')}}</view>
      <view class="list">
        <view class="item" v-for="(item, index) in auditList" :key="index" @click="handleToDetail(item)">
          <view class="left">
            {{ dayjs(item.updatedAt).format('YYYY.MM.DD') }}
          </view>
          <view class="center"> {{ item.auditType }}</view>
          <view :class="item.status === 'Rejected' ? 'right text-red' : 'right'">
            {{ item.status === 'Pending approval' ? 'Processing' : item.status }}
          </view>
        </view>
      </view>
    </view>
    <NoData v-if="auditList.length <= 0"></NoData>
    <ScrollTop v-show="showUp"></ScrollTop>
  </view>
</template>
<style lang="scss" scoped>
.submission {
  padding: 0 40rpx 40rpx;
  .title {
    color: #333;
    font-size: 44rpx;
    font-style: normal;
    font-weight: 700;
    padding-bottom: 20rpx;
  }

  .list {
    border-radius: 20rpx;
    background: #fff;
    box-shadow: 0px 8rpx 76rpx 0px rgba(189, 189, 189, 0.25);
    padding: 0 30rpx;

    .item {
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        color: #12151b;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
        width: 130rpx;
      }

      .center {
        width: 50%;
        text-align: left;
        color: #be9670;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 400;
      }

      .right {
        text-align: right;
        width: 130rpx;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 400;
        color: #969696;
      }

      .text-red {
        color: #ba0000;
      }
    }

    .item + .item {
      border-top: 2rpx solid #f4f4f4;
    }
  }
}
</style>
