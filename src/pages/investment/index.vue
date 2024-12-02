<script setup lang="ts">
import investmentAmount from '@/static/icon/investmentAmount.png'
import interest from '@/static/icon/interest.png'
import currentMonth from '@/static/icon/currentMonth.png'
import EditEntity from './components/EditEntity.vue'
import { EntityKey } from '@/symbols/entity'
import { useInvestmentStoreHook } from '@/store/modules/investment'
import { useEntity } from './hooks/useEntity'
import { useUser } from '@/hooks/useUser'
import { useMoney } from '@/hooks/useMoney'
import { useLocale } from '@/hooks/useLocale'
const { langStatus } = useLocale()
const useInvestmentStore = useInvestmentStoreHook()

const { emailListProcess, getEntityAll, getInvestmentAll } = useEntity()
const { moneyFormant } = useMoney()

const { token } = useUser()

const popup = ref<any>(null)
const isShowToast = ref<boolean>(false)

const entityList = ref<AnyObj[]>([])
const selectEntityId = ref('')
const showEntityId = ref('')
const selectEntityItem = ref<AnyObj>({})
const investmentList = ref<AnyObj[]>([])
const showUp = ref(false)

const investmentType = ref([
  {
    name: 'inv.inv4',
    value: 'On-Going'
  },
  {
    name: 'inv.inv5',
    value: 'Completed'
  }
])
const selectInvestmentType = ref(0)

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff'
})

onLoad((options) => {
  selectEntityId.value = options?.eId || ''
  nextTick(() => {
    if (selectEntityId.value) {
      popup.value.open()
    }
  })
})

onMounted(() => {
  if (token.value) {
    getEntityList()
  } else {
    // uni.showToast({
    //   icon: 'none',
    //   title: 'please Log in to view'
    // })
  }
})

onShow(() => {})

onPageScroll((e) => {
  if (e.scrollTop > 150) {
    showUp.value = true
  } else {
    showUp.value = false
  }
})

const getEntityList = async () => {
  const data = await getEntityAll()
  entityList.value = data || []
  console.log('🚀 ~ file: index.vue:21 ~ getEntityList ~ data:', entityList.value)
}

const handlePopupStatus = async (type: boolean, item?: AnyObj, close?: string) => {
  if (type) {
    popup.value.open()
  } else {
    if (close === 'open') {
      isShowToast.value = true
      setTimeout(() => {
        isShowToast.value = false
        popup.value.close()
      }, 1000)
    } else {
      popup.value.close()
    }

    // getEntityList()
  }
  if (item) {
    selectEntityId.value = item.id
    selectEntityItem.value = item
  }
}

const handleShowDetail = async (item: AnyObj) => {
  console.log('🚀 ~ file: index.vue:39 ~ handleShowDetail ~ item:', item)
  if (showEntityId.value === item.id) {
    showEntityId.value = ''
  } else {
    selectInvestmentType.value = 0
    showEntityId.value = item.id
    getInvData()
  }
}

const handleChangeType = (index: number) => {
  selectInvestmentType.value = index
  getInvData()
}

const handleToDetail = (item: AnyObj) => {
  useInvestmentStore.setInvestmentInfo(item)
  uni.navigateTo({
    url: `/pages/investment/investmentDetails?eId=${item.entityId}&fId=${item.fundId}&cId=${item.clientId}`
  })
}

async function getInvData() {
  investmentList.value = []
  const params = {
    pageNum: 1,
    pageSize: 10000,
    investmentEntityId: showEntityId.value
  }
  const data = await getInvestmentAll(params)
  // console.log(data?.list)
  let list = data?.list || []
  let list2 = list.filter((item: AnyObj) => {
    return item.status === investmentType.value[selectInvestmentType.value].value
  })
  console.log(list2)

  investmentList.value = list2
}

provide(EntityKey, { eId: selectEntityId, info: selectEntityItem })
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar">
      <template #content>
        <view class="bar-title act">{{ $t('inv.inv1') }}</view>
      </template>
    </NavBar>
    <view class="investment">
      <view
        :class="item.id === showEntityId ? 'item item-act' : 'item'"
        v-for="(item, index) in entityList"
        :key="index"
        @click="handleShowDetail(item)"
      >
        <view class="edit" @click.stop="handlePopupStatus(true, item)">
          <image class="icon" src="../../static/icon/edit2.png"></image>
        </view>
        <view class="name">{{ item.entityName }}</view>
        <view class="bhg">BHG ID: {{ item.bhgId }}</view>
        <view class="include">
          {{ $t('inv.inv2') }}
          <text class="text-BE9670">{{ item.investmentCount || 0 }}</text>
          {{ $t('inv.inv3') }}
        </view>
        <view class="include">Bsb：{{ item.bsb }}</view>
        <view class="include">Account Name：{{ item.accountName }}</view>
        <view class="include">Account Number：{{ item.accountNumber }}</view>
        <view class="email text-cut">{{ emailListProcess(item.emailList) }}</view>
        <view class="address">
          <uni-icons type="location-filled" color="#BE9670" size="18"></uni-icons>
          {{ item.addressLine }}
        </view>
        <!-- v-show="item.id === showEntityId" -->
        <view class="content-box">
          <view class="nav-list">
            <view
              :class="selectInvestmentType === index ? 'line line-act' : 'line'"
              v-for="(item, index) in investmentType"
              :key="index"
              @click.stop="handleChangeType(index)"
            >
              {{ $t(item.name) }}
            </view>
          </view>
          <view class="inv-box">
            <scroll-view class="inv-scroll" :scroll-y="true">
              <view
                class="inv-item"
                v-for="(item, index) in investmentList"
                :key="index"
                @click.stop="handleToDetail(item)"
              >
                <view class="inv-name">{{ item.fundName }}</view>
                <view class="flex justify-center align-center">
                  <view class="inv-info">
                    <image class="icon" :src="investmentAmount"></image>
                    <view class="name">
                      <view>{{ $t('inv.inv6') }}</view>
                      <view>{{ $t('inv.inv7') }}</view>
                    </view>
                    <view class="text">{{ moneyFormant(item.purchasedAmount) }}</view>
                  </view>
                  <view class="inv-info">
                    <image class="icon" :src="interest"></image>
                    <view class="name">
                      <view>{{ $t('inv.inv8') }}</view>
                      <view>{{ $t('inv.inv9') }}</view>
                    </view>
                    <view class="text">{{ moneyFormant(item.prevMonthReturn) }}</view>
                  </view>
                  <view class="inv-info">
                    <image class="icon" :src="currentMonth"></image>
                    <view class="name">
                      <view>{{ $t('inv.inv10') }}</view>
                      <view>{{ $t('inv.inv11') }}</view>
                    </view>
                    <view class="text">{{ moneyFormant(item.monthReturn) }}</view>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </view>
    <NoData v-if="entityList.length <= 0"></NoData>
    <ScrollTop v-show="showUp"></ScrollTop>
    <TabBar></TabBar>
    <uni-popup ref="popup" :is-mask-click="false" type="bottom">
      <EditEntity @close="handlePopupStatus"></EditEntity>
    </uni-popup>
    <Toast :is-show="isShowToast"></Toast>
  </view>
