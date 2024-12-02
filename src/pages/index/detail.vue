<script setup lang="ts">
import { useFunds } from './hooks/useFunds'
import { useMoney } from '@/hooks/useMoney'
import { useLocale } from '@/hooks/useLocale'
import { useDownLoad } from '@/hooks/useDownLoad'
import { useUser } from '@/hooks/useUser'

const { token, roles } = useUser()
const { downloadFileUrl } = useDownLoad()
const { langStatus } = useLocale()
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})
import terms from '@/static/icon/fund-terms.png'
import documents from '@/static/icon/documents.png'
import rate from '@/static/icon/fund-rate.png'
import product from '@/static/icon/fund-product.png'
import investment from '@/static/icon/fund-investment.png'
import category from '@/static/icon/fund-category.png'
import amount from '@/static/icon/fund-amount.png'
const { fundStatus, fundStatusStyle, getFundsDetail } = useFunds()
const { moneyFormant } = useMoney()
const fId = ref('')
const fundInfo = ref<AnyObj>({})
const showMore = ref(true)
const swiperHeight = ref('300rpx')
const imageHeights = ref<any[]>([]) // 存储图片的高度

onLoad((options) => {
  fId.value = options?.fId || ''
})

onShow(() => {
  getFundInfo()
})

const getFundInfo = async () => {
  const data = await getFundsDetail({
    id: fId.value
    // id: 71
  })
  console.log('🚀 ~ file: detail.vue:32 ~ getFundInfo ~ data:', data)
  fundInfo.value = data || {}
  // if (fundInfo.value?.description) {
  //   showMore.value = fundInfo.value?.description.length > 206 ? false : true
  // }
  // uni.getFileInfo({
  //   filePath: 'https://beaver-bucket.oss-ap-southeast-2.aliyuncs.com/uploads/fund/cover/129/1793800499200221184.png',
  //   success: function (res) {
  //     console.log('22222', res)
  //   },
  //   fail: (fail) => {
  //     console.log('22222', fail)
  //   }
  // })
}

/**
 * 图片加载完成
 */
const imageLoaded = (index: number, event: any) => {
  const { width, height } = event.detail
  let actualHeight = height / (width / 750)
  console.log(actualHeight, width, height)

  imageHeights.value[index] = actualHeight || 0
  if (index === 0) {
    swiperHeight.value = actualHeight + 'rpx'
  }
}

/**
 * swiper 切换
 */
const onSwiperChange = async (e: AnyObj) => {
  const index = e.detail.current
  await nextTick()
  const currentImageHeight = imageHeights.value[index]
  swiperHeight.value = currentImageHeight + 'rpx'
}

const handleShowMore = () => {
  showMore.value = !showMore.value
}

const handleToInvest = () => {
  if (token.value && roles.value.includes('client')) {
    uni.navigateTo({
      url: `/pages/index/application?fId=${fundInfo.value?.id}&m=${fundInfo.value?.bprojectDurationMonth}`
    })
  } else {
    uni.navigateTo({
      url: `/pages/index/invest?fId=${fundInfo.value?.id}&m=${fundInfo.value?.bprojectDurationMonth}`
    })
  }
}

const handlePreviewImg = () => {
  let imgList = []
  if (langStatus.value) {
    if (fundInfo.value.coverCn || fundInfo.value.cover) {
      imgList.push(fundInfo.value.coverCn || fundInfo.value.cover)
    }
    if (fundInfo.value.coverCnTwo || fundInfo.value.coverTwo) {
      imgList.push(fundInfo.value.coverCnTwo || fundInfo.value.cover)
    }
    if (fundInfo.value.coverCnThree || fundInfo.value.coverThree) {
      imgList.push(fundInfo.value.coverCnThree || fundInfo.value.coverThree)
    }
    if (fundInfo.value.coverCnFour || fundInfo.value.coverFour) {
      imgList.push(fundInfo.value.coverCnFour || fundInfo.value.coverFour)
    }
  } else {
    if (fundInfo.value.cover) {
      imgList.push(fundInfo.value.cover)
    }
    if (fundInfo.value.coverTwo) {
      imgList.push(fundInfo.value.cover)
    }
    if (fundInfo.value.coverThree) {
      imgList.push(fundInfo.value.coverThree)
    }
    if (fundInfo.value.coverFour) {
      imgList.push(fundInfo.value.coverFour)
    }
  }
  uni.previewImage({
    urls: imgList
  })
}

