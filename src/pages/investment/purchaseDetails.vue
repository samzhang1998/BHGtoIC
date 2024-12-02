<script setup lang="ts">
import dayjs from 'dayjs'
import { useDownLoad } from '@/hooks/useDownLoad'
import { useMoney } from '@/hooks/useMoney'
import { useLocale } from '@/hooks/useLocale'
const { langStatus } = useLocale()
const { downloadFileUrl } = useDownLoad()
const { moneyFormant } = useMoney()

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
const pId = ref('')
const fId = ref('')
const PurchasedFundInfo = ref<AnyObj>({})
onLoad((options) => {
  console.log('🚀 ~ file: investmentDetails.vue:14 ~ onLoad ~ options:', options)
  pId.value = options?.pId || ''
  fId.value = options?.fId || ''
})

onShow(() => {
  getPurchasedFundDetail()
  // getFundsDetail()
})

const handleDownLoad = () => {
  downloadFileUrl(PurchasedFundInfo.value.unitCertificate)
}

async function getPurchasedFundDetail() {
  let params = {
    id: pId.value
  }
  const [e, r] = await api.getPurchasedFundDetail(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: investmentDetails.vue:42 ~ getPurchasedFundDetail ~ r:', r?.data)
      PurchasedFundInfo.value = r?.data
    }
  }
}

// async function getFundsDetail() {
//   let params = {
//     id: fId.value
//   }
//   const [e, r] = await api.getFundsDetail(params)
//   if (!e && r) {
//     if (r?.success) {
//       console.log('🚀 ~ file: investmentDetails.vue:42 ~ getFundsDetail ~ r:', r?.data)
//       fundsInfo.value = r?.data || {}
//     }
//   }
// }
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="investment">
      <view class="title">{{ $t('inv.inv51') }}</view>
      <view class="item">
        <view class="fund-title">
          <view class="name">{{ PurchasedFundInfo?.fundName }}</view>
          <view class="flex justify-between align-center">
            <view class="text">{{ $t('inv.inv52') }}</view>
            <view @click="handleDownLoad">
              <image class="common-icon" src="../../static/icon/download.png"></image>
            </view>
          </view>
        </view>
        <view class="fund-info">
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv53') }}</view>
            <view class="text">{{ PurchasedFundInfo?.fundName }}</view>
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv54') }}</view>
            <view class="text">
              {{
                PurchasedFundInfo.transactionDate ? dayjs(PurchasedFundInfo.transactionDate).format('YYYY.MM.DD') : ''
              }}
            </view>
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv55') }}</view>
            <view class="text">{{ moneyFormant(PurchasedFundInfo?.purchasedAmount) }}</view>
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv56') }}</view>
            <view class="text">
              {{
                PurchasedFundInfo.purchaseEndDate ? dayjs(PurchasedFundInfo.purchaseEndDate).format('YYYY.MM.DD') : ''
              }}
            </view>
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv57') }}</view>
            <view class="text">{{ moneyFormant(PurchasedFundInfo?.currentTotalReturn) }}</view>
          </view>
        </view>
        <view class="common-info">
          <view class="flex justify-between align-center">
            <view class="common-title">{{ $t('inv.inv58') }}</view>
            <view class="more"> </view>
          </view>
        </view>
        <view class="common-table">
          <view class="th flex justify-between align-center">
            <view class="tl">{{ $t('inv.inv59') }}</view>
            <view class="tl">{{ $t('inv.inv60') }}</view>
          </view>
          <view
            class="td flex justify-between align-center"
            v-for="(item, index) in PurchasedFundInfo.dividendHistory"
            :key="index"
          >
            <view class="tl">{{ item.dividendDate ? dayjs(item.dividendDate).format('YYYY.MM.DD') : '' }}</view>
            <view class="tl">{{ moneyFormant(item.dividendAmount) }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.investment {
  padding: 0 40rpx 40rpx;

  .title {
    color: #333;
    font-size: 44rpx;
    font-style: normal;
    font-weight: 700;
    padding-bottom: 20rpx;
  }

  .item {
    min-height: 1088rpx;
    border-radius: 20rpx;
    background: #fff;
    box-shadow: 0 8rpx 40rpx 0 rgba(46, 58, 87, 0.15);
    position: relative;
    overflow: hidden;
    padding: 30rpx 0;

    .fund-title {
      padding: 0 60rpx 30rpx;
      border-bottom: 1rpx solid #e0e0e0;

      .name {
        color: #be9670;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 600;
        padding-bottom: 28rpx;
      }

      .common-icon {
        width: 20rpx;
        height: 20rpx;
        display: block;
      }

      .text {
        color: #4f4f4f;
        font-size: 24rpx;
        font-style: normal;
        font-weight: 700;
      }
    }

    .fund-info {
      padding: 30rpx 60rpx;
      border-bottom: 1rpx solid #e0e0e0;
      display: flex;
      flex-wrap: wrap;

      .fund-item {
        width: 50%;
        margin-bottom: 30rpx;

        .name {
          color: #4f4f4f;
          font-size: 24rpx;
          font-style: normal;
          font-weight: 700;
        }

        .text {
          color: #be9670;
          font-size: 24rpx;
          font-style: normal;
          font-weight: 500;
        }
      }
    }

    .common-info {
      padding: 20rpx 60rpx;
      border-bottom: 1rpx solid #e0e0e0;
      .common-title {
        color: #4f4f4f;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 700;
      }
      .p-b-20 {
        padding-bottom: 20rpx;
      }

      .common-text {
        color: #828282;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 400;
      }
    }

    .common-table {
      padding: 0 50rpx;

      .th {
        height: 60rpx;
        border-bottom: 1rpx solid #e0e0e0;
        color: #4f4f4f;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 500;
        padding: 0 10rpx;
      }

      .td {
        height: 60rpx;
        color: #000;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 400;
        padding: 0 10rpx;
        border-bottom: 1rpx solid #e0e0e0;
      }

      .tl {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .item::after {
    content: '';
    width: 18rpx;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: var(--Linear, linear-gradient(180deg, #be9670 0%, rgba(190, 150, 112, 0.67) 100%));
  }
}
</style>
