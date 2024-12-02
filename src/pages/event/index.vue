<script setup lang="ts">
import { getFilenameFromUrl } from '@/utils'
import dayjs from 'dayjs'
import { useLocale } from '@/hooks/useLocale'
import { useDownLoad } from '@/hooks/useDownLoad'
const { downloadFileUrl } = useDownLoad()
const { langStatus } = useLocale()

const lang = langStatus.value ? 'cn' : 'en'
const pageType = ref('Upcoming')
const eventList = ref<AnyObj[]>([])
const eventShow = ref(null)
const pageNum = ref(1)
const pageSize = ref(10)
const showUp = ref(false)

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff'
})

const menulist = ref([
  {
    name: 'event.event1',
    value: 'Upcoming'
  },
  {
    name: 'event.event2',
    value: 'End'
  }
])

onMounted(() => {
  getEventList()
})

onShow(() => {})

onReachBottom(() => {
  pageNum.value = pageNum.value + 1
  getEventList()
})

onPageScroll((e) => {
  if (e.scrollTop > 300) {
    showUp.value = true
  } else {
    showUp.value = false
  }
})

const handleChange = (item: AnyObj) => {
  pageType.value = item.value
  eventShow.value = null
  pageNum.value = 1
  eventList.value = []
  getEventList()
}

const handleChangeShowEvent = (item: AnyObj) => {
  if (eventShow.value === item.id) {
    eventShow.value = null
  } else {
    eventShow.value = item.id
  }
}

const handleLook = (item: AnyObj) => {
  downloadFileUrl(item.fileUrl)
}

const handleToWebView = (item: AnyObj) => {
  const web = encodeURIComponent(item.link)
  uni.navigateTo({
    url: `/pages/webview/webview?web=${web}`
  })
}

async function getEventList() {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    status: pageType.value
  }
  const [e, r] = await api.getEventAll(params)
  if (!e && r) {
    if (pageNum.value === 1) {
      eventList.value = r.data?.list || []
    } else {
      if (r.data?.list.length <= 0) {
        pageNum.value = pageNum.value - 1
        uni.showToast({
          icon: 'none',
          title: `There's no more`
        })
      } else {
        eventList.value = eventList.value.concat(r.data?.list || [])
      }
    }

    console.log('🚀 ~ file: index.vue:86 ~ getEventList ~ eventList:', eventList.value)
  }
}

