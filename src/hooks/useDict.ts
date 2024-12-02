export function useDict() {
  async function getType(params: AnyObj) {
    const [e, r] = await api.queryDictionary(params)
    if (!e && r) {
      if (r?.success) {
        return r?.data || []
      }
    }
  }
  return { getType }
}
