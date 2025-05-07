/**
 * @description:  根据定义的属性返回封装的环境变量
 */
function wrapperEnvFn() {
  const env = import.meta.env
  const ret: any = {}
  return function () {
    for (const envName of Object.keys(env)) {
      let realName = env[envName]
      realName = realName === 'true' ? true : realName === 'false' ? false : realName
      //启动端口
      if (envName === 'VITE_PORT') {
        realName = Number(realName)
      }
      ret[envName] = realName
    }
    return ret
  }
}

export const wrapperEnv = wrapperEnvFn()()
// export const wrapperEnv = () => {
//   const env = import.meta.env
//   const ret: Record<string, string | boolean | number> = {}

//   for (const key in env) {
//     let val: any = env[key]
//     if (val === 'true') val = true
//     else if (val === 'false') val = false
//     else if (key === 'VITE_PORT') val = Number(val)

//     ret[key] = val
//   }

//   return ret
// }
