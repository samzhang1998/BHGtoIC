export function useEntity() {
  const emailListProcess = computed(() => (str: any) => {
    if (str && str.length > 0) {
      return str.join(',')
    } else {
      return str
    }
  })

  async function getEntityAll() {
    const [e, r] = await api.getEntityAll({})
    if (!e && r) {
      return r.data || []
    }
  }

  async function getInvestmentAll(params: AnyObj) {
    const [e, r] = await api.getInvestmentAll(params)
    if (!e && r) {
      return r.data || []
    }
  }

  return { emailListProcess, getEntityAll, getInvestmentAll }
}
