<script setup lang="ts">
import dayjs from 'dayjs'
import { useInvestmentStoreHook } from '@/store/modules/investment'
import { useDownLoad } from '@/hooks/useDownLoad'
import { useMoney } from '@/hooks/useMoney'
import { useLocale } from '@/hooks/useLocale'
import { api } from '../../api/index'
const { langStatus } = useLocale()
const useInvestmentStore = useInvestmentStoreHook()

const { investmentInfo } = storeToRefs(useInvestmentStore)
const { downloadFile } = useDownLoad()
const { moneyFormant } = useMoney()

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
const eId = ref('')
const fId = ref('')
const cId = ref('')
const InvestmentInfo = ref<AnyObj[]>([])
const fundsInfo = ref<AnyObj>({})
const PurchasedFundInfo = ref<AnyObj[]>([])
const showMoreInvestment = ref(true)
const showMorePurchasedFund = ref(true)
onLoad((options) => {
  console.log('🚀 ~ file: investmentDetails.vue:14 ~ onLoad ~ options:', options)
  eId.value = options?.eId || ''
  fId.value = options?.fId || ''
  cId.value = options?.cId || ''
})

onShow(() => {
  getFundsDetail()
  getInvestmentDetail()
  getPurchasedFundByEntityId()
})

const handleChangeShow = (str: string) => {
  if (str === 'inv') {
    showMoreInvestment.value = !showMoreInvestment.value
  } else {
    showMorePurchasedFund.value = !showMorePurchasedFund.value
  }
}

const handleToDetail = (item: AnyObj) => {
  uni.navigateTo({
    url: `/pages/investment/purchaseDetails?pId=${item.id}&fId=${item.fundId}`
  })
}

const handleReInvestment = () => {
  uni.navigateTo({
    url: `/pages/investment/reInvestment?eId=${eId.value}&fId=${fId.value}&cId=${cId.value}`
  })
}

async function getInvestmentDetail() {
  let params = {
    entityId: eId.value,
    fundId: fId.value
  }
  const [e, r] = await api.getInvestmentDetail(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: investmentDetails.vue:28 ~ getDetail ~ r:', r?.data)
      InvestmentInfo.value = r?.data || []
    }
  }
}

async function getPurchasedFundByEntityId() {
  let params = {
    entityId: eId.value,
    fundId: fId.value,
    pageNum: 1,
    pageSize: 100000
  }
  const [e, r] = await api.getPurchasedFundAll(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: investmentDetails.vue:42 ~ getPurchasedFundByEntityId ~ r:', r?.data?.list)
      PurchasedFundInfo.value = r?.data?.list || []
    }
  }
}

async function getFundsDetail() {
  let params = {
    id: fId.value
  }
  const [e, r] = await api.getFundsDetail(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: investmentDetails.vue:42 ~ getFundsDetail ~ r:', r?.data)
      fundsInfo.value = r?.data || {}
    }
  }
}

