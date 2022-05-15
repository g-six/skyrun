import { createContext } from 'react'
import { User } from 'data-types/user'
import { GenericObject } from 'data-types/validation'
import {
  getLocalStorageItem,
  getSessionTokens,
  setLocalStorageItem,
} from 'utils/session'
import { getApiRequest } from 'utils/fetch-helper'

// eslint-disable-next-line no-shadow
export enum ToastMode {
  SUCCESS = 'success',
  INFO = 'info',
  ERROR = 'error',
}

export interface IToast {
  component: string
  component_props: GenericObject
  data?: any
  header_text?: string
  message?: string
  mode: ToastMode
  timeout: number | 'infinite'
  visible: boolean
}

export interface IAuthContext {
  setRefresh: Function
  setToast: Function
  setUser: Function
  context: {
    toast: IToast
    user: User | null
    // add more context here...
  }
}

export const default_toast = {
  component_props: {},
  component: '',
  data: null,
  header_text: '',
  message: '',
  mode: ToastMode.SUCCESS,
  timeout: 3000, // 3 seconds automatic close
  visible: false,
}

export const default_context_values: IAuthContext = {
  setRefresh: () => {},
  setToast: () => {},
  setUser: () => {},
  context: {
    toast: default_toast,
    user: null,
    // add more context default values here..
  },
}

export function setLocalUser(user: User) {
  setLocalStorageItem('user', JSON.stringify(user))
}

export const AuthContext = createContext<IAuthContext>(
  default_context_values
)

// creating a custom fetch for session handling to avoid circular import
export const fetchProfile = async (
  sessions: Pick<User, 'token' | 'refresh_token'>
) => {
  if (sessions && sessions.token && sessions.refresh_token) {
    setLocalStorageItem(
      'tokens',
      JSON.stringify({ ...sessions, profile_fetched: true })
    )
    await getApiRequest('/auth/profile')
      .then((resp: any) => {
        setLocalUser(resp.record as User)
      })
      .catch(() => {})
  }
}

export function constructDefaultContext() {
  if (typeof window !== 'undefined') {
    const raw_data = getSessionTokens()
    const sessions = JSON.parse(raw_data)
    const temp_user = getLocalStorageItem('user')
    if (
      typeof temp_user !== 'undefined' &&
      !sessions?.profile_fetched &&
      sessions?.token
    ) {
      fetchProfile(sessions)
    }

    if (temp_user !== 'undefined') {
      const new_context = {
        ...default_context_values,
        context: {
          ...default_context_values.context,
          user: JSON.parse(temp_user),
        },
      }
      return new_context
    }
  }
  return default_context_values
}
