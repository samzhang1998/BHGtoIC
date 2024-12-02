<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
const { langStatus } = useLocale()

import { useFunds } from './hooks/useFunds'

const productAll = ref<AnyObj[]>([])
const pageNum = ref(1)
const pageSize = ref(12)
const showUp = ref(false)
const { fundStatus, fundStatusStyle, getFundsAll } = useFunds()
const fundFilterStatus = ref('')
const fundLocation = ref('')
const fundPlatform = ref('')

onLoad((options) => {
  console.log('🚀 ~ onLaunch ~ options:', options)
  fundFilterStatus.value = options?.t || ''
  fundLocation.value = options?.l || ''
  fundPlatform.value = options?.p || ''
})

onMounted(() => {
  getAllProduct()
})

onReachBottom(() => {
  pageNum.value = pageNum.value + 1
  getAllProduct()
})

onPageScroll((e) => {
  if (e.scrollTop > 300) {
    showUp.value = true
  } else {
    showUp.value = false
  }
})

const navBar = ref({
  isBack: true,
  isNotification: true,
  backgroundColor: '#fff'
})

//查询过滤fund
const getAllProduct = async () => {
  let params: AnyObj = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    // fundStatusList: '0,1,2'
    fundStatusList: fundFilterStatus.value,
    stateId: fundLocation.value,
    company: fundPlatform.value
  }
  console.log('params', params)

  const data = await getFundsAll(params)
  console.log('🚀 ~ file: index.vue:24 ~ getAllProduct ~ data:', data?.list)
  if (pageNum.value === 1) {
    productAll.value = data?.list || []
  } else {
    if (data?.list.length <= 0) {
      pageNum.value = pageNum.value - 1
      uni.showToast({
        icon: 'none',
        title: `There's no more`
      })
    } else {
      productAll.value = productAll.value.concat(data?.list || [])
    }
  }
}

const handleToDetail = (item: AnyObj) => {
  uni.navigateTo({
    url: `/pages/index/detail?fId=${item.id}`
  })
}

const handleShowTime = () => {
  // .reverse()
  productAll.value = productAll.value.reverse()
}
</script>

<template>
  <view class="common-bg home">
    <NavBar v-bind="navBar"></NavBar>
    <view class="product">
      <view class="flex justify-between align-center">
        <view class="sub-title">{{ $t('home.filter1') }}</view>
        <view class="padding-r-40" @click="handleShowTime">
          <uni-icons type="list" color="#be9670" size="24"></uni-icons>
        </view>
      </view>
      <view class="scroll-all">
        <view class="item" v-for="(item, index) in productAll" :key="index" @click="handleToDetail(item)">
          <view class="banner">
            <image
              class="img"
              :src="langStatus ? item.coverCn || item.cover : item.cover"
              mode="aspectFill"
              :lazy-load="true"
            ></image>
            <view class="status" :class="fundStatusStyle(item?.fundStatus)" v-if="item?.fundStatus">
              <view class="text">{{ $t(fundStatus(item?.fundStatus)?.top) }}</view>
              <view class="text" v-if="$t(fundStatus(item?.fundStatus)?.bottom)">{{
                $t(fundStatus(item?.fundStatus)?.bottom)
              }}</view>
            </view>
          </view>
          <view class="bottom">
            <view class="title">
              {{ langStatus ? item.nameCN || item.name : item.name }}
            </view>
            <view class="desc texts-cut">{{
              langStatus ? item.descriptionCN || item.description : item.description
            }}</view>
          </view>
        </view>
      </view>
    </view>
    <NoData v-if="productAll.length <= 0"></NoData>

    <ScrollTop v-show="showUp"></ScrollTop>
  </view>
</template>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  // background: linear-gradient(0deg, rgba(214, 188, 165, 0.38) 2.31%, rgba(255, 255, 255, 0) 99.76%),
  //   linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 37.32%);
  // backdrop-filter: blur(1rpx);
  padding-bottom: 40rpx;

  .product {
    .sub-title {
      color: #333;
      font-size: 42rpx;
      font-style: normal;
      font-weight: 700;
      padding-left: 40rpx;
    }

    .padding-r-40 {
      padding-right: 40rpx;
    }

    .scroll-all {
      display: flex;
      flex-wrap: wrap;
      padding: 20rpx 20rpx;
      .item {
        // display: inline-block;
        width: calc((100% - 80rpx) / 2);
        min-height: 410rpx;
        border-radius: 20rpx;
        // box-shadow: 0 8rpx 32rpx 0 rgba(46, 58, 87, 0.15);
        // margin-left: 40rpx;
        margin: 0 20rpx 30rpx;
        overflow: hidden;
        border: 2rpx solid #e3e3e3;
        background: #fff;

        .banner {
          width: 100%;
          height: 240rpx;
          background: #eee;
          position: relative;
          .img {
            width: 100%;
            height: 250rpx;
            display: block;
          }

          .status {
            position: absolute;
            top: 0;
            left: 36rpx;
            z-index: 3;
            color: #fff;
            text-transform: capitalize;
            width: 80rpx;
            height: 40rpx;
            padding-top: 10rpx;
            // display: flex;
            // flex-wrap: wrap;
            // justify-content: center;
            // align-items: center;

            .text {
              text-align: center;
              width: 100%;
              font-size: 14rpx;
              font-style: normal;
              line-height: 16rpx;
              font-weight: 400;
            }
          }

          .status1 {
            background: #be9670;
          }

          .status2 {
            background: #47553f;
          }

          .status3 {
            background: #404f71;
          }

          .status4 {
            background: #555;
          }

          .status1::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 40rpx solid #be9670;
            border-right: 40rpx solid transparent;
            border-left: 40rpx solid transparent;
            position: absolute;
            bottom: -39rpx;
            z-index: -1;
            left: 0;
          }

          .status2::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 40rpx solid #47553f;
            border-right: 40rpx solid transparent;
            border-left: 40rpx solid transparent;
            position: absolute;
            bottom: -39rpx;
            left: 0;
          }

          .status3::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 40rpx solid #404f71;
            border-right: 40rpx solid transparent;
            border-left: 40rpx solid transparent;
            position: absolute;
            bottom: -39rpx;
            left: 0;
          }

          .status4::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 40rpx solid #555;
            border-right: 40rpx solid transparent;
            border-left: 40rpx solid transparent;
            position: absolute;
            bottom: -39rpx;
            left: 0;
          }
        }

        .bottom {
          white-space: normal;
          padding: 24rpx;
          text-align: center;
          color: #333;
          font-style: normal;
          font-weight: 500;
        }

        .title {
          font-size: 24rpx;
          height: 88rpx;
        }

        .desc {
          margin-top: 20rpx;
          color: #1a2b38;
          font-size: 20rpx;
          font-style: normal;
          font-weight: 300;
        }
      }
    }
  }
}
</style>
