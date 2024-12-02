<script setup lang="ts">
import chose from '@/static/icon/chose.png'
import selected from '@/static/icon/chose-selected.png'
import dayjs from 'dayjs'
import { useLocale } from '@/hooks/useLocale'
import { useUser } from '@/hooks/useUser'
const { token, roles } = useUser()
const { langStatus } = useLocale()

const navBar = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: true
})

const showUp = ref(false)

const notList = ref<AnyObj[]>([])
const pageNum = ref(1)
const pageSize = ref(20)
const isAll = ref(false)
const userRole = ref('')

onLoad(() => {
  if (token.value) {
    userRole.value = roles.value.includes('client') ? 'client' : 'visitor'
  }
})

onShow(() => {
  getNotify()
})

const handleShowDetail = (item: AnyObj) => {
  uni.navigateTo({
    url: `/pages/notification/detail?nId=${item.id}`
  })
}

onPageScroll((e) => {
  if (e.scrollTop > 150) {
    showUp.value = true
  } else {
    showUp.value = false
  }
})

async function getNotify() {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
    // readAll: true
  }
  const [e, r] = await api.getNotify(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: NavBar.vue:62 ~ getNotify ~ r:', r?.data?.list)
      if (pageNum.value === 1) {
        r.data?.list.forEach((v: AnyObj) => {
          v['selected'] = false
        })
        notList.value = r.data?.list || []
      } else {
        if (r.data?.list.length <= 0) {
          pageNum.value = pageNum.value - 1
          uni.showToast({
            icon: 'none',
            title: `There's no more`
          })
        } else {
          r.data?.list.forEach((v: AnyObj) => {
            v['selected'] = false
          })
          notList.value = notList.value.concat(r.data?.list || [])
        }
      }
    }
  }
}

const handleSelected = (item: number) => {
  // console.log('🚀 ~ handleSelected ~ item:', notList.value[item])
  notList.value[item].selected = !notList.value[item].selected
  isAll.value = false
}

const handleSelectedAll = () => {
  isAll.value = !isAll.value
  notList.value.map((item: AnyObj) => {
    item.selected = isAll.value
    return item
  })
}

const handleAllRead = async () => {
  let idList: any = []
  notList.value.map((item: AnyObj) => {
    if (!item.readFlag && item.selected) {
      idList.push(item.id)
    }
  })
  if (idList.length <= 0) {
    uni.showToast({
      icon: 'none',
      title: `Please select unread messages`
    })
    return
  }
  let params = {
    idList: idList
  }
  const [e, r] = await api.readAll(params)
  if (!e && r) {
    if (r?.success) {
      pageNum.value = 1
      notList.value = []
      getNotify()
    }
  }
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="notification">
      <view class="title">{{ $t('notification.notification1') }}</view>
      <view class="list" v-if="userRole === 'client'">
        <view class="item">
          <view class="selected">
            <image class="sel-img1" :src="chose" @click="handleSelectedAll"></image>
            <image class="sel-img2" :src="selected" v-if="isAll"></image>
          </view>
          <view class="left text-ok" @click="handleAllRead"> {{ $t('notification.notification4') }} </view>
        </view>
        <view class="item" v-for="(item, index) in notList" :key="index">
          <view class="flex align-center">
            <view class="selected">
              <block v-if="!item.readFlag">
                <image class="sel-img1" :src="chose" @click="handleSelected(index)"></image>
                <image class="sel-img2" :src="selected" v-if="item.selected"></image>
              </block>
            </view>
            <view
              :class="item.readFlag ? 'right text-cut text-no' : 'right text-cut text-ok'"
              @click="handleShowDetail(item)"
            >
              {{ langStatus ? item.titleCn || item.title : item.title }}</view
            >
          </view>
          <view class="left" @click="handleShowDetail(item)">
            {{ item?.createdAt ? dayjs(item?.createdAt).format('YYYY.MM.DD') : '' }}
          </view>
        </view>
      </view>
      <view class="list" v-else>
        <view class="item" v-for="(item, index) in notList" :key="index">
          <view class="flex align-center">
            <view class="selected"></view>
            <view
              :class="item.readFlag ? 'right text-cut text-no' : 'right text-cut text-ok'"
              @click="handleShowDetail(item)"
            >
              {{ langStatus ? item.titleCn || item.title : item.title }}</view
            >
          </view>
          <view class="left" @click="handleShowDetail(item)">
            {{ item?.createdAt ? dayjs(item?.createdAt).format('YYYY.MM.DD') : '' }}
          </view>
        </view>
      </view>
    </view>
    <NoData v-if="notList.length <= 0"></NoData>
    <ScrollTop v-show="showUp"></ScrollTop>
  </view>
</template>
<style lang="scss" scoped>
.notification {
  padding: 0 40rpx;
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
        color: #969696;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
      }

      .right {
        padding-left: 34rpx;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 400;
      }

      .text-ok {
        color: #be9670;
      }

      .text-no {
        color: #969696;
      }

      .selected {
        width: 24rpx;
        height: 24rpx;
        position: relative;
        z-index: 1;
      }

      .sel-img1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 24rpx;
        height: 24rpx;
        z-index: 2;
      }

      .sel-img2 {
        position: absolute;
        top: 6rpx;
        left: 6rpx;
        width: 12rpx;
        height: 12rpx;
        z-index: 3;
      }
    }

    .item + .item {
      border-top: 2rpx solid #f4f4f4;
    }
  }
}
</style>
