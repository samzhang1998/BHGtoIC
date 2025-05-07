<script setup lang="ts">
// import { useFunds } from './hooks/useFunds'
import { useLocale } from '@/hooks/useLocale'
import { useEntity } from '@/pages/investment/hooks/useEntity'
import { useFunds } from './hooks/useFunds'
import { wrapperEnv } from '@/utils/env'

// import { isEmail, isPhone } from '@/utils'
// import { useDict } from '@/hooks/useDict'
// import { useLocale } from '@/hooks/useLocale'
const { getEntityAll } = useEntity()
const { handleLanguageChange } = useLocale()
const { getFundsDetail } = useFunds()

const navBar = ref({
  isNotification: true,
  backgroundColor: '#fff',
  isBack: true
})

const { VITE_APP_BASE_URL } = wrapperEnv

//页面参数
const fId = ref('')
const pageType = ref(0)
const lang = ref(false)
const fundInfo = ref<AnyObj>({})
const selectEntity = ref<number>(0)
const entityList = ref<AnyObj[]>([])
const loginForm = ref<any>(null)
const entityType = ref('') //company  trust   individual

const formData = ref({
  //1
  fullName: '',
  acn1Check: false,
  acn1: '',
  abn1Check: false,
  abn1: '',
  abn2Check: false,
  abn2: '',
  //2
  address: '',
  //3
  contactName: '',
  telephoneNoWork: '',
  telephoneNoHome: '',
  facsimileNo: '',
  mobile: '',
  email: '',
  dateOfBirth: '',
  //4
  tfn: '',
  //5
  numberOfUnits: '',
  totalSubscriptionAmount: 0,
  gainfulEmployment: false,
  inheritance: false,
  businessActivity: false,
  superannuationSavings: false,
  financialInvestments: false,
  other: false,
  otherText: '',
  //7
  nameOfFinancialInstitution: '',
  branchAddress: '',
  accountName: '',
  bsbNumber: '',
  accountNumber: '',
  //9
  withheldTax: false,
  spaceProvidedBelow: '',
  //10
  signature1: '',
  signature2: '',
  printName1: '',
  printName2: '',
  signatureOfWitness: '',
  nameOfWitness: '',
  nameOfTrustee: '',
  nameOfSMSF: ''
})

const rules = {
  fullName: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Full Name'
      }
    ]
  },
  acn1Check: {
    rules: [
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value) {
            if (formData.value.acn1 === '') {
              callback(`Please input ACN`)
            }
          }
          return true
        }
      }
    ]
  },
  abn1Check: {
    rules: [
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value) {
            if (formData.value.abn1 === '') {
              callback(`Please input ABN`)
            }
          }
          return true
        }
      }
    ]
  },
  abn2Check: {
    rules: [
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value) {
            if (formData.value.abn2 === '') {
              callback(`Please input ABN`)
            }
          }
          return true
        }
      }
    ]
  },
  numberOfUnits: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Number of Units'
      },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value < 100000) {
            callback(`The minimum subscription is 100,000`)
          }
          return true
        }
      }
    ]
  },
  totalSubscriptionAmount: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Total Subscription Amount'
      }
    ]
  },
  other: {
    rules: [
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value) {
            if (formData.value.otherText === '') {
              callback(`Please specify`)
            }
          }
          return true
        }
      }
    ]
  },
  bsbNumber: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input bsb'
      }
    ]
  },
  accountNumber: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Account Number'
      }
    ]
  },
  withheldTax: {
    rules: [
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          if (value) {
            if (formData.value.spaceProvidedBelow === '') {
              callback(`Please input space provided below`)
            }
          }
          return true
        }
      }
    ]
  },
  printName1: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Print Name'
      }
    ]
  },
  printName2: {
    rules: [
      {
        required: true,
        errorMessage: 'Please input Print Name'
      }
    ]
  },
  signature1: {
    rules: [
      {
        required: true,
        errorMessage: 'Please save signature'
      }
    ]
  },
  signature2: {
    rules: [
      {
        required: true,
        errorMessage: 'Please save signature'
      }
    ]
  }
}

//签名区
const signatureRef = ref<any>(null)
const signatureRef2 = ref<any>(null)
const signatureRef3 = ref<any>(null)
const penColor = ref(null)
const penSize = ref(5)
// const url = ref('')
const openSmooth = ref(true)

onLoad((options) => {
  console.log(options)
  fId.value = options?.fId
  getEntityList()
  getFundInfo()
  getInfo()
})

onMounted(() => {})

onShow(() => {
  lang.value = uni.getLocale() === 'en'
})

const getEntityList = async () => {
  const data = await getEntityAll()
  entityList.value = data || []
  const item = entityList.value[selectEntity.value]
  formData.value.fullName = item?.entityName || ''
  // [Address line], [Suburb] [State] [Postcode]
  formData.value.address = `${item?.addressLine} ${item?.suburb} ${item?.state} ${item?.postcode}` || ''
  formData.value.contactName = item?.entityName || ''
  formData.value.email = item?.emailList[0] || ''
  formData.value.accountName = item?.accountName || ''
  formData.value.bsbNumber = item?.bsb || ''
  formData.value.accountNumber = item?.accountNumber || ''
  formData.value.nameOfSMSF = item?.entityName || ''
  formData.value.withheldTax = item?.withheldTax || false
  //Australia
  formData.value.spaceProvidedBelow = item?.withheldTax ? '' : 'Australia'
  const type = item?.entityType || ''
  if (type.toUpperCase() === 'Individual'.toUpperCase() || type.toUpperCase() === 'Joint Holding'.toUpperCase()) {
    entityType.value = 'individual'
  } else if (type.toUpperCase() === 'Company'.toUpperCase()) {
    entityType.value = 'company'
  } else {
    entityType.value = 'trust'
  }
  // entityType.value = 'trust'
  console.log('22222', formData.value)

  // entityType.value = item?.entityType==='Individual'||'Joint Holding'?'individual' || 'individual'

  console.log('🚀 ~ file: index.vue:21 ~ getEntityList ~ data:', entityList.value)
}