</template>
<style lang="scss" scoped>
.investment {
  padding: 10rpx 40rpx 40rpx;

  .item {
    max-height: 320rpx;
    border-radius: 20rpx;
    background: #fff;
    box-shadow: 0 8rpx 40rpx 0 rgba(46, 58, 87, 0.15);
    position: relative;
    overflow: hidden;
    padding: 30rpx 54rpx;
    transition: max-height 0.4s ease-in-out;

    .edit {
      position: absolute;
      width: 26rpx;
      height: 26rpx;
      right: 40rpx;
      top: 30rpx;

      .icon {
        width: 26rpx;
        height: 26rpx;
        display: block;
      }
    }

    .name {
      color: #4f4f4f;
      font-size: 32rpx;
      font-style: normal;
      font-weight: 700;
      // line-height: 1.5;
    }

    .bhg {
      color: #828282;
      font-size: 24rpx;
      font-style: normal;
      font-weight: 400;
    }

    .include {
      color: #828282;
      font-size: 24rpx;
      font-style: normal;
      font-weight: 400;
    }
    .text-BE9670 {
      color: #be9670;
    }

    .email {
      width: 500rpx;
      color: #4f4f4f;
      font-size: 24rpx;
      font-style: normal;
      font-weight: 400;
      // line-height: 1.5;
    }

    .address {
      color: #828282;
      font-size: 24rpx;
      font-style: normal;
      font-weight: 400;
      display: flex;
      align-items: center;
      // margin-top: 10rpx;
    }

    .content-box {
      margin-top: 26rpx;
      // height: 500rpx;

      .nav-list {
        border-top: 1rpx solid #f2f2f2;
        color: #828282;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 12rpx;

        .line {
          padding: 0 16rpx;
        }

        .line-act {
          color: #4f4f4f;
        }

        .line + .line {
          border-left: 4rpx solid #828282;
        }
      }

      .inv-box {
        padding-top: 20rpx;

        .inv-scroll {
          border-radius: 10rpx;
          max-height: 532rpx;
          background: #fff;
          overflow: hidden;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          -webkit-backface-visibility: hidden;
          -webkit-transform: translate3d(0, 0, 0);
        }
        .inv-item {
          width: 100%;
          min-height: 164rpx;
          border-radius: 10rpx;
          background: #fafafa;
          // box-shadow: 0 8rpx 32rpx 0 rgba(158, 158, 158, 0.25);
          padding: 20rpx 30rpx;
        }

        .inv-item + .inv-item {
          margin-top: 20rpx;
        }
        .inv-name {
          color: #575757;
          font-size: 22rpx;
          font-style: normal;
          font-weight: 600;
          padding-bottom: 16rpx;
        }

        .inv-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 200rpx;
          // background: #000;

          .icon {
            width: 24rpx;
            height: 24rpx;
            display: block;
          }

          .name {
            text-align: center;
            color: #acaaa7;
            font-size: 16rpx;
            font-style: normal;
            font-weight: 600;
            line-height: 1;
            padding: 6rpx 0;
          }

          .text {
            color: #be9670;
            text-align: center;
            font-size: 24rpx;
            font-style: normal;
            font-weight: 600;
          }
        }

        // .inv-info + .inv-info {
        //   // margin-left: 100rpx;
        // }
      }
    }
  }

  .item-act {
    max-height: 834rpx;
  }

  .item:nth-child(odd)::after {
    content: '';
    width: 18rpx;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: var(--Linear, linear-gradient(180deg, #be9670 0%, rgba(190, 150, 112, 0.67) 100%));
  }

  .item:nth-child(even)::after {
    content: '';
    width: 18rpx;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: var(--Linear, linear-gradient(31deg, rgba(46, 58, 87, 0.36) 2.68%, #2e3a57 97.72%));
  }

  .item + .item {
    margin-top: 44rpx;
  }
}
</style>
