<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { useDict } from '@/hooks/useDict'

import { useFunds } from './hooks/useFunds'
import { useUser } from '@/hooks/useUser'
const { token, roles } = useUser()
const { langStatus } = useLocale()

const { getType } = useDict()

const popup = ref<any>(null)
const popularList = ref<AnyObj[]>([])
const productAll = ref<AnyObj[]>([])
const productCompleted = ref<AnyObj[]>([])
const productHistory = ref<AnyObj[]>([])
const productAllScroll = ref<AnyObj[][]>([])
const pageNum = ref(1)
const pageSize = ref(12)
const pageCompletedNum = ref(1)
const pageCompletedSize = ref(10)
const userRole = ref('')
const platform = ref('')

// const showUp = ref(false)
const { fundStatus, fundStatusStyle, getFundsAll, getPopularData } = useFunds()

const menulist = ref([
  {
    name: 'home.home3',
    key: 'all',
    value: ''
  },
  {
    name: 'home.home4',
    key: 'Pool',
    value: '0'
  },
  {
    name: 'home.home5',
    key: 'Direct',
    value: '1'
  }
])

const filterStatus = ref([
  {
    name: 'Coming Soon',
    value: '0',
    checked: true
  },
  {
    name: 'Open Now',
    value: '1',
    checked: false
  },
  {
    name: 'Completed',
    value: '3',
    checked: false
  }
])

const filterLocationStatus = ref<AnyObj[]>([])

const filterSelect = ref(-99)
const selectMenu = ref(0)

onMounted(() => {
  getAllProduct()
  getAllProductCompleted()
  if (token.value) {
    userRole.value = roles.value.includes('client') ? 'client' : 'visitor'
  }
  // uni.getPushClientId({
  //   success: (res) => {
  //     let push_clientid = res.cid
  //     console.log('客户端推送标识:', push_clientid)
  //   },
  //   fail(err) {
  //     console.log(err, 'err')
  //   },
  //   complete(com) {
  //     console.log(com, 'com')
  //   }
  // })
})

onShow(() => {
  getPopular()
})

onReachBottom(() => {
  // pageNum.value = pageNum.value + 1
  // getAllProduct()
})

async function getLocation() {
  const data = await getType({ dictType: 'state' })
  console.log('🚀 ~ getLocation ~ data:', data)
  filterLocationStatus.value = data
}

const getData = () => {
  pageNum.value = pageNum.value + 1
  getAllProduct()
}

const getDataCompleted = () => {
  pageCompletedNum.value = pageCompletedNum.value + 1
  getAllProductCompleted()
}

// onPageScroll((e) => {
//   // if (e.scrollTop > 300) {
//   //   showUp.value = true
//   // } else {
//   //   showUp.value = false
//   // }
// })

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff'
})

const getPopular = async () => {
  const data = await getPopularData()
  console.log('🚀 ~ file: index.vue:18 ~ getPopular ~ data:', data)
  popularList.value = data
}

//查询全部
const getAllProduct = async () => {
  let params: AnyObj = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    fundStatusList: '0,1,2'
    // fundStatus: '3'
  }
  if (selectMenu.value !== 0) {
    params.fundCategory = menulist.value[selectMenu.value].value
  }
  const data = await getFundsAll(params)
  console.log('🚀 ~ file: index.vue:24 ~ getAllProduct ~ data:', data?.list)
  if (pageNum.value === 1) {
    productAll.value = data?.list || []
    productAllScroll.value = groupArrayEveryN(productAll.value, 4)
    // console.log('22222', groupArrayEveryN(productAll.value, 4))
  } else {
    if (data?.list.length <= 0) {
      pageNum.value = pageNum.value - 1
      uni.showToast({
        icon: 'none',
        title: `There's no more`
      })
    } else {
      productAll.value = productAll.value.concat(data?.list || [])
      productAllScroll.value = groupArrayEveryN(productAll.value, 4)
    }
  }
}

//查询Completed
const getAllProductCompleted = async () => {
  let params: AnyObj = {
    pageNum: pageCompletedNum.value,
    pageSize: pageCompletedSize.value,
    fundStatus: 3
  }
  const data = await getFundsAll(params)
  console.log('🚀 ~ file: index.vue:24 ~ getAllProduct ~ data:', data?.list)
  if (pageCompletedNum.value === 1) {
    productCompleted.value = data?.list || []
  } else {
    if (data?.list.length <= 0) {
      pageCompletedNum.value = pageCompletedNum.value - 1
      uni.showToast({
        icon: 'none',
        title: `There's no more`
      })
    } else {
      productCompleted.value = productCompleted.value.concat(data?.list || [])
    }
  }
}

