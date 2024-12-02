<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { useSystem } from '@/hooks/useSystem'
import { useUser } from '@/hooks/useUser'
const { handleLanguageChange } = useLocale()
const { isNotification, setIsNotification } = useSystem()
const { token, roles } = useUser()

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})

const langList = ref([
  {
    text: 'EN',
    value: 'en'
  },
  {
    text: '中文',
    value: 'zh-Hans'
  }
])

const selectLang = ref('en')
const isNotifications = ref(true)
const userRole = ref('')

onLoad(() => {
  if (token.value) {
    userRole.value = roles.value.includes('client') ? 'client' : 'visitor'
  }
})

onShow(() => {
  selectLang.value = uni.getLocale() === 'en' ? 'en' : 'zh-Hans'
  isNotifications.value = isNotification.value
})

const handleChangeLang = (item: AnyObj) => {
  selectLang.value = item.detail?.value
}

const handleChangeNot = (e: AnyObj) => {
  isNotifications.value = e.detail?.value
}

const handleSave = () => {
  handleLanguageChange(selectLang.value)
  setIsNotification(isNotifications.value)
  uni.showToast({
    icon: 'none',
    title: 'save success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

const handleToUrl = () => {
  if (token.value) {
    uni.navigateTo({
      url: '/pages/user/appPassword'
    })
  } else {
    uni.showToast({
      icon: 'none',
      title: 'please login'
    })
  }
}

// const handleLoginOut = () => {
//   loginOut()
// }
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="system">
      <view class="title">{{ $t('setting.setting1') }}</view>
      <view class="list">
        <view class="item">
          <view class="left flex align-center"> {{ $t('setting.setting2') }} </view>
          <view class="right flex align-center">
            <switch
              :checked="isNotifications"
              color="#BE9670"
              style="transform: scale(0.8)"
              @change="handleChangeNot"
            />
          </view>
        </view>
        <view class="item" @click="handleToUrl" v-if="userRole === 'client'">
          <view class="left flex align-center"> {{ $t('setting.setting15') }} </view>
          <view class="right flex align-center">
            <uni-icons type="right" color="#bdbdbd" size="14"></uni-icons>
          </view>
        </view>
        <view class="item">
          <view class="left flex align-center"> {{ $t('setting.setting3') }} </view>
          <radio-group @change="handleChangeLang">
            <view class="right flex align-center m-r-10">
              <view v-for="(item, index) in langList" :key="index">
                <view class="flex align-center">
                  <radio
                    class="m-l-10"
                    :value="item.value"
                    :checked="selectLang === item.value"
                    color="#BE9670"
                    style="transform: scale(0.8)"
                  ></radio>
                  {{ item.text }}
                </view>
              </view>
            </view>
          </radio-group>
        </view>
        <!-- <view class="item" @click="handleLoginOut" v-if="token">
          <view class="left flex align-center"> LoginOut </view>
          <view class="right">
            <uni-icons type="right" size="20" color="#be9670"></uni-icons>
          </view>
        </view> -->
      </view>
      <view class="btn" @click="handleSave"> {{ $t('setting.setting4') }} </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.system {
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
        color: #12151b;
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
      }

      .right {
        color: #be9670;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 400;
      }

      .m-l-10 {
        margin-left: 10rpx;
      }

      .m-r-10 {
        margin-right: 20rpx;
      }
    }

    .item + .item {
      border-top: 2rpx solid #f4f4f4;
    }
  }

  .btn {
    width: 660rpx;
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
    position: fixed;
    left: 45rpx;
    bottom: 200rpx;
  }
}
</style>