const getFundInfo = async () => {
  const data = await getFundsDetail({
    id: fId.value
    // id: 71
  })
  // console.log('🚀 ~ file: detail.vue:32 ~ getFundInfo ~ data:', data)
  fundInfo.value = data || {}
}

async function getInfo() {
  let params = {}
  const [e, r] = await api.getUserInfo(params)
  if (!e && r) {
    if (r?.success) {
      // console.log('r?.data', r?.data)
      const info = r?.data || {}
      formData.value.mobile = info?.phone || ''
      formData.value.dateOfBirth = info?.birthday || ''
    }
  }
}

const handleChange = () => {
  lang.value = !lang.value
  handleLanguageChange(lang.value ? 'en' : 'zh-Hans')
}

const handlePageType = (type: string) => {
  if (type === 'prev') {
    pageType.value = pageType.value > 0 ? pageType.value - 1 : pageType.value
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 200
    })
  } else {
    if (loginForm.value) {
      loginForm.value
        .validate()
        .then(() => {
          // console.log(formData.value)
          if (pageType.value === 5) {
            if (
              !formData.value.gainfulEmployment &&
              !formData.value.inheritance &&
              !formData.value.businessActivity &&
              !formData.value.superannuationSavings &&
              !formData.value.financialInvestments &&
              !formData.value.other
            ) {
              uni.showToast({
                icon: 'none',
                title: 'Please select one'
              })
              return
            }
          }
          if (type === 'next') {
            pageType.value = pageType.value > 10 ? pageType.value : pageType.value + 1
            uni.pageScrollTo({
              scrollTop: 0,
              duration: 200
            })
          }
        })
        .catch((err: any) => {
          console.log('err', err)
        })
    } else {
      if (type === 'next') {
        pageType.value = pageType.value > 10 ? pageType.value : pageType.value + 1
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 200
        })
      }
    }
  }
}

const handlePickerEntity = (e: AnyObj) => {
  selectEntity.value = e.detail.value
  const item = entityList.value[selectEntity.value]
  formData.value.fullName = item?.entityName || ''
  formData.value.address = `${item?.addressLine} ${item?.suburb} ${item?.state} ${item?.postcode}` || ''
  formData.value.contactName = item?.entityName || ''
  // formData.value.mobile = item?.addressLine || ''
  formData.value.email = item?.emailList[0] || ''
  // formData.value.dateOfBirth = item?.addressLine || ''
  formData.value.accountName = item?.accountName || ''
  formData.value.bsbNumber = item?.bsb || ''
  formData.value.accountNumber = item?.accountNumber || ''
  formData.value.withheldTax = item?.withheldTax || false
  formData.value.nameOfSMSF = item?.entityName || ''
  formData.value.spaceProvidedBelow = item?.withheldTax ? '' : 'Australia'

  const type = item?.entityType || ''

  if (type.toUpperCase() === 'Individual'.toUpperCase() || type.toUpperCase() === 'Joint Holding'.toUpperCase()) {
    entityType.value = 'individual'
  } else if (type.toUpperCase() === 'Company'.toUpperCase()) {
    entityType.value = 'company'
  } else {
    entityType.value = 'trust'
  }
}

const handleCheckbox = (type: string) => {
  if (type === 'acn1') {
    formData.value.acn1Check = !formData.value.acn1Check
  } else if (type === 'abn1') {
    formData.value.abn1Check = !formData.value.abn1Check
  } else if (type === 'abn2') {
    formData.value.abn2Check = !formData.value.abn2Check
  } else if (type === 'gainfulEmployment') {
    formData.value.gainfulEmployment = !formData.value.gainfulEmployment
  } else if (type === 'inheritance') {
    formData.value.inheritance = !formData.value.inheritance
  } else if (type === 'businessActivity') {
    formData.value.businessActivity = !formData.value.businessActivity
  } else if (type === 'superannuationSavings') {
    formData.value.superannuationSavings = !formData.value.superannuationSavings
  } else if (type === 'financialInvestments') {
    formData.value.financialInvestments = !formData.value.financialInvestments
  } else if (type === 'other') {
    formData.value.other = !formData.value.other
  }
}

//签名区操作
const onClick = (type: string, ref: any) => {
  if (type == 'openSmooth') {
    openSmooth.value = !openSmooth.value
    return
  }
  if (type == 'save') {
    if (ref === 1) {
      signatureRef.value.canvasToTempFilePath({
        success: (res: any) => {
          // 是否为空画板 无签名
          // console.log(res)
          // 生成图片的临时路径
          // H5 生成的是base64
          if (!res.isEmpty) {
            formData.value.signature1 = res.tempFilePath
          }
        }
      })
    } else if (ref === 2) {
      signatureRef2.value.canvasToTempFilePath({
        success: (res: any) => {
          // 是否为空画板 无签名
          // console.log(res)
          // 生成图片的临时路径
          // H5 生成的是base64
          if (!res.isEmpty) {
            formData.value.signature2 = res.tempFilePath
          }
        }
      })
    } else {
      signatureRef3.value.canvasToTempFilePath({
        success: (res: any) => {
          // 是否为空画板 无签名
          // console.log(res)
          // 生成图片的临时路径
          // H5 生成的是base64
          if (!res.isEmpty) {
            formData.value.signatureOfWitness = res.tempFilePath
          }
        }
      })
    }
    return
  }
  // if (type == 'undo') {
  //   if (ref === 1) {
  //     signatureRef.value.undo()
  //   } else {
  //     signatureRef2.value.undo()
  //   }
  // }
  // if (type == 'redo') {
  //   if (ref === 1) {
  //     signatureRef.value.redo()
  //   } else {
  //     signatureRef2.value.redo()
  //   }
  // }
  if (type == 'clear') {
    if (ref === 1) {
      signatureRef.value.clear()
    } else if (ref === 2) {
      signatureRef2.value.clear()
    } else {
      signatureRef3.value.clear()
    }
  }
}