//查询历史购买
const getAllProductHistory = async () => {
  let params: AnyObj = {
    pageNum: 1,
    pageSize: 1000,
    history: true
  }
  const data = await getFundsAll(params)
  productHistory.value = data?.list || []
  console.log('🚀 ~ getAllProductHistory ~ productHistory:', productHistory.value)
}

function groupArrayEveryN(array: Array<AnyObj>, n: number) {
  let result = []
  for (let i = 0; i < array.length; i += n) {
    result.push(array.slice(i, i + n))
  }
  return result
}

const handleToDetail = (item: AnyObj) => {
  uni.navigateTo({
    url: `/pages/index/detail?fId=${item.id}`
  })
}

const handleSelect = (index: number) => {
  selectMenu.value = index
  pageNum.value = 1
  productAll.value = []
  productAllScroll.value = []
  getAllProduct()
}

const handleShowPop = () => {
  getLocation()
  if (token.value) {
    getAllProductHistory()
  }
  popup.value.open()
}

const handleChooseFilter = (index: number) => {
  filterStatus.value[index].checked = !filterStatus.value[index].checked
}

const handleClear = () => {
  filterStatus.value[0].checked = true
  filterStatus.value[1].checked = false
  filterStatus.value[2].checked = false
  filterSelect.value = -99
  platform.value = ''
}

const handleFilter = () => {
  let str = ``
  filterStatus.value.map((item) => {
    if (item.checked) {
      str += `${item.value},`
    }
  })
  if (str) {
    uni.navigateTo({
      url: `/pages/index/filter?t=${str}&l=${filterLocationStatus.value[filterSelect.value]?.id || ''}&p=${platform.value}`
    })
  } else {
    uni.showToast({
      icon: 'none',
      title: `Please select fund status`
    })
  }
}

const handleShowAll = () => {
  uni.navigateTo({
    url: `/pages/index/filter?t=0,1,2,3&l=`
  })
}

const handlePickerFund = (e: AnyObj) => {
  if (e.detail.value >= 0) {
    filterSelect.value = e.detail.value
  }
}

// const handlePreviewImg = (src: string) => {
//   uni.previewImage({
//     urls: [src]
//   })
// }
</script>

