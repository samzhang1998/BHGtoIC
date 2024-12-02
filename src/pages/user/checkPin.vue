<script setup lang="ts">
const navBar = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: false
})

const navBar2 = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: true
})

const pageType = ref('check')

const focusIndex = ref(0)
const backStatus = ref(false)
const number = ref(['', '', '', ''])

onShow(() => {
  handleFocus()
})

onLoad((options) => {
  pageType.value = options?.type || 'check'
  focusIndex.value = 0
})

// onUnload(() => {
//   uni.showModal({
//     title: '提示',
//     content: '跳转pin2',
//     success: function (res) {}
//   })
// })

onBackPress((options) => {
  if (pageType.value === 'check' && !backStatus.value) {
    console.log('🚀 ~ onBackPress ~ options:', options)
    return true
  }
  // if (options.from === 'navigateBack') {
  //   // 来自导航条返回按钮或者系统返回按钮的事件
  //   // 在这里可以执行你想要的操作，比如提示用户、确认返回等
  //   // 返回true将阻止返回操作，false将继续执行返回操作
  //   // 比如，你可以弹窗提示用户
  //   uni.showModal({
  //     title: '提示',
  //     content: '确定要返回上一页吗？',
  //     success: (res) => {
  //       if (res.confirm) {
  //         // 用户点击确定
  //         // 不执行任何操作，系统将默认执行返回操作
  //       } else if (res.cancel) {
  //         // 用户点击取消
  //         // 阻止返回操作
  //         return true
  //       }
  //     }
  //   })
  //   // 注意：不要忘记返回一个值，表示是否阻止返回操作
  //   // 返回true将阻止返回，返回false将不阻止
  //   return true // 阻止返回操作
  // }
  // 如果不是返回上一页触发的事件，则不拦截
})
const funInputPhoneNum = (e: any) => {
  let index = e.target.id.replace('input-', '')
  let value = e.detail.value
  // let lastValue = number.value[index - 1]
  // let topValue = number.value[index + 1]
  // console.log(lastValue, topValue)
  console.log(value)

  if (index != '3' && value != '') {
    focusIndex.value = Number(index) + 1
  } else if (index != '0' && value === '') {
    focusIndex.value = Number(index) - 1
  }
}

const funInputPhoneNum1 = (e: any) => {
  let value = e.detail.value
  if (value.length > 0) {
    let array = value.split('')
    number.value = ['', '', '', '']
    for (let i = 0; i < array.length; i++) {
      number.value[i] = array[i]
    }
  } else {
    number.value = ['', '', '', '']
  }
}
const funDeletePhoneNum = (e: any) => {
  console.log('🚀 ~ funDeletePhoneNum ~ funDeletePhoneNum:', e)

  let index = e.target.id.replace('input-', '')
  if (number.value[index] == '' && index > 1) {
    focusIndex.value = Number(index) - 1
  }
}
const funFocusInput = (e: any) => {
  // console.log('🚀 ~ funFocusInput ~ funFocusInput:', e)
  // var index = e.target.id.replace('input-', '')
  // if (number.value[index] != '') {
  //   number.value[index] = ''
  // }
}
const funBlurInput = (e: any) => {
  // console.log('🚀 ~ funBlurInput ~ funBlurInput:', e)
}

const handleCheck = () => {
  if (!areAllValuesNonEmpty(number.value)) {
    uni.showToast({
      icon: 'none',
      title: 'Please enter pin'
    })
    handleFocus()
    return
  }
  checkPin()
}

async function checkPin() {
  let params = {
    pin: `${number.value[0]}${number.value[1]}${number.value[2]}${number.value[3]}`
  }
  const [e, r] = await api.checkPin(params)
  if (!e && r) {
    if (r?.success) {
      uni.showToast({
        icon: 'none',
        title: 'Check pin success'
      })
      if (pageType.value === 'closePin') {
        handleFocus()
        closePin()
      } else {
        backStatus.value = true
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]

        // 获取页面路径
        const pagePath = currentPage.route
        console.log('当前页面路径:', pages.length, pagePath)
        if (pages.length <= 1) {
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/index'
            })
          }, 1000)
        } else {
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        }
      }
    } else {
      handleFocus()
    }
  } else {
    handleFocus()
  }
}

async function closePin() {
  let params = {
    currentPin: `${number.value[0]}${number.value[1]}${number.value[2]}${number.value[3]}`,
    confirmPin: '',
    pin: ''
  }
  const [e, r] = await api.editPin(params)
  console.log('closePin', e, r)
  if (!e && r) {
    if (r?.success) {
      uni.showToast({
        icon: 'none',
        title: 'Check pin success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }
  }
}

function areAllValuesNonEmpty(obj: any) {
  return Object.values(obj).every((value) => {
    return value !== null && value !== undefined && value !== ''
  })
}

const handleResetPin = () => {
  uni.navigateTo({
    url: '/pages/user/changeResetPin'
  })
}

const handleFocus = () => {
  focusIndex.value = -1
  setTimeout(() => {
    focusIndex.value = 0
    // console.log(focusIndex.value)
  }, 10)
}

// const handleResetPassword = () => {
//   uni.navigateTo({
//     url: '/pages/login/change'
//   })
// }
</script>
<template>
  <view class="common-bg" @click="handleFocus">
    <NavBar v-bind="navBar" v-if="pageType === 'check'"></NavBar>
    <NavBar v-bind="navBar2" v-if="pageType !== 'check'"></NavBar>
    <view class="system">
      <view class="title">{{ $t('setting.setting15') }}</view>
      <view class="box">
        <view class="number" v-for="(item, index) in number" :key="index">
          <!-- <input class="num1" v-model="number1" type="number" :maxlength="1" :focus="focus1" @input="firstChange" /> -->
          <!-- <input
            type="number"
            class="num"
            maxlength="1"
            v-model="number[index]"
            :id="'input-' + index"
            :focus="focusIndex == index"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            @keyup.delete="funDeletePhoneNum"
            @input="funInputPhoneNum"
            @focus="funFocusInput"
            @blur="funBlurInput"
          /> -->
          <view class="num" :id="'input-' + index" @click="handleFocus">
            <!-- {{ item }} -->
            <view :class="item ? 'act1' : 'act2'"></view>
          </view>
        </view>
      </view>
      <input class="input2" type="number" maxlength="4" @input="funInputPhoneNum1" :focus="focusIndex === 0" />
      <view class="forget" v-if="pageType === 'check'" @click.stop="handleResetPin">
        <text>{{ $t('setting.setting19') }}</text>
        <text class="text-reset">{{ $t('setting.setting20') }}</text>
      </view>
      <view class="btn" @click.stop="handleCheck">
        {{ $t('setting.setting24') }}
      </view>
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

  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .number {
      width: 140rpx;
      height: 140rpx;
      border: 2rpx solid #f2f2f2;
      border-radius: 12rpx;
      overflow: hidden;
    }

    .num {
      width: 140rpx;
      height: 140rpx;
      border-radius: 12rpx;
      font-size: 96rpx;
      font-weight: 400;
      color: #be9670;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      // padding: 0 70rpx;
      // background-color: #000;

      .act1 {
        width: 20rpx;
        height: 20rpx;
        background: #000;
        border-radius: 50%;
      }
      .act2 {
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        border: 2rpx solid #000;
      }
    }
  }

  .forget {
    padding-top: 30rpx;
    text-align: right;
    font-size: 28rpx;
    color: #828282;

    .text-reset {
      color: #be9670;
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

  .input2 {
    // font-size: 30rpx !important;
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
  }
}
</style>