const handleSubmit = () => {
  if (loginForm.value) {
    loginForm.value
      .validate()
      .then(() => {
        // console.log(formData.value)
        saveApplicationForm()
      })
      .catch((err: any) => {
        console.log('err', err)
      })
  }
}

async function saveApplicationForm() {
  const item = entityList.value[selectEntity.value]
  const type = item?.entityType || ''
  const files: AnyObj[] = []
  console.log(formData.value)

  let params: AnyObj = {
    entityId: entityList.value[selectEntity.value].id,
    //1
    iCheck: type.toUpperCase() === 'Individual'.toUpperCase() ? true : false,
    jhCheck: type.toUpperCase() === 'Joint Holding'.toUpperCase() ? true : false,
    cCheck: type.toUpperCase() === 'Company'.toUpperCase() ? true : false,
    ftiCheck: type.toUpperCase() === 'Family Trust (Individual)'.toUpperCase() ? true : false,
    ftcCheck: type.toUpperCase() === 'Family Trust (Corporate Trustee)'.toUpperCase() ? true : false,
    sfiCheck: type.toUpperCase() === 'Superannuation Fund (Individual)'.toUpperCase() ? true : false,
    sfcCheck: type.toUpperCase() === 'Superannuation Fund (Corporate Trustee)'.toUpperCase() ? true : false,
    tiCheck: type.toUpperCase() === 'Trust (Individual)'.toUpperCase() ? true : false,
    tcCheck: type.toUpperCase() === 'Trust (Corporate)'.toUpperCase() ? true : false,
    fullName: formData.value.fullName,
    caCheck: formData.value.acn1Check,
    acn: formData.value.acn1,
    cbCheck: formData.value.abn1Check,
    abn: formData.value.abn1,
    taCheck: formData.value.abn2Check,
    trustAbn: formData.value.abn2,
    //2
    address: formData.value.address,
    //3
    contactName: formData.value.contactName,
    workTel: formData.value.telephoneNoWork,
    homeTel: formData.value.telephoneNoHome,
    faNo: formData.value.facsimileNo,
    mobile: formData.value.mobile,
    email: formData.value.email,
    birthday: formData.value.dateOfBirth,
    //4
    TFN: formData.value.tfn,
    //5
    units: formData.value.numberOfUnits,
    amount: formData.value.totalSubscriptionAmount,
    geCheck: formData.value.gainfulEmployment,
    igCheck: formData.value.inheritance,
    baCheck: formData.value.businessActivity,
    ssCheck: formData.value.superannuationSavings,
    fiCheck: formData.value.financialInvestments,
    otherCheck: formData.value.other,
    otherDesc: formData.value.otherText,
    //7
    faName: formData.value.nameOfFinancialInstitution,
    bAddress: formData.value.branchAddress,
    accountName: formData.value.accountName,
    bsb: formData.value.bsbNumber,
    account: formData.value.accountNumber,
    //9
    taxResidency: formData.value.spaceProvidedBelow
  }
  if (entityType.value === 'individual') {
    params.iSignature = formData.value.printName1
    // params.iSign = formData.value.signature1
    // params.iSignatureTwo = formData.value.printName2
    // params.iSignTwo = formData.value.signature2
    // params.iSignThree = formData.value.signatureOfWitness
    params.iSignatureThree = formData.value.nameOfWitness
    files.push({
      name: 'iSign',
      uri: formData.value.signature1
    })
    // files.push({
    //   name: 'iSignTwo',
    //   uri: formData.value.signature2
    // })
    files.push({
      name: 'iSignThree',
      uri: formData.value.signatureOfWitness
    })
  } else if (entityType.value === 'company') {
    params.cSignature = formData.value.printName1
    // params.cSign = formData.value.signature1
    // params.cSignatureTwo = formData.value.printName2
    // params.cSignTwo = formData.value.signature2
    files.push({
      name: 'cSign',
      uri: formData.value.signature1
    })
    // files.push({
    //   name: 'cSignTwo',
    //   uri: formData.value.signature2
    // })
  } else {
    params.executed = formData.value.nameOfTrustee
    params.tName = formData.value.nameOfSMSF
    if (
      entityList.value[selectEntity.value].entityType.toUpperCase() !== 'Trust (Individual)'.toUpperCase() &&
      entityList.value[selectEntity.value].entityType.toUpperCase() !== 'Family Trust (Individual)'.toUpperCase() &&
      entityList.value[selectEntity.value].entityType.toUpperCase() !== 'Superannuation Fund (Individual)'.toUpperCase()
    ) {
      params.tSignature = formData.value.printName1
      // params.tSign = formData.value.signature1
      // params.tSignatureTwo = formData.value.printName2
      // params.tSignTwo = formData.value.signature2
      files.push({
        name: 'tSign',
        uri: formData.value.signature1
      })
      // files.push({
      //   name: 'tSignTwo',
      //   uri: formData.value.signature2
      // })
    } else {
      params.tSignatureThree = formData.value.printName1
      // params.tSignFour = formData.value.signatureOfWitness
      params.tSignatureFour = formData.value.nameOfWitness
      files.push({
        name: 'tSignThree',
        uri: formData.value.signature1
      })
      files.push({
        name: 'tSignFour',
        uri: formData.value.signatureOfWitness
      })
    }
  }
  uni.showLoading()
  console.log('request form', params, files)
  uni.uploadFile({
    url: `${VITE_APP_BASE_URL}/api/v1/investment/sendApplicationForm`,
    files: files,
    formData: params,
    header: {
      token: uni.getStorageSync('userInfo')?.token || ''
    },
    success: (uploadFileRes) => {
      console.log('🚀 ~ saveApplicationForm ~ uploadFileRes:', uploadFileRes)

      const data = uploadFileRes?.data || '{}'
      uni.hideLoading()
      const data2 = JSON.parse(data)
      console.log('🚀 ~ saveApplicationForm ~ uploadFileRes:', data2)
      if (data2?.success) {
        uni.showToast({
          icon: 'none',
          title: 'Submit successfully, our staff will follow up shortly.'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      } else {
        uni.showToast({
          icon: 'none',
          title: data2?.message || data2?.errorMessage || data2?.errorMessage || 'network error'
        })
      }
    },
    fail: (fail) => {
      uni.hideLoading()
      console.log('error', fail)
      uni.showToast({
        icon: 'none',
        title: 'server error'
      })
    }
  })
}

const numberChange = (e: any) => {
  formData.value.totalSubscriptionAmount = e * 1
}
</script>
<template>
  <view class="common-bg">
    <NavBar v-bind="navBar"></NavBar>
    <view class="lang">
      <view></view>
      <view class="flex align-center justify-center" @click="handleChange">
        {{ lang ? 'English' : '中文' }}
        <uni-icons type="bottom" color="#000" size="16"></uni-icons>
      </view>
    </view>
    <view class="verification">
      <view class="item" v-if="pageType === 0">
        <view class="title p-b-40">BC FIRST Trust Application Form</view>
        <view class="text p-b-40">The Application Form should be completed and returned to:</view>
        <view class="text2 p-b-10">Operations</view>
        <view class="text2 p-b-10">Infinity Alpha</view>
        <view class="text2 p-b-10">example, North Sydney NSW 2060</view>
        <view class="text2 p-b-40">
          (or emailed to
          <text class="text-blue">operations@infinityalpha.com.au</text>
          with the original to follow in the mail)
        </view>
        <view class="text p-b-40">
          This Application Form is distributed together with the Supplementary Information Memorandum dated 19 July 2024
          (<text class="text-bold">Information Memorandum</text>) for
          {{ !lang ? fundInfo?.nameCN || fundInfo?.name : fundInfo?.name }}. The trustee for
          {{ !lang ? fundInfo?.nameCN || fundInfo?.name : fundInfo?.name }} is IC Pty Ltd (<text class="text-bold"
            >Trustee</text
          >). {{ !lang ? fundInfo?.nameCN || fundInfo?.name : fundInfo?.name }} will invest in a loan to Sunshine
          Contracting Group Pty Ltd (ACN 629 078 486) (the <text class="text-bold">SCG Loan</text>). This Application
          Form is personal to the recipient of the Information Memorandum and must not be passed on to third parties.
        </view>
        <view class="text p-b-40">
          This is the application form for the
          {{ !lang ? fundInfo?.nameCN || fundInfo?.name : fundInfo?.name }} which is incorporating the Master Trust Deed
          terms
        </view>
        <view class="text p-b-40">
          Prospective investors wishing to invest in
          {{ !lang ? fundInfo?.nameCN || fundInfo?.name : fundInfo?.name }} should complete this application form.
        </view>
      </view>
      <view class="item" v-if="pageType === 1">
        <view class="title2 p-b-40">1.Applicants Full Name and Details*</view>
        <view class="fund">
          <picker @change="handlePickerEntity" :value="selectEntity" range-key="entityName" :range="entityList">
            <view class="picker flex justify-center align-center">
              {{ entityList[selectEntity]?.entityName }}
            </view>
          </picker>
        </view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <view class="form-name">Full Name: e.g. ABC Pty Ltd atf DEF Family Trust</view>
          <uni-forms-item label="Full Name" name="fullName" :label-width="300" required>
            <view class="input">
              <uni-easyinput v-model="formData.fullName" placeholder="" />
            </view>
          </uni-forms-item>
          <view class="form-name">Trustee/ Company registration Number (if applicable)</view>
          <uni-forms-item label="ACN" name="acn1Check" :label-width="300" :required="formData.acn1Check">
            <view class="flex justify-between align-center">
              <checkbox-group @change="handleCheckbox('acn1')">
                <checkbox :checked="formData.acn1Check" />
              </checkbox-group>
              <view class="input">
                <uni-easyinput v-model="formData.acn1" placeholder="" />
              </view>
            </view>
          </uni-forms-item>
          <uni-forms-item label="ABN" name="abn1Check" :label-width="300" :required="formData.abn1Check">
            <view class="flex justify-between align-center">
              <checkbox-group @change="handleCheckbox('abn1')">
                <checkbox :checked="formData.abn1Check" />
              </checkbox-group>
              <view class="input">
                <uni-easyinput v-model="formData.abn1" placeholder="" />
              </view>
            </view>
          </uni-forms-item>
          <view class="form-name">Trust ABN (if applicable)</view>
          <uni-forms-item label="ABN" name="abn2Check" :label-width="300" :required="formData.abn2Check">
            <view class="flex justify-between align-center">
              <checkbox-group @change="handleCheckbox('abn2')">
                <checkbox :checked="formData.abn2Check" />
              </checkbox-group>
              <view class="input">
                <uni-easyinput v-model="formData.abn2" placeholder="" />
              </view>
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="item" v-if="pageType === 2">
        <view class="title2 p-b-40">2.Applicants Address</view>
        <view class="text">
          Please include Level/Unit no., Street number and Street name, Suburb, City or Town, State and Postcode.
        </view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <view class="form-name">This address will be used for mailing purposes</view>
          <uni-forms-item label="Address" name="address" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.address" placeholder="" type="textarea" />
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="item" v-if="pageType === 3">
        <view class="title2 p-b-40">3. Applicants Contact Details</view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <uni-forms-item label="Contact Name" name="contactName" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.contactName" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Telephone No. (work)" name="telephoneNoWork" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.telephoneNoWork" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Telephone No. (home)" name="telephoneNoHome" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.telephoneNoHome" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Facsimile No." name="facsimileNo" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.facsimileNo" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Mobile" name="mobile" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.mobile" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Email" name="email" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.email" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Date of Birth" name="dateOfBirth" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.dateOfBirth" placeholder="" />
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="item" v-if="pageType === 4">
        <view class="title2 p-b-40">4.Applicants Tax File Number (“TFN”) or Exemption Code</view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <uni-forms-item label="TFN" name="tfn" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.tfn" type="number" placeholder="" maxlength="9" />
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="item" v-if="pageType === 5">
        <view class="title2 p-b-40">5.Your Investment</view>
        <view class="text">
          The minimum subscription is 100,000 units with a Unit Price of $1 per unit. Subscriptions for amounts in
          excess of this must be in multiples of 25,000 units.
        </view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <view class="form-name text-bold">Investment amount</view>
          <uni-forms-item label="Number of Units" name="numberOfUnits" :label-width="300" required>
            <view class="input">
              <uni-easyinput v-model="formData.numberOfUnits" type="number" placeholder="" @input="numberChange" />
            </view>
          </uni-forms-item>
          <uni-forms-item
            label="Total Subscription Amount (Number of units x $1)"
            name="totalSubscriptionAmount"
            :label-width="300"
            required
          >
            <view class="input padding-left-10">
              ${{ formData.totalSubscriptionAmount }}
              <!-- <uni-easyinput v-model="formData.totalSubscriptionAmount" type="number" placeholder="" :disabled="true" /> -->
            </view>
          </uni-forms-item>
          <view class="form-name text-bold require">Source of Investment Funds</view>
          <view class="form-name">Please identify the source of your investable assets or wealth:</view>
          <uni-forms-item label="" name="gainfulEmployment" :label-width="300">
            <view class="flex align-center">
              <checkbox-group @change="handleCheckbox('gainfulEmployment')">
                <checkbox :checked="formData.gainfulEmployment" />
              </checkbox-group>
              <view class="text"> Gainful employment </view>
            </view>
          </uni-forms-item>
          <uni-forms-item label="" name="inheritance" :label-width="300">
            <view class="flex align-center">
              <checkbox-group @change="handleCheckbox('inheritance')">
                <checkbox :checked="formData.inheritance" />
              </checkbox-group>
              <text class="text"> Inheritance/gift </text>
            </view>
          </uni-forms-item>
          <uni-forms-item label="" name="businessActivity" :label-width="300">
            <view class="flex align-center">
              <checkbox-group @change="handleCheckbox('businessActivity')">
                <checkbox :checked="formData.businessActivity" />
              </checkbox-group>
              <text class="text"> Business activity </text>
            </view>
          </uni-forms-item>
          <uni-forms-item label="" name="superannuationSavings" :label-width="300">
            <view class="flex align-center">
              <checkbox-group @change="handleCheckbox('superannuationSavings')">
                <checkbox :checked="formData.superannuationSavings" />
              </checkbox-group>
              <text class="text"> Superannuation savings </text>
            </view>
          </uni-forms-item>
          <uni-forms-item label="" name="financialInvestments" :label-width="300">
            <view class="flex align-center">
              <checkbox-group @change="handleCheckbox('financialInvestments')">
                <checkbox :checked="formData.financialInvestments" />
              </checkbox-group>
              <text class="text"> Financial investments </text>
            </view>
          </uni-forms-item>
          <uni-forms-item label="" name="otherText" :label-width="300">
            <view class="flex align-center">
              <checkbox-group @change="handleCheckbox('other')">
                <checkbox :checked="formData.other" />
              </checkbox-group>
              <text class="text"> Other – please specify </text>
            </view>
          </uni-forms-item>
          <uni-forms-item label="" name="other" :label-width="300" :required="formData.other">
            <view class="input">
              <uni-easyinput v-model="formData.otherText" placeholder="" />
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="item" v-if="pageType === 6">
        <view class="title2 p-b-40">6.Payment Details</view>
        <view class="text p-b-40"
          >Monies paid in respect of an Application and any amount of application fee is paid to Perpetual Corporate
          Trust Limited’s bank account and upon the Application being accepted, the funds are transferred to the
          relevant IC trust account, with the application fee being paid to the Fund Manager.</view
        >
        <view class="text p-b-40">
          Upon submitting this Application, please make a payment of the amount of the Total Subscription Amount to the
          following account:
        </view>
        <view class="flex p-b-40">
          <view class="text text-bold width-40">Full Account Name</view>
          <view class="width-60">
            <view><text class="text-bold">IC Debt</text> Income Master Fund ACC 105</view>
            <view> (<text class="text-bold">Short Name:</text> IC DIMF ACC 105)</view>
          </view>
        </view>
        <view class="flex p-b-40">
          <view class="text text-bold width-40">Account Number</view>
          <view class="width-60">333303632</view>
        </view>
        <view class="flex p-b-40">
          <view class="text text-bold width-40">BSB</view>
          <view class="width-60">082 309</view>
        </view>
        <view class="flex p-b-40">
          <view class="text text-bold width-40">SWIFT code</view>
          <view class="width-60">NATAAU3303M</view>
        </view>
        <view class="flex p-b-40">
          <view class="text text-bold width-40">Reference</view>
          <view class="width-60">Investor Name or Investment Entity Name Trust</view>
        </view>
      </view>
      <view class="item" v-if="pageType === 7">
        <view class="title2 p-b-40">7.Direct Credit of Distributions</view>
        <view class="text p-b-40"
          >Please direct credit all distributions on the holdings as registered in the above names to the following
          financial institution account. This instruction is only applicable to banks, building societies and credit
          unions within Australia. If no account details are provided, amounts will be sent by cheque to the above
          address.</view
        >
        <view class="text p-b-40">
          (This instruction also applies for all non-resident Australian Investors who wish distributions to be
          electronically transferred).
        </view>
        <view class="text p-b-40"> (Account name must be that of the name of the Applicant). </view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <uni-forms-item label="Name of Financial Institution" name="nameOfFinancialInstitution" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.nameOfFinancialInstitution" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Branch Address" name="branchAddress" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.branchAddress" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="Account Holder’s Name" name="accountName" :label-width="300">
            <view class="input">
              <uni-easyinput v-model="formData.accountName" placeholder="" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="BSB Number" name="bsbNumber" :label-width="300" required>
            <view class="input">
              <view class="p-l-20">{{ formData.bsbNumber }}</view>
              <!-- <uni-easyinput v-model="formData.bsbNumber" placeholder="" disabled /> -->
            </view>
          </uni-forms-item>
          <uni-forms-item label="Account Number" name="accountNumber" :label-width="300" required>
            <view class="input">
              <view class="p-l-20">{{ formData.accountNumber }}</view>
              <!-- <uni-easyinput v-model="formData.accountNumber" placeholder="" disabled /> -->
            </view>
          </uni-forms-item>
        </uni-forms>
        <view class="text p-b-10"> The account may only be in the name(s) of the registered investor(s). </view>
      </view>
      <view class="item" v-if="pageType === 8">
        <view class="title2 p-b-40">8.Privacy</view>
        <view class="text p-b-40">
          By completing this Application Form, the Applicant (You) agree to the Trustee and the Fund Manager (We or Us)
          collecting, holding and using personal information about you to process your application, and administer and
          manage the products and services we provide to you. This includes monitoring, auditing and evaluating those
          products and services, modelling data, data testing, communicating with you and dealing with any complaints or
          enquiries.
        </view>
        <view class="text p-b-40">
          You need not give us any of the personal information requested in the application form or in any other
          document or communication relating to the products or services we supply to you. However, without this
          information, we may not be able to process your application or provide to you with an appropriate level of
          service.
        </view>
        <view class="text p-b-40">
          Collection of tax file numbers is authorised by law and the Privacy Act. It is not an offence if you decide
          not to supply us with your tax file number, however if you do not give us your tax file number, or an ABN, we
          have to deduct tax at the highest rate plus Medicare Levy before we pay the distribution to you. If you have
          given us your tax file number, we will not deduct tax from your distribution. The Australian Taxation Office
          matches the information we are required to give it on your distribution with the details you put on your tax
          return.
        </view>
        <view class="text p-b-40">
          You agree to allow us to disclose your personal information to other companies in IC as well as our
          external service providers, which provide services in connection with our products and services.
        </view>
        <view class="text p-b-40"> We may also disclose your personal information: </view>
        <view class="text p-b-40">
          if, acting in good faith, we believe that the law requires or permits us to do so,
        </view>
        <view class="text p-b-40">if you consent, or </view>
        <view class="text p-b-40"> to any party proposing to acquire an interest in our business.</view>
        <view class="text p-b-40">
          Unless you tick the box below we and other companies in IC may use your personal information to offer
          you products or services that may be of interest to you.</view
        >
        <view class="text p-b-40">
          Under the Privacy Act 1988, you may request access to your personal information that we hold.
        </view>
        <view class="text p-b-40">
          You can contact us to make such a request or for any other reason relating to the privacy of your personal
          information by telephoning us on +1800 686 886 or writing to IC Pty Ltd of Suite 1001B, 53 Walker St,
          North Sydney NSW 2060.
        </view>
        <view class="text p-b-40">
          <radio :checked="true" color="#be9670" />
          {{ $t('login.login1') }}{{ $t('login.login2') }}
        </view>
      </view>
      <view class="item" v-if="pageType === 9">
        <view class="title2 p-b-40">9.Declaration</view>
        <view class="text p-b-40">
          I/We agree that this application relates to the issue of Units in
          {{ !lang ? fundInfo?.nameCN || fundInfo?.name : fundInfo?.name }} as set out in the Information Memorandum
          dated 19 July 2024;
        </view>
        <view class="text p-b-40">
          I/We have read and understood the Information Memorandum to which this Application Form relates, including the
          section titled Important Information section;
        </view>
        <view class="text p-b-40">
          I/We have made an offer to become an Investor in the Trust and that offer cannot be revoked;
        </view>
        <view class="text p-b-40">
          I/We agree that the Trustee may accept or reject my/our Application in whole or in part;
        </view>
        <view class="text p-b-40">
          I/We agree to be bound by the Trust Deed of the Trust (as it may be amended from time to time in the future)
          and agree that the allotment of Units to me/us constitutes acceptance of this application;
        </view>
        <view class="text p-b-40">
          I/We agree to be bound by the terms of issue of the Units as set out in the Information Memorandum and this
          Application Form;
        </view>
        <view class="text p-b-40">
          I/We declare that the information I/we have provided in this Application Form is true and correct;
        </view>
        <view class="text p-b-40">
          I/We confirm that I/we are not a ‘Retail Client’ as defined in the Corporations Act and am/are fully aware of
          the risks associated with an investment in the Trust;
        </view>
        <view class="text p-b-40">
          I/We confirm that I/we are Wholesale Client(s) as defined in the Corporations Act 2001 (Cth) and have provided
          all necessary supporting documentation required pursuant to this Application Form;
        </view>
        <view class="text p-b-40">
          I/We have not relied on any statements or representations made by any person (including the Trustee or its
          officers, employees or agents) prior to applying, other than those representations made in this Information
          Memorandum;
        </view>
        <view class="text p-b-40">
          I/We agree that the Information Memorandum and an investment in the Trust is governed by the laws of
          Australia, which may differ significantly from the laws of the jurisdiction from where you are from;
        </view>
        <view class="text p-b-40">
          I/We have had the opportunity to seek independent professional advice regarding the legal, taxation and
          financial implications of subscribing for the Units;
        </view>
        <view class="text p-b-40">
          I/We have relied entirely on our own due diligence or professional advice in considering the investment in the
          Trust;
        </view>
        <view class="text p-b-40">
          I/We declare that I/we have personally received the Information Memorandum accompanied by or attached to this
          Application Form;
        </view>
        <view class="text p-b-40">
          If investing as trustee, on behalf of a superannuation fund or trust I/we confirm that I/we am/are acting in
          accordance with my/our designated powers and authority under the trust deed. In the case of a superannuation
          fund, I/we also confirm that it is a complying regulated fund under the Superannuation Industry (Supervision)
          Act 1993 (Cth);
        </view>
        <view class="text p-b-40">
          I/We acknowledge that the Trustee nor any other person or entity guarantees the value or performance of my/
          our investment or any income or capital return from a Trust;
        </view>
        <view class="text p-b-40">
          I/We acknowledge that the Trustee may collect, store, use and disclose my/our personal information in
          accordance with the Privacy Act 1988 (Cth) as amended by the Privacy Amendment (Enhancing Privacy Protection)
          Act 2012 and the Trustee’s Privacy Policy referred to in Section 14 of the Information Memorandum;
        </view>
        <view class="text"> Please specify your tax residency in the space provided below. </view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <uni-forms-item label="" name="withheldTax" :label-width="300" :required="formData.withheldTax">
            <view class="input">
              <uni-easyinput v-model="formData.spaceProvidedBelow" placeholder="" type="textarea" />
            </view>
          </uni-forms-item>
        </uni-forms>
        <view class="text p-b-40">
          Please tick the box below if you are a US citizen or a foreign tax resident or a corporation/trust which is a
          foreign tax resident or has controlling persons (e.g. beneficiaries) who are foreign tax residents (this may
          include an Australian trust which has foreign tax residents as controlling persons).
        </view>
        <view class="text p-b-40">
          If you tick the box above, you agree to complete a self-certification form in respect of the FATCA/CRS.
        </view>
        <view class="text p-b-40">
          I/We confirm the information provided above in respect of our tax residency is correct;
        </view>
        <view class="text p-b-40">
          I/We agree that it is a condition of the issue of the Units, as requested by the Trustee or the Fund Manager,
          that if the Trust is an Australian Reporting Financial Institution for FATCA or a Reporting Financial
          Institution for CRS, to provide certain information required by them in order to comply with any applicable
          law relating to FATCA and/ or the CRS, and agrees to notify the Trustee and the Fund Manager if their tax
          residency changes while they are a unit holder in the Trust;
        </view>
        <view class="text p-b-40">
          I/We agree, if requested, to provide additional information and assistance and to comply with all reasonable
          requests to facilitate the Trustee’s compliance with AML/CTF laws in Australia or any equivalent laws in any
          overseas jurisdiction; and
        </view>
        <view class="text p-b-40">
          I/We agree that all of the information you have provided to us is complete, true and correct and I/We are duly
          authorised to make this Application and the Application is properly executed.
        </view>
        <view class="text p-b-40">
          The Applicant, whose full name and address appears above, hereby applies for the above specified number of
          Units in the Trust to be issued on the terms and conditions definitively set out in the Trust Deed, the key
          terms of which are set out in this Information Memorandum and a copy of which is available for inspection
          during business hours by contacting IC operations, whose details are set out below. Telephone +1800
          686 886, or email to operations@infinityalpha.com.au.
        </view>
      </view>
      <view class="item" v-if="pageType === 10">
        <view class="title2 p-b-40">10.Signatures</view>
        <view class="text p-b-40" v-if="entityType === 'individual'">
          If the Applicant is an <text class="text-bold">Individual</text>.
          <view>Executed as a deed by the Applicant in the presence of:</view>
        </view>
        <view class="text p-b-40" v-if="entityType === 'company'">
          If the Applicant is a <text class="text-bold">Company</text>.
          <view>Executed as a deed by the Applicant in accordance with Section 127 of the Corporations Act 2001:</view>
        </view>
        <view class="text p-b-40" v-if="entityType === 'trust'">
          If the Applicant is a <text class="text-bold">Trust or a Self Managed Superannuation Fund (SMSF)</text>.
          <view>Executed as a deed by:</view>
        </view>
        <uni-forms ref="loginForm" :rules="rules" :modelValue="formData" label-position="top">
          <view v-if="entityType === 'trust'">
            <uni-forms-item
              label="(Name of Trustee) in its capacity as trustee of the Applicant"
              name="nameOfTrustee"
              :label-width="300"
            >
              <view class="input">
                <uni-easyinput v-model="formData.nameOfTrustee" placeholder="" />
              </view>
            </uni-forms-item>
            <uni-forms-item label="Name of Trust or SMSF" name="nameOfSMSF" :label-width="300">
              <view class="input">
                <uni-easyinput v-model="formData.nameOfSMSF" placeholder="" />
              </view>
            </uni-forms-item>
          </view>
          <uni-forms-item
            :label="
              entityType === 'individual' ? 'Signature of Applicant (Individual)' : 'Signature Director/Secretary'
            "
            name="signature1"
            :label-width="300"
            required
          >
            <view class="signature">
              <l-signature
                disableScroll
                ref="signatureRef"
                :penColor="penColor"
                :penSize="penSize"
                :openSmooth="openSmooth"
              ></l-signature>
            </view>
            <view class="btn-box">
              <view class="s-btn" @click="onClick('clear', 1)">clear</view>
              <view class="s-btn" @click="onClick('save', 1)">save</view>
            </view>
            <image class="img" :src="formData.signature1" v-if="formData.signature1 !== ''"></image>
          </uni-forms-item>
          <uni-forms-item label="Print name" name="printName1" :label-width="300" required>
            <view class="input">
              <uni-easyinput v-model="formData.printName1" placeholder="" />
            </view>
          </uni-forms-item>
          <!-- <view v-if="entityList[selectEntity]?.emailList">
            <view
              v-if="
                entityList[selectEntity].emailList.length > 1 &&
                entityList[selectEntity].entityType.toUpperCase() !== 'Trust (Individual)'.toUpperCase() &&
                entityList[selectEntity].entityType.toUpperCase() !== 'Family Trust (Individual)'.toUpperCase() &&
                entityList[selectEntity].entityType.toUpperCase() !== 'Superannuation Fund (Individual)'.toUpperCase()
              "
            >
              <uni-forms-item
                :label="
                  entityType === 'individual'
                    ? 'Signature of Applicant (Individual) (if joint applicant)'
                    : 'Signature Director/Secretary'
                "
                name="signature2"
                :label-width="500"
                required
              >
                <view class="signature">
                  <l-signature
                    disableScroll
                    ref="signatureRef2"
                    :penColor="penColor"
                    :penSize="penSize"
                    :openSmooth="openSmooth"
                  ></l-signature>
                </view>
                <view class="btn-box">
                  <view class="s-btn" @click="onClick('clear', 2)">clear</view>
                  <view class="s-btn" @click="onClick('save', 2)">save</view>
                </view>
                <image class="img" :src="formData.signature2" v-if="formData.signature2 !== ''"></image>
              </uni-forms-item>
              <uni-forms-item label="Print name" name="printName2" :label-width="300" required>
                <view class="input">
                  <uni-easyinput v-model="formData.printName2" placeholder="" />
                </view>
              </uni-forms-item>
            </view>
          </view> -->
          <view v-if="entityList[selectEntity]?.entityType">
            <view v-if="entityList[selectEntity]?.entityType.toUpperCase() !== 'Company'.toUpperCase()">
              <uni-forms-item label="Signature of Witness" name="signatureOfWitness" :label-width="300">
                <!-- <view class="input">
                  <uni-easyinput v-model="formData.signatureOfWitness" placeholder="" />
                </view> -->
                <view class="signature">
                  <l-signature
                    disableScroll
                    ref="signatureRef3"
                    :penColor="penColor"
                    :penSize="penSize"
                    :openSmooth="openSmooth"
                  ></l-signature>
                </view>
                <view class="btn-box">
                  <view class="s-btn" @click="onClick('clear', 3)">clear</view>
                  <view class="s-btn" @click="onClick('save', 3)">save</view>
                </view>
                <image class="img" :src="formData.signatureOfWitness" v-if="formData.signatureOfWitness !== ''"></image>
              </uni-forms-item>
              <uni-forms-item label="Name of Witness" name="nameOfWitness" :label-width="300">
                <view class="input">
                  <uni-easyinput v-model="formData.nameOfWitness" placeholder="" />
                </view>
              </uni-forms-item>
            </view>
          </view>
        </uni-forms>
        <view class="btn" @click="handleSubmit">submit</view>
      </view>
      <view class="next-btn">
        <view class="left" v-if="pageType > 0" @click="handlePageType('prev')">PREVIOUS</view>
        <view class="right" v-if="pageType < 10" @click="handlePageType('next')">NEXT</view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.lang {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  font-size: 32rpx;
  font-style: normal;
  font-weight: 400;
  padding: 0 60rpx 20rpx;
  height: 80rpx;
}
.verification {
  padding: 0 40rpx 80rpx;
  overflow: hidden;
  .item {
    min-height: 800rpx;

    ::v-deep .uni-easyinput__content {
      border: none;
    }

    ::v-deep .content-clear-icon {
      color: #be9670 !important;
    }

    .form-name {
      color: #000;
      font-size: 28rpx;
      font-style: normal;
      font-weight: 400;
      padding: 20rpx 0;
    }

    .require::before {
      content: '*';
      color: #f56c6c;
      font-size: 30rpx;
      padding-right: 4rpx;
    }

    .input {
      width: 100%;
      min-height: 80rpx;
      border-radius: 20rpx;
      background: #fff;
      box-shadow: 0 8rpx 76rpx 0 rgba(189, 189, 189, 0.25);
      padding: 0 10rpx;
      display: flex;
      // justify-content: center;
      align-items: center;
    }

    .padding-left-10 {
      padding-left: 20rpx;
    }
  }
  .title {
    color: #333;
    font-size: 44rpx;
    font-style: normal;
    font-weight: 700;
  }

  .title2 {
    color: #333;
    font-size: 38rpx;
    font-style: normal;
    font-weight: 700;
  }

  .text {
    color: #333;
    font-size: 32rpx;
  }

  .text2 {
    color: #333;
    font-size: 32rpx;
    font-style: normal;
    font-weight: 700;
  }

  .text-blue {
    color: #0563c1;
  }

  .p-b-40 {
    padding-bottom: 40rpx;
  }

  .p-b-10 {
    padding-bottom: 10rpx;
  }

  .p-l-20 {
    padding: 0 20rpx;
  }

  .width-40 {
    width: 40%;
    // background: red;
  }

  .width-60 {
    width: 60%;
    // background: blue;
  }

  .text-bold {
    font-style: normal;
    font-weight: 700;
  }

  .next-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 100rpx;
    padding-top: 20rpx;

    .left,
    .right {
      width: 40%;
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
      margin-left: 20rpx;
    }
  }

  .fund {
    border: 1rpx solid #be9670;
    background: #d6bda5;
    color: #fff;
    font-size: 28rpx;
    font-style: normal;
    font-weight: 400;
    border-radius: 10rpx;

    .picker {
      min-height: 80rpx;
      padding: 0 20rpx;
    }
  }

  .item {
    .signature {
      width: 100%;
      height: 300rpx;
      background: #eee;
      // background: green;
      overflow: hidden;
    }

    .img {
      width: 100%;
      height: 300rpx;
      margin-top: 20rpx;
      display: block;
    }

    .btn-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20rpx;
      .s-btn {
        width: 40%;
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
      }
    }
  }

  .btn {
    margin-top: 40rpx;
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
    // position: fixed;
    // left: 45rpx;
    // bottom: 200rpx;
  }
}
</style>
