export function useFunds() {
  const fundStatusList = [
    {
      name: 'now_open',
      show: 'Now Open',
      top: 'home.home6',
      bottom: 'home.home7',
      color: '#BE9670',
      class: 'status1'
    },
    {
      name: 'fully_invested',
      show: 'Fully Subscribed',
      top: 'home.home8',
      bottom: 'home.home9',
      color: '#47553F',
      class: 'status2'
    },
    {
      name: 'coming_soon',
      show: 'Coming Soon',
      top: 'home.home10',
      bottom: 'home.home11',
      color: '#404F71',
      class: 'status3'
    },
    {
      name: 'completed',
      show: 'Completed',
      top: 'home.home12',
      bottom: 'home.home13',
      color: '#555',
      class: 'status4'
    }
  ]

  const fundStatus = computed(() => (str: string) => {
    if (str) {
      const item: any = fundStatusList.find((item) => {
        return item.name === str
      })
      return item
    } else {
      return str
    }
  })

  const fundStatusStyle = computed(() => (str: string) => {
    if (str) {
      const item = fundStatusList.find((item) => {
        return item.name === str
      })
      return item?.class
    } else {
      return str
    }
  })

  async function getFundsAll(params: AnyObj) {
    const [e, r] = await api.homeFunds(params)
    if (!e && r) {
      return r.data || []
    }
  }

  async function getPopularData() {
    const params = {}
    const [e, r] = await api.homePopular(params)
    if (!e && r) {
      return r.data || []
    }
  }

  async function getFundsDetail(params: AnyObj) {
    const [e, r] = await api.getFundsDetail(params)
    if (!e && r) {
      return r.data || []
    }
  }
  return { fundStatus, fundStatusStyle, getFundsAll, getPopularData, getFundsDetail }
}
