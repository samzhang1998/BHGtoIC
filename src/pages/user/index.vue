<script setup lang="ts">
import change from '@/static/icon/change.png'
import about from '@/static/icon/about2.png'
import notifications from '@/static/icon/notifications.png'
import privacy from '@/static/icon/privacy.png'
import submission from '@/static/icon/submission.png'
import system from '@/static/icon/system.png'
// import verification from '@/static/icon/verification.png'
import logout from '@/static/icon/logout.png'
import us from '@/static/icon/us.png'
import share from '@/static/icon/share.png'
import EditUserInfo from './components/EditUserInfo.vue'
import ShareForm from './components/share.vue'
import { useUser } from '@/hooks/useUser'
import { UserKey } from '@/symbols/user'
// import { useLocale } from '@/hooks/useLocale'
// const { t } = useLocale()
const { token, roles, loginOut, logOff } = useUser()
const popup = ref<any>(null)
const popType = ref('')
const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff'
})

const isShowToast = ref<boolean>(false)

const userId = ref('')
const isShowPop = ref(false)
const userInfo = ref<AnyObj>({})
const isLogOff = ref(false)
const userRole = ref('client')

const menuList = ref<AnyObj[]>([])

onLoad((options) => {
  isShowPop.value = options?.uId ? true : false
  if (token.value) {
    userRole.value = roles.value.includes('client') ? 'client' : 'visitor'
  }
  // console.log('2222', userRole.value)
})

onShow(() => {
  if (token.value) {
    getInfo()
    getType()
  }
  resetMenu()
})

function handleToPath(item: AnyObj) {
  if (item.isLogin) {
    if (token.value) {
      uni.navigateTo({
        url: item.path
      })
    } else {
      uni.showToast({
        icon: 'none',
        title: 'please login'
      })
    }
  } else {
    uni.navigateTo({
      url: item.path
    })
  }
}

function handleLoginOut() {
  loginOut()
}

function handleShare() {
  popType.value = 'share'
  popup.value.open()
}

const handleClose = (type?: string) => {
  if (popType.value === 'editUser') {
    if (type === 'open') {
      getInfo()
      isShowToast.value = true
      setTimeout(() => {
        isShowToast.value = false
        popup.value.close()
      }, 1000)
    } else {
      popup.value.close()
    }
  } else {
    popup.value.close()
  }
  popType.value = ''
  // getInfo()
}

const handleEditUser = () => {
  popType.value = 'editUser'
  popup.value.open()
}

const handleToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}

const resetMenu = () => {
  menuList.value = [
    {
      title: 'me.me4',
      path: '/pages/submission/submission',
      icon: submission,
      isLogin: true,
      isShowLogin: false,
      isShow: userRole.value === 'client',
      target: handleToPath
    },
    {
      title: 'me.me5',
      path: '/pages/notification/notification',
      icon: notifications,
      isLogin: true,
      isShowLogin: false,
      isShow: true,
      target: handleToPath
    },
    {
      title: 'me.me6',
      path: '/pages/user/us',
      icon: us,
      isLogin: false,
      isShowLogin: false,
      isShow: true,
      target: handleToPath
    },
    {
      title: 'me.me7',
      path: '/pages/user/about',
      icon: about,
      isLogin: false,
      isShowLogin: false,
      isShow: true,
      target: handleToPath
    },
    // {
    //   title: 'me.me21',
    //   path: '/pages/user/verification',
    //   icon: verification,
    //   isLogin: true,
    //   isShowLogin: false,
    //   target: handleToPath
    // },
    {
      title: 'me.me8',
      path: '/pages/user/privacy',
      icon: privacy,
      isLogin: false,
      isShowLogin: false,
      isShow: true,
      target: handleToPath
    },
    {
      title: 'me.me9',
      path: '',
      icon: share,
      isLogin: false,
      isShowLogin: false,
      isShow: true,
      target: handleShare
    },
    {
      title: 'me.me10',
      path: '/pages/user/change',
      icon: change,
      isLogin: true,
      isShowLogin: false,
      isShow: userRole.value === 'client',
      target: handleToPath
    },
    {
      title: 'me.me11',
      path: '/pages/user/system',
      icon: system,
      isLogin: false,
      isShowLogin: false,
      isShow: true,
      target: handleToPath
    },
    {
      title: 'me.me12',
      path: '',
      icon: logout,
      isLogin: true,
      isShowLogin: true,
      isShow: true,
      target: handleLoginOut
    }
  ]
}

const loginOff = () => {
  uni.showModal({
    title: 'notice',
    content: 'Are you sure to log out',
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        logOff()
      } else if (res.cancel) {
        // console.log('用户点击取消')
      }
    }
  })
}

const getType = async () => {
  let params = {}
  const [e, r] = await api.isLogoff(params)
  if (!e && r) {
    // console.log('🚀 ~ getType ~ r:', r)
    isLogOff.value = r.data
  }
}

async function getInfo() {
  let params = {}
  const [e, r] = await api.getUserInfo(params)
  if (!e && r) {
    if (r?.success) {
      userInfo.value = r?.data || {}
      userId.value = r?.data?.id || ''
      nextTick(() => {
        if (userId.value && isShowPop.value) {
          isShowPop.value = false
          popup.value.open()
        }
      })
      console.log('🚀 ~ file: index.vue:110 ~ getInfo ~ userInfo:', userInfo.value)
    }
  }
}

