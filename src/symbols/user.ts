import type { InjectionKey, Ref } from 'vue'

interface UserState {
  uId: Ref<string>
  info: AnyObj
}

/**
 * @description Popup InjectionKey Symbol
 */
export const UserKey: InjectionKey<UserState> = Symbol('user')