const handleShowFile = (item: string) => {
  downloadFileUrl(item)
}

const share = (item: AnyObj) => {
  // uni.shareWithSystem({
  //   summary: '',
  //   href: 'https://bhgadmin.bhgglobal.com.au/download/download.html',
  //   success() {
  //     // 分享完成，请注意此时不一定是成功分享
  //   },
  //   fail() {
  //     // 分享失败
  //   }
  // })
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: 'https://bhgadmin.bhgglobal.com.au/download/download.html',
    title: langStatus.value ? item?.nameCN || item?.name : item?.name,
    summary: langStatus.value ? item?.descriptionCN || item?.description : item?.description,
    imageUrl: langStatus.value ? item?.coverCn || item?.cover : item?.cover,
    success: function (res) {
      console.log('success:' + JSON.stringify(res))
    },
    fail: function (err) {
      console.log('fail:' + JSON.stringify(err))
      uni.showToast({
        title: 'WeChat is not installed',
        icon: 'none'
      })
    }
  })
}
</script>
<template>
  <view class="detail-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="banner m-b-30" @click="handlePreviewImg">
      <!-- <image class="bg-img" :src="fundInfo.cover || fundInfo.coverCn" mode="aspectFit" :lazy-load="true"></image> -->
      <view class="container">
        <!-- <view class="status">{{ fundStatus(fundInfo?.fundStatus)?.show }}</view> -->
        <view class="status" :class="fundStatusStyle(fundInfo.fundStatus)" v-if="fundInfo?.fundStatus">
          <view class="s-text">{{ $t(fundStatus(fundInfo.fundStatus)?.top) }}</view>
          <view class="s-text" v-if="$t(fundStatus(fundInfo.fundStatus)?.bottom)">{{
            $t(fundStatus(fundInfo.fundStatus)?.bottom)
          }}</view>
        </view>
      </view>
      <view class="share" @click.stop="share(fundInfo)">
        <uni-icons type="paperplane" color="#fff" size="24" />
        <text>{{ $t('home.share') }}</text>
      </view>
      <block v-if="langStatus">
        <swiper
          class="swiper"
          @change="onSwiperChange"
          :style="{ height: swiperHeight }"
          :indicator-dots="true"
          :autoplay="false"
        >
          <swiper-item v-if="fundInfo.coverCn || fundInfo.cover">
            <image
              class="bg-img"
              :src="fundInfo?.coverCn || fundInfo.cover"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(0, $event)"
            ></image>
          </swiper-item>
          <swiper-item v-if="fundInfo.coverCnTwo || fundInfo.coverTwo">
            <image
              class="bg-img"
              :src="fundInfo?.coverCnTwo || fundInfo.coverTwo"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(1, $event)"
            ></image>
          </swiper-item>
          <swiper-item v-if="fundInfo.coverCnThree || fundInfo.coverThree">
            <image
              class="bg-img"
              :src="fundInfo?.coverCnThree || fundInfo.coverThree"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(2, $event)"
            ></image>
          </swiper-item>
          <swiper-item v-if="fundInfo.coverCnFour || fundInfo.coverFour">
            <image
              class="bg-img"
              :src="fundInfo?.coverCnFour || fundInfo.coverFour"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(3, $event)"
            ></image>
          </swiper-item>
        </swiper>
      </block>
      <block v-if="!langStatus">
        <swiper
          class="swiper"
          @change="onSwiperChange"
          :style="{ height: swiperHeight }"
          :indicator-dots="true"
          :autoplay="false"
        >
          <swiper-item v-if="fundInfo.cover">
            <image
              class="bg-img"
              :src="fundInfo?.cover"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(0, $event)"
            ></image>
          </swiper-item>
          <swiper-item v-if="fundInfo.coverTwo">
            <image
              class="bg-img"
              :src="fundInfo?.coverTwo"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(1, $event)"
            ></image>
          </swiper-item>
          <swiper-item v-if="fundInfo.coverThree">
            <image
              class="bg-img"
              :src="fundInfo?.coverThree"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(2, $event)"
            ></image>
          </swiper-item>
          <swiper-item v-if="fundInfo.coverFour">
            <image
              class="bg-img"
              :src="fundInfo?.coverFour"
              mode="widthFix"
              :lazy-load="true"
              @load="imageLoaded(3, $event)"
            ></image>
          </swiper-item>
        </swiper>
      </block>
    </view>
    <view class="detail">
      <view class="title">
        {{ langStatus ? fundInfo?.nameCN || fundInfo?.name : fundInfo?.name }}
      </view>
      <view class="title2 m-b-10">{{ $t('home.home14') }}</view>
      <view :class="showMore ? 'text m-b-40' : 'text m-b-40'">
        <view :class="showMore ? '' : 'content'">
          {{ langStatus ? fundInfo?.descriptionCN || fundInfo?.description : fundInfo?.description }}
          <text class="text-be9670" @click="handleShowMore" v-if="false">
            {{ fundInfo?.description ? (fundInfo?.description.length > 206 ? `less<<` : '') : '' }}
          </text>
        </view>
        <view class="more" v-if="false">
          <text>...</text><text class="more-text" @click="handleShowMore">more>></text>
        </view>
      </view>
      <block v-if="fundInfo?.imFilePath || fundInfo?.eoiFilePath">
        <view class="title2 m-b-26">{{ $t('home.home24') }}</view>
        <view class="file m-b-26">
          <view class="box" v-if="fundInfo?.eoiFilePath" @click="handleShowFile(fundInfo?.eoiFilePath)">
            <image class="img" :src="documents"></image>
            <view class="file-item">
              <view class="file-title">EOI Document</view>
              <!-- <view class="file-text">PDF - 1.2M</view> -->
            </view>
          </view>
          <view class="box" v-if="fundInfo?.imFilePath" @click="handleShowFile(fundInfo?.imFilePath)">
            <image class="img" :src="documents"></image>
            <view class="file-item">
              <view class="file-title">IM Document</view>
              <!-- <view class="file-text">PDF - 1.2M</view> -->
            </view>
          </view>
        </view>
      </block>
      <view class="title2 m-b-26">{{ $t('home.home15') }}</view>
      <view class="list">
        <view class="item">
          <image class="icon" :src="category"></image>
          <view class="name">{{ $t('home.home16') }}</view>
          <view class="text">{{ langStatus ? fundInfo?.fundTypeCN || fundInfo?.fundType : fundInfo?.fundType }}</view>
        </view>
        <view class="item">
          <image class="icon" :src="amount"></image>
          <view class="name">{{ $t('home.home17') }}</view>
          <view class="text">{{ moneyFormant(fundInfo?.purchaseMinAmount) }} {{ fundInfo?.currency }}</view>
        </view>
        <view class="item">
          <image class="icon" :src="investment"></image>
          <view class="name">{{ $t('home.home18') }}</view>
          <view class="text">{{
            langStatus ? fundInfo?.investmentTypeCN || fundInfo?.investmentType : fundInfo?.investmentType
          }}</view>
        </view>
        <view class="item">
          <image class="icon" :src="terms"></image>
          <view class="name">{{ $t('home.home19') }}</view>
          <view class="text">{{ fundInfo?.bprojectDurationMonth }} {{ $t('home.home22') }}</view>
        </view>
        <view class="item">
          <image class="icon" :src="product"></image>
          <view class="name">{{ $t('home.home20') }}</view>
          <view class="text">{{
            langStatus ? fundInfo?.productTypeCN || fundInfo?.productType : fundInfo?.productType
          }}</view>
        </view>
        <view class="item">
          <image class="icon" :src="rate"></image>
          <view class="name">{{ $t('home.home21') }}</view>
          <view class="text">
            {{
              fundInfo?.byearlyReturnRate
                ? (fundInfo?.byearlyReturnRate * 100).toFixed(2)
                : fundInfo?.byearlyReturnRate
            }}%
          </view>
        </view>
      </view>
      <view class="btn" @click="handleToInvest" v-if="token && roles.includes('client')">{{ $t('home.home28') }}</view>
      <view class="btn" @click="handleToInvest" v-else>{{ $t('home.home23') }}</view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.detail-bg {
  background: linear-gradient(0deg, #fbfbfb 0%, #fbfbfb 100%),
    linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 37.32%);
  backdrop-filter: blur(1rpx);
}

