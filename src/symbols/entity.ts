import type { InjectionKey, Ref } from 'vue'

interface EntityState {
  eId: Ref<string>
  info: AnyObj
}

/**
 * @description Popup InjectionKey Symbol
 */
export const EntityKey: InjectionKey<EntityState> = Symbol('entity')