const handlePreviewImg = (src: string) => {
  uni.previewImage({
    urls: [src]
  })
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar">
      <template #content>
        <view class="flex align-center">
          <view
            :class="pageType === item.value ? 'bar-title act' : 'bar-title'"
            v-for="(item, index) in menulist"
            :key="index"
            @click="handleChange(item)"
            >{{ $t(item.name) }}</view
          >
        </view>
      </template>
    </NavBar>
    <view class="event">
      <template v-for="(item, index) in eventList" :key="index">
        <view :class="item.id === eventShow ? 'item item-act' : 'item'" v-if="lang === item.language">
          <view class="center">
            <view class="left">
              <image
                class="event-bg"
                :src="item.mainImg"
                mode="aspectFill"
                :lazy-load="true"
                @click.stop="handlePreviewImg(item.mainImg)"
              ></image>
            </view>
            <view class="right">
              <div>
                <view class="name">{{ item.title }}</view>
                <view class="time">
                  {{ $t('event.event3') }}: {{ item.startTime ? dayjs(item.startTime).format('DD/MM/YYYY HH.mm') : '' }}
                </view>
                <view class="location" v-if="item.type === 'Online'"
                  >{{ $t('event.event4') }}: {{ $t('event.event5') }}</view
                >
                <view class="location" v-else>{{ $t('event.event4') }}: {{ item.location }}</view>
              </div>
              <div class="btn-group">
                <view class="btn upcoming" v-if="item.status === 'Upcoming'">{{ $t('event.event6') }}</view>
                <view class="btn detail" @click="handleChangeShowEvent(item)">{{ $t('event.event7') }}</view>
              </div>
            </view>
          </view>
          <scroll-view class="detail-box" scrollY="true">
            <template v-if="item.briefIntroduction">
              <view class="title">{{ $t('event.event8') }}</view>
              <view class="rich-text"><rich-text :nodes="item.briefIntroduction"></rich-text></view>
            </template>
            <template v-if="item.link">
              <view class="title">{{ $t('event.event9') }}</view>
              <view class="link" @click="handleToWebView(item)">{{ item.link }}</view>
            </template>
            <template v-if="item.fileUrl">
              <view class="title">{{ $t('event.event10') }}</view>
              <view class="down">
                <view class="flex justify-between align-center">
                  <view>{{ item.fileUrl ? getFilenameFromUrl(item.fileUrl) : '' }}</view>
                  <view @click="handleLook(item)">
                    <image class="icon" src="../../static/icon/download.png"></image>
                  </view>
                </view>
              </view>
            </template>
          </scroll-view>
        </view>
      </template>
    </view>
    <NoData v-if="eventList.length <= 0"></NoData>
    <TabBar></TabBar>
    <ScrollTop v-show="showUp"></ScrollTop>
  </view>
</template>
<style lang="scss" scoped>
.event {
  padding: 10rpx 40rpx 40rpx;

  .item {
    max-height: 400rpx;
    border-radius: 30rpx;
    background: #fff;
    box-shadow: 0 8rpx 42rpx 0 rgba(205, 205, 205, 0.25);
    padding: 30rpx;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;

    .center {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        width: 268rpx;
        height: 332rpx;
        border-radius: 22rpx;
        background: #eee;
        overflow: hidden;

        .event-bg {
          width: 268rpx;
          height: 332rpx;
          border-radius: 22rpx;
          display: block;
        }
      }

      .right {
        width: calc(100% - 268rpx);
        height: 332rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 20rpx;
        .name {
          color: #be9670;
          font-size: 26rpx;
          font-style: normal;
          font-weight: 600;
          padding-bottom: 30rpx;
        }

        .time {
          color: #828282;
          font-size: 24rpx;
          font-style: normal;
          font-weight: 500;
        }
        .location {
          color: #828282;
          font-size: 24rpx;
          font-style: normal;
          font-weight: 500;
        }

        .btn-group {
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .btn {
            width: 148rpx;
            height: 46rpx;
            border-radius: 10rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 24rpx;
            font-style: normal;
            font-weight: 500;
          }

          .btn + .btn {
            margin-left: 14rpx;
          }

          .upcoming {
            background: linear-gradient(180deg, #be9670 0%, rgba(190, 150, 112, 0.67) 100%);
            box-shadow: 0 8rpx 40rpx 0 rgba(190, 150, 112, 0.15);
          }

          .detail {
            background: linear-gradient(31deg, rgba(46, 58, 87, 0.73) 2.68%, #2e3a57 97.72%);
            box-shadow: 0 8rpx 40rpx 0 rgba(46, 58, 87, 0.15);
          }
        }
      }
    }

    .detail-box {
      padding: 40rpx 0;
      height: 500rpx;

      .title {
        color: #be9670;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 600;
        padding-bottom: 10rpx;
      }

      .rich-text {
        color: #828282 !important;
        font-size: 24rpx !important;
        font-style: normal !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        padding-bottom: 20rpx;
      }

      .link {
        color: #2e3a57;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 600;
        padding-bottom: 20rpx;
      }

      .down {
        color: #1a2b38;
        font-size: 24rpx;
        font-style: normal;
        font-weight: 600;

        .icon {
          width: 20rpx;
          height: 20rpx;
          display: block;
        }
      }
    }
  }

  .item-act {
    max-height: 1000rpx;
  }

  .item + .item {
    margin-top: 30rpx;
  }
}
</style>