provide(UserKey, { uId: userId, info: userInfo })
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar">
      <template #content>
        <view class="bar-title act">{{ $t('me.me1') }}</view>
      </template>
    </NavBar>
    <view class="me">
      <view class="top">
        <view class="round1"></view>
        <view class="round2"></view>
        <view class="container" v-if="token">
          <view class="edit" v-if="userRole === 'client'">
            <image class="icon" src="../../static/icon/edit.png" @click="handleEditUser"></image>
          </view>
          <view class="name">
            {{ userInfo?.name }}
            <!-- <view class="kyc"></view> -->
          </view>
          <view class="text" v-if="userRole === 'client'"> Client ID: {{ userInfo?.id }} </view>
          <view class="text flex align-center m-t-20">
            <uni-icons class="icon-left" type="email-filled" color="#fff"></uni-icons>
            {{ userInfo?.email }}
          </view>
          <view class="text flex align-center" v-if="userRole === 'client'">
            <uni-icons class="icon-left" type="phone-filled" color="#fff"></uni-icons>
            {{ userInfo?.phone }}
          </view>
        </view>
        <view class="login-btn" v-else @click="handleToLogin">{{ $t('me.me2') }}</view>
      </view>

      <view class="menu-list">
        <view class="title">{{ $t('me.me3') }}</view>
        <view class="list">
          <template v-for="(item, index) in menuList" :key="index">
            <view
              class="item"
              @click="item.target(item)"
              v-if="(item.isShowLogin ? (token ? true : false) : true) && item.isShow"
            >
              <view class="left flex align-center">
                <image class="menu-icon" :src="item.icon"></image>
                <view class="name">{{ $t(item.title) }} </view>
              </view>
              <view class="right">
                <uni-icons type="right" color="#333" size="18"></uni-icons>
              </view>
            </view>
          </template>
        </view>
        <view class="flex justify-between align-center margin-sm" v-if="token && userRole === 'client'">
          <view></view>
          <view class="login-off" @click="loginOff" v-if="isLogOff">{{ $t('me.me27') }}</view>
        </view>
      </view>
    </view>
    <TabBar></TabBar>
    <uni-popup ref="popup" :is-mask-click="false" type="bottom">
      <EditUserInfo @close="handleClose" v-if="popType === 'editUser'"></EditUserInfo>
      <ShareForm @close="handleClose" v-if="popType === 'share'"></ShareForm>
    </uni-popup>
    <Toast :is-show="isShowToast"></Toast>
  </view>
</template>
<style lang="scss" scoped>
.me {
  padding: 0 40rpx;
  .top {
    height: 208rpx;
    border-radius: 30rpx;
    background: linear-gradient(179deg, #be9670 -47.98%, rgba(190, 150, 112, 0.92) 163.51%);
    position: relative;
    padding: 30rpx 60rpx;

    .edit {
      position: absolute;
      width: 26rpx;
      height: 26rpx;
      right: 60rpx;
      top: 40rpx;

      .icon {
        width: 26rpx;
        height: 26rpx;
        display: block;
      }
    }

    .round1 {
      width: 116rpx;
      height: 116rpx;
      border-radius: 50%;
      opacity: 0.25;
      background: #fff;
      position: absolute;
      bottom: -10rpx;
      right: -28rpx;
    }

    .round2 {
      width: 86rpx;
      height: 86rpx;
      border-radius: 50%;
      opacity: 0.25;
      background: #fff;
      position: absolute;
      bottom: -26rpx;
      right: 42rpx;
    }

    .container {
      .name {
        color: #fff;
        font-size: 36rpx;
        font-style: normal;
        font-weight: 700;
        position: relative;
        display: inline;

        .kyc {
          position: absolute;
          right: -26rpx;
          top: 14rpx;
          width: 18rpx;
          height: 18rpx;
          border-radius: 50%;
          background: linear-gradient(180deg, #a70808 0%, #e96464 100%);
        }

        .kyc-green {
          background: linear-gradient(180deg, #4e9f1c 0%, #72ff1b 100%);
        }
      }

      .text {
        color: #fff;
        font-size: 20rpx;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5;
      }

      .m-t-20 {
        margin-top: 20rpx;
      }

      .icon-left {
        margin-right: 14rpx;
      }
    }

    .login-btn {
      width: 200rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #be9670;
      font-size: 28rpx;
      background: #fff;
      border-radius: 5000rpx;
    }
  }

  .menu-list {
    padding: 60rpx 0;

    .title {
      color: #be9670;
      font-size: 32rpx;
      font-style: normal;
      font-weight: 500;
      padding-bottom: 20rpx;
    }

    .list {
      border-radius: 20rpx;
      background: #fff;
      box-shadow: 0 8rpx 76rpx 0 rgba(189, 189, 189, 0.25);
      padding: 0 30rpx;

      .item {
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          .menu-icon {
            width: 30rpx;
            height: 30rpx;
          }

          .name {
            padding-left: 20rpx;
            color: #333;
            font-size: 28rpx;
            font-style: normal;
            font-weight: 400;
          }
        }
      }

      .item + .item {
        border-top: 2rpx solid #f4f4f4;
      }
    }
  }
}

.login-off {
  font-size: 28rpx;
  font-style: normal;
  font-weight: 400;
}
</style>
