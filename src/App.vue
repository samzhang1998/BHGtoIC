<script setup lang="ts">
import { useUser } from '@/hooks/useUser'
import { useSystem } from '@/hooks/useSystem'
import { getMinutesDifference } from '@/utils'

const { setNavBarHeight } = useSystem()
const { token, setUserInfo } = useUser()

const pinStatus = ref(false)
const appFirstShow = ref(false)
onLaunch(() => {
  console.log('App Launch')
  appFirstShow.value = true
  //第一次打开app重置hideAppTime
  uni.removeStorageSync('hideAppTime')
  setNavBarHeight()
  const info: IUserState = uni.getStorageSync('userInfo')
  console.log('info', info)
  setUserInfo(info)
  // uni.showModal({
  //   title: '提示',
  //   content: JSON.stringify(clientInfo),
  //   success: function (res) {
  //     if (res.confirm) {
  //       console.log('用户点击确定')
  //       uni.setClipboardData({
  //         data: JSON.stringify(clientInfo),
  //         success: function () {
  //           console.log('success')
  //         }
  //       })
  //     } else if (res.cancel) {
  //       console.log('用户点击取消')
  //     }
  //   }
  // })
  uni.onPushMessage((res) => {
    console.log('收到推送消息：', res.data.payload) //监听推送消息
    plus.runtime.setBadgeNumber(0)
    const data: any = res.data.payload
    // console.log(data?.pushType === 0)

    if (data?.pushType === 0) {
      uni.navigateTo({
        url: '/pages/notification/notification'
      })
    } else if (data?.pushType === 1) {
      uni.reLaunch({
        url: '/pages/investment/index'
      })
    } else if (data?.pushType === 2) {
      uni.reLaunch({
        url: '/pages/event/index'
      })
    } else if (data?.pushType === 3) {
      uni.navigateTo({
        url: `/pages/investment/purchaseDetails?pId=${data.purchaseId}&fId=${data.fundId}`
      })
    }
  })
})
onShow(() => {
  console.log('App Show')
  nextTick(() => {
    getInfo()
  })
  // setTimeout(() => {
  // }, 1000)
})
onHide(() => {
  console.log('App Hide')
  //设置离开app的时间
  let hideAppTime = new Date().toString()
  uni.setStorageSync('hideAppTime', hideAppTime)
})

watch(
  () => token.value,
  () => {
    // if (token.value) {
    //   setTimeout(() => {
    //     getInfo()
    //   }, 1000)
    // }
  }
)

async function getInfo() {
  if (!token.value) return
  let params = {}
  const [e, r] = await api.getUserInfo(params)

  if (!e && r) {
    if (r?.success) {
      // console.log('2222', r?.data)

      // userInfo.value = r?.data || {}
      pinStatus.value = r?.data?.enablePin || false
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]

      // 获取页面路径
      const pagePath = currentPage.route
      console.log('当前页面路径:', pagePath)
      if (appFirstShow.value && pinStatus.value) {
        appFirstShow.value = false
        if (pagePath !== 'pages/user/checkPin') {
          console.log('pagePath', pagePath)

          uni.navigateTo({
            url: '/pages/user/checkPin?type=check'
          })
        }
        // uni.showModal({
        //   title: '提示',
        //   content: '跳转pin1' + pagePath,
        //   success: function (res) {
        //     // uni.navigateTo({
        //     //   url: '/pages/user/checkPin?type=check'
        //     // })
        //   }
        // })
      } else if (pinStatus.value) {
        const date = uni.getStorageSync('hideAppTime')
        if (date) {
          const nowDate = new Date().toString()
          const diff = getMinutesDifference(date, nowDate)
          if (diff >= 3) {
            if (pagePath !== 'pages/user/checkPin') {
              uni.navigateTo({
                url: '/pages/user/checkPin?type=check'
              })
            }
            // uni.showModal({
            //   title: '提示',
            //   content: '跳转pin2' + pagePath,
            //   success: function (res) {}
            // })
          } else {
            // uni.showModal({
            //   title: '提示',
            //   content: diff.toString(),
            //   success: function (res) {}
            // })
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import url('./style/common.scss');
</style>
