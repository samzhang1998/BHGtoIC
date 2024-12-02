<script setup lang="ts">
const navBar = ref({
  isNotification: false,
  backgroundColor: '#fff',
  isBack: true
})

const pageType = ref('set')

const focusIndex = ref(-1)
const number = ref<AnyObj>({ 0: '', 1: '', 2: '', 3: '' })

onShow(() => {
  handleFocus()
})

onLoad((options) => {
  pageType.value = options?.type || 'set'
  focusIndex.value = 0
})

const funInputPhoneNum = (e: any) => {
  var index = e.target.id.replace('input-', '')
  var value = e.detail.value
  if (index != '10' && value != '') {
    focusIndex.value = Number(index) + 1
  }
}
const funDeletePhoneNum = (e: AnyObj) => {
  console.log('🚀 ~ funDeletePhoneNum ~ funDeletePhoneNum:', e)

  var index = e.target.id.replace('input-', '')
  if (number.value[index] == '' && index > 1) {
    focusIndex.value = Number(index) - 1
  }
}
const funFocusInput = () => {
  // console.log('🚀 ~ funFocusInput ~ funFocusInput:', e)
  // var index = e.target.id.replace('input-', '')
  // if (number.value[index] != '') {
  //   number.value[index] = ''
  // }
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

const handleSave = () => {
  console.log(areAllValuesNonEmpty(number.value))
  if (!areAllValuesNonEmpty(number.value)) {
    uni.showToast({
      icon: 'none',
      title: 'Please enter pin'
    })
    handleFocus()
    return
  }
  if (pageType.value === 'set') {
    setPin()
  } else {
    // editPin()
  }
}

async function setPin() {
  let params = {
    pin: `${number.value[0]}${number.value[1]}${number.value[2]}${number.value[3]}`
  }
  console.log(params)
  const [e, r] = await api.setPin(params)
  if (!e && r) {
    if (r?.success) {
      uni.showToast({
        icon: 'none',
        title: 'Set pin success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    } else {
      handleFocus()
    }
  } else {
    handleFocus()
  }
}

// async function editPin() {
//   let params = {
//     pin: `${number.value[0]}${number.value[1]}${number.value[2]}${number.value[3]}`
//   }
//   console.log(params)
//   const [e, r] = await api.editPin(params)
//   if (!e && r) {
//     if (r?.success) {
//       uni.showToast({
//         icon: 'none',
//         title: 'Edit pin success'
//       })
//       setTimeout(() => {
//         uni.navigateBack()
//       }, 2000)
//     }
//   }
// }

function areAllValuesNonEmpty(obj: any) {
  return Object.values(obj).every((value) => {
    return value !== null && value !== undefined && value !== ''
  })
}

const handleFocus = () => {
  focusIndex.value = -1
  setTimeout(() => {
    focusIndex.value = 0
    console.log(focusIndex.value)
  }, 10)
}
</script>
<template>
  <view class="common-bg" @click="handleFocus">
    <NavBar v-bind="navBar"></NavBar>
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
      <view class="btn" @click.stop="handleSave">
        {{ pageType === 'set' ? $t('setting.setting17') : $t('setting.setting18') }}
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