.banner {
  width: 100%;
  min-height: 400rpx;
  // border-radius: 22rpx;
  // overflow: hidden;
  // background:
  //   linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
  //   lightgray 50% / cover no-repeat;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // padding: 0 70rpx;
  position: relative;
  z-index: 0;

  .swiper {
    width: 100%;
    // height: 1000rpx;
    // height: 1160rpx;
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 1;
  }

  .bg-img {
    width: 100%;
    // height: 1260rpx;
    // height: 300rpx;
    display: block;
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 1;
  }

  .share {
    //width: 50rpx;
    height: 50rpx;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 70rpx;
    width: 100%;
    height: 300rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
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
    // justify-content: center;
    // align-items: center;

    .s-text {
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

.m-b-30 {
  margin-bottom: 30rpx;
}

.detail {
  padding: 0 40rpx 40rpx;
  .title {
    color: #333;
    font-size: 36rpx;
    font-style: normal;
    font-weight: 600;
    padding-bottom: 30rpx;
  }

  .m-b-40 {
    margin-bottom: 40rpx;
  }

  .m-b-26 {
    margin-bottom: 26rpx;
  }

  .m-b-10 {
    margin-bottom: 10rpx;
  }

  .title2 {
    color: #be9670;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 600;
  }

  .text {
    color: #4f4f4f;
    font-size: 28rpx;
    font-style: normal;
    font-weight: 400;
    position: relative;

    .sub {
      color: #be9670;
    }

    .content {
      overflow: hidden;
      text-overflow: ellipsis; /*超出则...代替*/
      display: -webkit-box;
      -webkit-line-clamp: 4; /* 行数*/
      line-clamp: 4; /*行数*/
      -webkit-box-orient: vertical;
    }

    .more {
      background: #fbfbfb;
      position: absolute;
      right: 10rpx;
      bottom: 0;
      .more-text {
        padding-left: 30rpx;
        color: #be9670;
      }
    }
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    // gap: 20rpx;

    .item {
      width: 325rpx;
      height: 190rpx;
      border-radius: 16rpx;
      background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
      box-shadow: 0 8rpx 56rpx 0 rgba(215, 210, 210, 0.25);
      margin-bottom: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .icon {
        width: 60rpx;
        height: 60rpx;
        display: block;
      }

      .name {
        text-align: center;
        width: 220rpx;
        color: #828282;
        font-size: 24rpx;
        font-style: normal;
        font-weight: 600;
        line-height: 1;
        padding: 8rpx 0;
      }

      .text {
        width: 270rpx;
        color: #be9670;
        text-align: center;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 500;
      }
    }

    .item:nth-child(even) {
      margin-left: 20rpx;
    }
  }

  .btn {
    height: 74rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    background: #be9670;
    color: #fff;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 500;
    margin-top: 30rpx;
  }

  .file {
    display: flex;

    .box {
      width: calc((100% - 20rpx) / 2);
      border-radius: 10rpx;
      border: 2rpx solid #ececec;
      height: 110rpx;
      display: flex;
      align-items: center;
      padding: 0 30rpx;

      .img {
        width: 40rpx;
        height: 40rpx;
      }

      .file-item {
        margin-left: 16rpx;
      }

      .file-title {
        color: #9a7757;
        font-size: 24rpx;
        font-weight: 500;
      }

      .file-text {
        color: #979797;
        font-size: 20rpx;
        font-weight: 400;
      }
    }

    .box:nth-child(even) {
      margin-left: 20rpx;
    }
  }
}
</style>
