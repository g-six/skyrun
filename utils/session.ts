import { User } from 'data-types/user'

export const getLocalStorageItem = (str: string) =>
  localStorage?.getItem(str) as string

export const removeLocalStorageItem = (str: string) =>
  localStorage?.removeItem(str)

export const setLocalStorageItem = (str: string, data: string) =>
  localStorage?.setItem(str, data)

// sessions
export const getSessionTokens = () => getLocalStorageItem('tokens')

export const destroySessionTokens = () =>
  removeLocalStorageItem('tokens')

export const saveSessionTokens = (data: User) => {
  const { token, refresh_token } = data
  setLocalStorageItem(
    'tokens',
    JSON.stringify({ token, refresh_token })
  )
}

const local_storage_handlers = {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
}

export default local_storage_handlers