const handleDownLoad = async (item: AnyObj) => {
  let params = {
    date: dayjs(item.paymentDate).subtract(1, 'month').format('YYYY-MM-DD'),
    id: item.idList.join(',')
  }
  console.log('🚀 ~ file: detail.vue:383 ~ handleDownloadEmailById ~ params:', params)
  downloadFile(`/beaver-admin/purchased-funds/exportPdf?date=${params.date}&id=${params.id}&template=1`)
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="investment">
      <view class="title">{{ $t('inv.inv22') }}</view>
      <view class="item">
        <view class="fund-title">
          <view class="name">{{ langStatus ? fundsInfo?.nameCN || fundsInfo?.name : fundsInfo?.name }}</view>
        </view>
        <view class="fund-info">
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv23') }}</view>
            <view class="text">{{
              langStatus ? fundsInfo?.fundTypeCN || fundsInfo?.fundType : fundsInfo?.fundType
            }}</view>
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv24') }}</view>
            <view class="text">{{ fundsInfo?.bprojectDurationMonth }} months</view>
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv25') }}</view>
            <view class="text">{{ moneyFormant(fundsInfo?.purchaseMinAmount) }} {{ fundsInfo?.currency }}</view>
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv26') }}</view>
            <view class="text"
              >{{
                fundsInfo?.byearlyReturnRate
                  ? (fundsInfo?.byearlyReturnRate * 100).toFixed(2)
                  : fundsInfo?.byearlyReturnRate
              }}%</view
            >
          </view>
          <view class="fund-item">
            <view class="name">{{ $t('inv.inv27') }}</view>
            <view class="text">{{
              langStatus ? fundsInfo?.investmentTypeCN || fundsInfo?.investmentType : fundsInfo?.investmentType
            }}</view>
          </view>
        </view>
        <view class="common-info">
          <view class="common-title p-b-20">{{ $t('inv.inv28') }}</view>
          <view class="common-text">{{ $t('inv.inv29') }}: {{ moneyFormant(investmentInfo.purchasedAmount) }}</view>
          <view class="common-text">{{ $t('inv.inv30') }}: {{ moneyFormant(investmentInfo.currentReturn) }}</view>
          <view class="common-text">{{ $t('inv.inv31') }}: {{ moneyFormant(investmentInfo.totalReturn) }}</view>
        </view>
        <view class="common-info">
          <view class="flex justify-between align-center">
            <view class="common-title">{{ $t('inv.inv32') }}</view>
            <view class="more" @click="handleChangeShow('inv')">
              {{ showMoreInvestment ? $t('inv.inv38') : $t('inv.inv37') }}
              <uni-icons :type="showMoreInvestment ? 'bottom' : 'top'" size="12" color="#BE9670"></uni-icons>
            </view>
          </view>
        </view>
        <view class="common-table" v-if="showMoreInvestment">
          <view class="th flex justify-between align-center">
            <view class="tl-4">{{ $t('inv.inv33') }}</view>
            <view class="tl-4">{{ $t('inv.inv34') }}</view>
            <view class="tl-4">{{ $t('inv.inv35') }}</view>
            <view class="tl-4">{{ $t('inv.inv61') }}</view>
            <view class="ta">{{ $t('inv.inv36') }}</view>
          </view>
          <view class="td flex justify-between align-center" v-for="(item, index) in InvestmentInfo" :key="index">
            <view class="tl-4">{{ item.paymentDate ? dayjs(item.paymentDate).format('YYYY.MM.DD') : '' }}</view>
            <view class="tl-4">{{ moneyFormant(item.investmentAmount) }}</view>
            <view class="tl-4">{{ moneyFormant(item.currentReturn) }}</view>
            <view class="tl-4">{{ moneyFormant(item.closingBalance) }}</view>
            <view class="ta" @click="handleDownLoad(item)">
              <image class="common-icon" src="../../static/icon/download.png"></image>
            </view>
          </view>
        </view>
        <view class="common-info">
          <view class="flex justify-between align-center">
            <view class="common-title">{{ $t('inv.inv39') }}</view>
            <view class="more" @click="handleChangeShow('pur')">
              {{ showMorePurchasedFund ? $t('inv.inv38') : $t('inv.inv37') }}
              <uni-icons :type="showMorePurchasedFund ? 'bottom' : 'top'" size="12" color="#BE9670"></uni-icons>
            </view>
          </view>
        </view>
        <view class="common-table" v-if="showMorePurchasedFund">
          <view class="th flex justify-between align-center">
            <view class="tl-3">{{ $t('inv.inv40') }}</view>
            <view class="tl-3">{{ $t('inv.inv41') }}</view>
            <view class="tl-3">{{ $t('inv.inv42') }}</view>
            <view class="ta">{{ $t('inv.inv43') }}</view>
          </view>
          <view class="td flex justify-between align-center" v-for="(item, index) in PurchasedFundInfo" :key="index">
            <view class="tl-3">{{ moneyFormant(item.purchasedAmount) }}</view>
            <view class="tl-3">
              {{ item.purchaseStartDate ? dayjs(item.purchaseStartDate).format('YYYY.MM.DD') : '' }}
            </view>
            <view class="tl-3">{{ item.purchaseEndDate ? dayjs(item.purchaseEndDate).format('YYYY.MM.DD') : '' }}</view>
            <view class="ta">
              <view class="detail" @click="handleToDetail(item)">{{ $t('inv.inv45') }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="btn" @click="handleReInvestment" v-if="fundsInfo.bfundCategory !== 'Direct'">
        {{ $t('inv.inv44') }}
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
          font-size: 22rpx;
          font-style: normal;
          font-weight: 700;
        }

        .text {
          color: #be9670;
          font-size: 22rpx;
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

      .more {
        color: #be9670;
        font-size: 22rpx;
        font-style: normal;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .common-table {
      padding: 0 50rpx;

      .th {
        height: 60rpx;
        border-bottom: 1rpx solid #e0e0e0;
        color: #4f4f4f;
        font-size: 18rpx;
        font-style: normal;
        font-weight: 500;
        // background-color: red;
        // padding: 0 10rpx;
      }

      .td {
        height: 60rpx;
        color: #000;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 400;
        // padding: 0 10rpx;
        border-bottom: 1rpx solid #e0e0e0;
        // background-color: green;
      }

      .tl-4 {
        width: calc((100% - 50rpx) / 4);
        // display: flex;
        // justify-content: center;
        // align-items: center;
        text-align: center;
        // background-color: #000;
      }

      .tl-3 {
        width: calc((100% - 50rpx) / 3);
        display: flex;
        justify-content: center;
        align-items: center;
        // background-color: #000;
      }

      .ta {
        width: 50rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        // background-color: #000;
      }
      .detail {
        color: #be9670;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        position: relative;
      }

      .detail::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 2rpx;
        bottom: -2rpx;
        left: 0;
        background: #be9670;
      }
      .common-icon {
        width: 20rpx;
        height: 20rpx;
        display: block;
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

  .btn {
    margin-top: 52rpx;
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
  }
}
</style>
