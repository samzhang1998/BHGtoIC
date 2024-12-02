<script setup lang="ts">
import { useDict } from '@/hooks/useDict'
import { injectStrict } from '@/utils'

import { EntityKey } from '@/symbols/entity'

const entityForm = ref<any>(null)
const { eId } = injectStrict(EntityKey)
const { getType } = useDict()

const emits = defineEmits(['close'])
const entityItem = ref<AnyObj>({
  addressLine: '',
  emailList: [],
  entityName: '',
  entityType: '0',
  postcode: '',
  suburb: '',
  state: '',
  bhgId: ''
  // bsb: ''
})
const investorType = ref<AnyObj[]>([])
const rules = {
  addressLine: {
    rules: [{ required: true, errorMessage: 'please input address' }]
  },
  entityName: {
    rules: [{ required: true, errorMessage: 'please input entity name' }]
  },
  entityType: {
    rules: [{ required: true, errorMessage: 'please select investor Type' }]
  },
  postcode: {
    rules: [{ required: true, errorMessage: 'please input postcode' }]
  },
  suburb: {
    rules: [{ required: true, errorMessage: 'please input suburb' }]
  },
  state: {
    rules: [{ required: true, errorMessage: 'please input state' }]
  },
  emailList: {
    rules: [
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value.length <= 0) {
            callback(`please input email`)
          }
          return true
        }
      }
    ]
  }
}

onMounted(() => {
  getDetail()
})

const getDetail = async () => {
  const data = await getType({ dictType: 'investment_entity_type' })
  investorType.value = data || []

  let params = {
    entityId: eId.value
  }
  const [e, r] = await api.getEntityDetail(params)
  if (!e && r) {
    if (r?.success) {
      console.log('🚀 ~ file: EditEntity.vue:89 ~ getDetail ~ r:', r?.data)
      const findIndex = data.findIndex((i: AnyObj) => {
        return i.value === r?.data.entityType
      })
      if (findIndex !== -1) {
        entityItem.value.entityType = findIndex
      }
      const email = r?.data.emailList.map((i: any) => {
        return {
          email: i
        }
      })
      entityItem.value.addressLine = r?.data.addressLine || ''
      entityItem.value.emailList = email || []
      entityItem.value.entityName = r?.data.entityName || ''
      entityItem.value.postcode = r?.data.postcode || ''
      entityItem.value.suburb = r?.data.suburb || ''
      entityItem.value.state = r?.data.state || ''
      entityItem.value.bhgId = r?.data.bhgId || ''
      // entityItem.value.bsb = r?.data.bsb || ''
    }
  }
}

const handlePopupStatus = async () => {
  emits('close', false)
}

const handlePicker = (e: AnyObj) => {
  if (e.detail.value >= 0) {
    entityItem.value.entityType = e.detail.value
  }
}

const handleAddEmail = (type: string, index?: number) => {
  if (type === 'add') {
    entityItem.value.emailList.push({
      email: ''
    })
  } else {
    entityItem.value.emailList.splice(index, 1)
  }
}

