import { useSystemStoreHook } from '@/store/modules/system'

export function useSystem() {
  const useSystemStore = useSystemStoreHook()
  const { systemInfo, isNotification } = storeToRefs(useSystemStore)

  function setNavBarHeight() {
    uni.getSystemInfo({
      success: function (e) {
        // console.log('systemInfo', e)
        useSystemStore.setSystemInfo(e)
      },
      fail(e) {
        console.log(e, '获取失败')
      }
    })
  }

  function setIsNotification(status: boolean) {
    useSystemStore.setIsNotification(status)
  }

  return { systemInfo, isNotification, setNavBarHeight, setIsNotification }
}
