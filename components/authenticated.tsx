import { useRouter } from 'next/router'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { User } from 'data-types/user'
import { getSessionTokens } from 'utils/session'
import {
  AuthContext,
  constructDefaultContext,
  IAuthContext,
  IToast,
  setLocalUser,
} from 'context/auth-context'
import Navigation from './navigation'
import Toast from './ui/toast'
import { Disclosure } from '@headlessui/react'
import { Drawer } from './drawer'

interface AppWrapperProps {
  children: ReactElement
}

export function AppWrapper({ children }: AppWrapperProps) {
  const router = useRouter()
  const [refresh, setRefresh] = useState(true)
  const [context, setContext] = useState(constructDefaultContext())
  const setToast = (toast_args: IToast) => {
    setContext((prevState: IAuthContext) => ({
      ...prevState,
      context: {
        ...prevState.context,
        toast: {
          ...prevState.context.toast,
          ...toast_args,
        },
      },
    }))
  }

  const setUser = (user_args: User) => {
    setContext((prevState: IAuthContext) => {
      // populate local user to bypass between auth context wrappers
      setLocalUser(user_args)

      return {
        ...prevState,
        context: {
          ...prevState.context,
          user: {
            ...prevState.context.user,
            ...user_args,
          },
        },
      }
    })
  }

  const value = useMemo(
    () => ({
      ...context,
      setRefresh,
      setToast,
      setUser,
      // add context handlers here (with the above signature)..
    }),
    [context]
  )

  useEffect(() => {
    if (typeof window !== 'undefined' && refresh) {
      const sessions = JSON.parse(getSessionTokens())

      if (!sessions?.token) {
        if (router.pathname === '/') {
          router.push('/auth/signup')
        } else if (!router.pathname.includes('/auth')) {
          let params = ''
          if (typeof window !== 'undefined') {
            if (window.location && window.location.hash) {
              params = window.location.hash
            }
          }
          router.push(`/auth/login${params}`)
        }
      }

      if (sessions?.token) {
        if (
          router.pathname.includes('/auth') ||
          router.pathname === '/'
        ) {
          router.push('/dashboard')
        } else {
          // putting reroute of authenticated route to event loop
          // to make sure route is ready
          setTimeout(() => {
            router.push(router.asPath)
          }, 0)
        }
      }
      setRefresh(false)
    }

    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        // save changes on browser back button click
        setRefresh(true)
      }
      return true
    })

    return () => {
      router.beforePopState(() => true)
    }
  }, [router, refresh])

  return (
    <AuthContext.Provider value={value as unknown as IAuthContext}>
      {children}
    </AuthContext.Provider>
  )
}

export default function AuthedLayout({ children }: any) {
  const router = useRouter()
  const [is_collapsed, collapseDrawer] = useState<boolean>(true)
  return (
    <AppWrapper key="auth">
      <Disclosure as="div" className="w-full h-screen flex flex-col">
      {({ open }) => (<>
        <Navigation open={open} />
        <Toast />
        <div className='flex md:flex-row flex-col w-full flex-1'>
          <Disclosure.Panel>
            <Drawer />
          </Disclosure.Panel>

          <div className='hidden md:flex h-full'>
            <Drawer />
          </div>

          <section className='md:flex-1'>
            {children}
          </section>
        </div>
      </>)}
      </Disclosure>
    </AppWrapper>
  )
}