const handleEditEntity = () => {
  entityForm.value
    .validate()
    .then(() => {
      handelEdit()
      // resetPassword()
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}

const handelEdit = async () => {
  const list = entityItem.value.emailList.map((item: AnyObj) => {
    return item.email
  })
  let params = {
    addressLine: entityItem.value.addressLine,
    bhgId: entityItem.value.bhgId,
    emailList: list,
    entityName: entityItem.value.entityName,
    entityType: investorType.value[entityItem.value.entityType].value,
    postcode: entityItem.value.postcode,
    suburb: entityItem.value.suburb,
    state: entityItem.value.state,
    // bsb: entityItem.value.bsb,
    id: eId.value
  }
  const [e, r] = await api.updateEntity(params)
  if (!e && r) {
    if (r?.success) {
      emits('close', false, 'open')
    }
  }
}
</script>

<template>
  <view class="pop">
    <view class="title">{{ $t('inv.inv12') }}</view>
    <view class="close">
      <uni-icons type="closeempty" size="20" color="#000" @click="handlePopupStatus()"></uni-icons>
    </view>
    <scroll-view class="pop-scroll" :scroll-y="true">
      <uni-forms ref="entityForm" :rules="rules" :modelValue="entityItem" label-position="top" err-show-type="toast">
        <uni-forms-item name="entityName">
          <view class="item">
            <view class="name">{{ $t('inv.inv13') }}</view>
            <view class="input">
              <uni-easyinput v-model="entityItem.entityName" placeholder="" />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="emailList">
          <view class="item">
            <view class="name">{{ $t('inv.inv14') }}</view>
            <view class="input" v-for="(item, index) in entityItem.emailList" :key="index">
              <view class="flex justify-between align-center">
                <uni-easyinput v-model="item.email" placeholder="" :clearable="false" :disabled="index === 0" />
                <view class="icon" v-if="index === 0" @click="handleAddEmail('add')">
                  <uni-icons type="plusempty" color="#BE9670" size="14"></uni-icons>
                </view>
                <view class="icon" v-else @click="handleAddEmail('del', index)">
                  <uni-icons type="closeempty" color="#939393" size="14"></uni-icons>
                </view>
              </view>
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="entityType">
          <view class="item" :class="entityItem.emailList.length > 1 ? 'm-t-26' : ''">
            <view class="name">{{ $t('inv.inv15') }}</view>
            <view class="input">
              <picker @change="handlePicker" :value="entityItem.entityType" range-key="code" :range="investorType">
                <view class="picker flex justify-between align-center">
                  <view>{{ investorType[entityItem.entityType]?.code }}</view>
                  <view>
                    <uni-icons type="bottom" color="#BE9670" size="14"></uni-icons>
                  </view>
                </view>
              </picker>
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="addressLine">
          <view class="item">
            <view class="name p-b-10">{{ $t('inv.inv16') }}</view>
            <view class="sub-name">{{ $t('inv.inv21') }}</view>
            <view class="input">
              <uni-easyinput v-model="entityItem.addressLine" placeholder="" />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="suburb">
          <view class="item m-t-26">
            <view class="sub-name">{{ $t('inv.inv17') }}</view>
            <view class="input">
              <uni-easyinput v-model="entityItem.suburb" placeholder="" />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="state">
          <view class="item">
            <view class="sub-name">{{ $t('inv.inv18') }}</view>
            <view class="input">
              <uni-easyinput v-model="entityItem.state" placeholder="" />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="postcode">
          <view class="item">
            <view class="sub-name">{{ $t('inv.inv19') }}</view>
            <view class="input">
              <uni-easyinput v-model="entityItem.postcode" placeholder="" />
            </view>
          </view>
        </uni-forms-item>
        <!-- <uni-forms-item name="postcode">
          <view class="item">
            <view class="sub-name">Bsb</view>
            <view class="input">
              <uni-easyinput v-model="entityItem.bsb" placeholder="" />
            </view>
          </view>
        </uni-forms-item> -->
      </uni-forms>
    </scroll-view>
    <view class="btn" @click="handleEditEntity">{{ $t('inv.inv20') }}</view>
  </view>
</template>

<style lang="scss" scoped>
.pop {
  height: 1270rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  background: #fff;
  position: relative;
  z-index: 101;
  padding: 60rpx 40rpx;

  .pop-scroll {
    height: 1000rpx;
  }

  .close {
    position: absolute;
    width: 24rpx;
    height: 24rpx;
    top: 60rpx;
    right: 40rpx;
    z-index: 102;
  }

  .title {
    color: #323232;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30rpx;
  }

  .item {
    min-height: 120rpx;

    .name {
      color: #333;
      font-size: 32rpx;
      font-style: normal;
      font-weight: 600;
    }

    .sub-name {
      color: #000;
      font-size: 28rpx;
      font-style: normal;
      font-weight: 500;
    }

    .input {
      border-bottom: 2rpx solid #ededed;
      color: #939393 !important;
      font-size: 28rpx !important;
      font-style: normal !important;
      font-weight: 400 !important;
    }

    .picker {
      height: 60rpx;
    }
  }

  ::v-deep .uni-easyinput__content {
    border: none;
    height: 60rpx;
    color: #939393 !important;
    font-size: 28rpx !important;
    font-style: normal !important;
    font-weight: 400 !important;
  }

  ::v-deep .uni-easyinput__content-input {
    padding: 0 !important;
  }

  ::v-deep .uni-forms-item__label {
    display: none !important;
  }

  ::v-deep .uni-forms-item {
    margin-bottom: 0 !important;
  }

  .text-BE9670 {
    color: #be9670;
    text-decoration-line: underline;
  }

  .btn {
    height: 88rpx;
    background: #be9670;
    color: #fff;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .p-b-10 {
    padding-bottom: 10rpx;
  }

  .m-t-30 {
    margin-top: 70rpx;
  }

  .m-t-26 {
    margin-top: 26rpx;
  }

  ::v-deep .content-clear-icon {
    color: #be9670 !important;
  }
}
</style>