<template>
  <view class="common-bg home">
    <NavBar v-bind="navBar">
      <template #content>
        <view class="bar-title act">{{ $t('home.home1') }}</view>
      </template>
      <template #right> </template>
    </NavBar>
    <view class="popular">
      <scroll-view
        class="scroll-top"
        :scroll-x="true"
        :scroll-anchoring="true"
        :scroll-with-animation="true"
        :show-scrollbar="true"
      >
        <view class="item" v-for="(item, index) in popularList" :key="index" @click="handleToDetail(item)">
          <view class="banner">
            <!-- @click.stop="handlePreviewImg(langStatus ? item.coverCn || item.cover : item.cover)" -->
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
            <!-- texts-cut -->
            <view class="title">{{ langStatus ? item.nameCN || item.name : item.name }}</view>
            <view class="desc texts-cut">{{
              langStatus ? item.descriptionCN || item.description : item.description
            }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="product">
      <view class="flex align-center">
        <view class="sub-title">{{ $t('home.home2') }}</view>
        <image class="icon" src="../../static/icon/filter2.png" @click="handleShowPop"></image>
      </view>

      <view class="menu">
        <view
          :class="selectMenu === index ? 'nav-item nav-act' : 'nav-item'"
          v-for="(item, index) in menulist"
          :key="index"
          @click="handleSelect(index)"
        >
          {{ $t(item.name) }}
        </view>
      </view>
      <!-- <view class="scroll-all">
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
      </view> -->
      <!-- <scroll-view
        class="scroll-list"
        :scroll-x="true"
        :scroll-anchoring="true"
        :scroll-with-animation="true"
        :show-scrollbar="true"
        :lower-threshold="300"
        @scrolltolower="getData"
        v-if="productAllScroll.length > 0"
      >
        <view class="scroll-all" v-for="(item1, index1) in productAllScroll" :key="index1">
          <view class="item" v-for="(item, index) in item1" :key="index" @click="handleToDetail(item)">
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
      </scroll-view> -->
      <scroll-view
        class="scroll-completed"
        :scroll-x="true"
        :scroll-anchoring="true"
        :scroll-with-animation="true"
        :show-scrollbar="true"
        @scrolltolower="getData"
      >
        <view class="item" v-for="(item, index) in productAll" :key="index" @click="handleToDetail(item)">
          <view class="banner">
            <!-- @click.stop="handlePreviewImg(langStatus ? item.coverCn || item.cover : item.cover)" -->
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
            <!-- texts-cut -->
            <view class="title">{{ langStatus ? item.nameCN || item.name : item.name }}</view>
            <view class="desc texts-cut">{{
              langStatus ? item.descriptionCN || item.description : item.description
            }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="product" v-if="productCompleted.length > 0">
      <view class="sub-title margin-bottom-20">{{ $t('home.home25') }}</view>
      <scroll-view
        class="scroll-completed"
        :scroll-x="true"
        :scroll-anchoring="true"
        :scroll-with-animation="true"
        :show-scrollbar="true"
        @scrolltolower="getDataCompleted"
      >
        <view class="item" v-for="(item, index) in productCompleted" :key="index" @click="handleToDetail(item)">
          <view class="banner">
            <!-- @click.stop="handlePreviewImg(langStatus ? item.coverCn || item.cover : item.cover)" -->
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
            <!-- texts-cut -->
            <view class="title">{{ langStatus ? item.nameCN || item.name : item.name }}</view>
            <view class="desc texts-cut">{{
              langStatus ? item.descriptionCN || item.description : item.description
            }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <NoData v-if="productAll.length <= 0"></NoData>

    <!-- <ScrollTop v-show="showUp"></ScrollTop> -->
    <TabBar></TabBar>
    <uni-popup ref="popup" :is-mask-click="true" type="bottom">
      <view class="pop-box">
        <view class="top">
          <view class="text-000">{{ $t('home.filter2') }}</view>
          <view class="text-be9670" @click="handleClear">{{ $t('home.filter3') }}</view>
        </view>
        <view class="selected">
          <view
            class="f-status"
            :class="item.checked ? 'active' : ''"
            v-for="(item, index) in filterStatus"
            :key="index"
            @click="handleChooseFilter(index)"
          >
            {{ item.name }}
          </view>
        </view>
        <view class="line" v-if="productHistory.length > 0 && userRole === 'client'">
          <view class="text-000">{{ $t('home.filter4') }}</view>
          <scroll-view
            class="history-scroll"
            :scroll-y="true"
            :scroll-anchoring="true"
            :scroll-with-animation="true"
            :show-scrollbar="true"
          >
            <view
              class="history-item"
              v-for="(item, index) in productHistory"
              :key="index"
              @click="handleToDetail(item)"
            >
              {{ langStatus ? item.nameCN || item.name : item.name }}
            </view>
          </scroll-view>
        </view>
        <view class="line">
          <view class="flex align-center">
            <view class="text-000">{{ $t('home.filter5') }}</view>
            <view class="width-80">
              <picker
                @change="handlePickerFund"
                :value="filterSelect"
                range-key="code"
                :range="filterLocationStatus"
                :disabled="false"
              >
                <view class="picker flex justify-center align-center">
                  {{ filterLocationStatus[filterSelect]?.code || 'Select Location' }}
                </view>
              </picker>
            </view>
          </view>
        </view>
        <view class="line">
          <view class="flex align-center">
            <view class="text-000">{{ $t('home.filter7') }}</view>
            <view class="input">
              <input v-model="platform" />
            </view>
          </view>
        </view>
        <!-- <view class="line">
          <view class="text-000">Status</view>
        </view> -->
        <view class="btn" @click="handleFilter">{{ $t('home.filter6') }}</view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  // background: linear-gradient(0deg, rgba(214, 188, 165, 0.38) 2.31%, rgba(255, 255, 255, 0) 99.76%),
  //   linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 37.32%);
  // backdrop-filter: blur(1rpx);
  padding-bottom: 40rpx;

  .icon {
    width: 26rpx;
    height: 26rpx;
    margin-left: 20rpx;
  }

  .popular {
    padding-bottom: 20rpx;
    .scroll-top {
      height: 720rpx;
      white-space: nowrap;
      width: 100%;

      .item {
        display: inline-block;
        min-height: 606rpx;
        width: 500rpx;
        border-radius: 20rpx;
        margin-left: 40rpx;
        overflow: hidden;
        border: 2rpx solid #e3e3e3;
        background: #fff;

        .banner {
          width: 100%;
          height: 392rpx;
          background: #eee;
          overflow: hidden;
          position: relative;

          .img {
            width: 100%;
            height: 392rpx;
            display: block;
          }

          .status {
            position: absolute;
            top: 0;
            left: 36rpx;
            z-index: 3;
            color: #fff;
            text-transform: capitalize;
            width: 100rpx;
            height: 60rpx;
            padding-top: 20rpx;
            // display: flex;
            // flex-wrap: wrap;
            // justify-content: space-between;
            // align-items: center;

            .text {
              text-align: center;
              width: 100%;
              font-size: 18rpx;
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
            border-top: 50rpx solid #be9670;
            border-right: 50rpx solid transparent;
            border-left: 50rpx solid transparent;
            position: absolute;
            bottom: -49rpx;
            z-index: -1;
            left: 0;
          }

          .status2::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 50rpx solid #47553f;
            border-right: 50rpx solid transparent;
            border-left: 50rpx solid transparent;
            position: absolute;
            bottom: -49rpx;
            left: 0;
          }

          .status3::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 50rpx solid #404f71;
            border-right: 50rpx solid transparent;
            border-left: 50rpx solid transparent;
            position: absolute;
            bottom: -49rpx;
            left: 0;
          }

          .status4::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 50rpx solid #555;
            border-right: 50rpx solid transparent;
            border-left: 50rpx solid transparent;
            position: absolute;
            bottom: -49rpx;
            left: 0;
          }
        }

        .bottom {
          white-space: normal;
          padding: 40rpx;
          text-align: center;
          color: #333;
          font-style: normal;
          font-weight: 600;
        }

        .title {
          font-size: 32rpx;
          height: 136rpx;
          // width: 100%;
          // word-wrap: normal;
        }

        .desc {
          margin-top: 20rpx;
          color: #1a2b38;
          font-size: 22rpx;
          font-style: normal;
          font-weight: 300;
        }
      }
    }

    .item:nth-last-child(1) {
      margin-right: 40rpx;
    }
  }

  // .item:nth-child(even) {
  //   background: linear-gradient(180deg, #be9670 0%, rgba(190, 150, 112, 0.67) 100%);
  // }

  // .item:nth-child(odd) {
  //   background: linear-gradient(31deg, rgba(46, 58, 87, 0.36) 2.68%, #2e3a57 97.72%);
  // }

  .product {
    .sub-title {
      color: #333;
      font-size: 42rpx;
      font-style: normal;
      font-weight: 700;
      padding-left: 40rpx;
    }

    .margin-bottom-20 {
      margin-bottom: 20px;
    }

    .menu {
      display: flex;
      align-items: center;
      padding: 10rpx 30rpx 30rpx;

      .nav-item {
        color: #bdbdbd;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 700;
        padding: 0 10rpx;
      }

      .nav-item + .nav-item {
        border-left: 2rpx solid #be9670;
      }

      .nav-act {
        color: #be9670;
      }
    }

    .scroll-list {
      height: 970rpx;
      white-space: nowrap;
      width: 100%;
      // padding: 0 0 20rpx;
      // padding: 0 20rpx;
    }
    .scroll-all {
      height: 970rpx;
      display: inline-flex;
      flex-wrap: wrap;
      // padding: 0 0 0 40rpx;
      // background-color: #000;
      // margin-left: 20rpx;
      color: #fff;
      .item {
        // display: inline-block;
        width: calc((100% - 80rpx) / 2);
        height: 450rpx;
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

    .scroll-all:first-child {
      margin-left: 20rpx;
    }

    .scroll-all:nth-last-child(1) {
      margin-right: 20rpx;
    }
  }

  .scroll-completed {
    height: 420rpx;
    white-space: nowrap;
    width: 100%;
    // margin-top: 20rpx;

    .item {
      display: inline-block;
      min-height: 390rpx;
      width: 272rpx;
      border-radius: 20rpx;
      margin-left: 40rpx;
      overflow: hidden;
      border: 2rpx solid #e3e3e3;
      background: #fff;

      .banner {
        width: 100%;
        height: 220rpx;
        background: #eee;
        overflow: hidden;
        position: relative;

        .img {
          width: 100%;
          height: 220rpx;
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
        font-size: 16rpx;
        // height: 88rpx;
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

  .item:nth-last-child(1) {
    margin-right: 40rpx;
  }

  .pop-box {
    width: 100%;
    height: 960rpx;
    background: #fff;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
    padding: 40rpx;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20rpx;
      border-bottom: 2rpx solid #e0e0e0;
    }

    .text-000 {
      color: #000;
      font-size: 28rpx;
    }

    .text-be9670 {
      color: #be9670;
      font-size: 24rpx;
    }

    .width-80 {
      width: 80%;
    }

    .picker {
      height: 80rpx;
    }

    .selected {
      margin-top: 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10rpx;
      height: 80rpx;
      background: #ececec;
      padding: 0 20rpx;

      .f-status {
        width: 200rpx;
        height: 60rpx;
        color: #515151;
        font-size: 24rpx;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .active {
        background: #fff;
        border-radius: 10rpx;
      }
    }

    .history-scroll {
      height: 200rpx;
      padding-top: 20rpx;

      .history-item {
        height: 50rpx;
        font-size: 20rpx;
      }
    }

    .line {
      min-height: 100rpx;
      padding: 30rpx 0;
      border-bottom: 2rpx solid #e0e0e0;

      .input {
        padding-left: 40rpx;
      }
    }

    .btn {
      width: 100%;
      height: 88rpx;
      background: #be9670;
      color: #fff;
      border-radius: 10rpx;
      font-size: 28rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40rpx;
    }
  }
}
</style>
