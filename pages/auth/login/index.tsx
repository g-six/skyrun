import { useState, ReactElement, useContext, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { saveSessionTokens } from 'utils/session'
import { AuthContext } from 'context/auth-context'
import { postApiRequest } from 'utils/fetch-helper'
import Layout from 'components/layout'
import { VersionBox } from 'components/ui/version-box'
import { AlertTriangleIcon, EyeIcon } from 'components/ui/basic-icons'
import { EyeOffIcon } from '@heroicons/react/solid'

export default function Login() {
  const router = useRouter()
  const { setUser, setRefresh } = useContext(AuthContext)
  const [hidden, setHidden] = useState(true)
  let hpid

  if (router && router.query) {
    const query = router.query as unknown as Record<string, string>
    hpid = query.id
  }

  const [data, setData] = useState<Record<string, string>>(
    hpid ? { hpid } : {}
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [has_login_errors, setHasLoginErrors] = useState<boolean>(false)
  const [attributes, setAttributes] = useState<Record<string, string>>(
    {}
  )
  const [is_loading, setIsLoading] = useState<boolean>(false)
  const [show_password, setShowPassword] = useState<boolean>(false)

  if (hpid && !data.hpid) {
    setData({
      hpid,
    })
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    setHasLoginErrors(false)
    setIsLoading(true)
    const response = await postApiRequest('/auth/login', attributes)
    setIsLoading(false)

    let redirect_to = `${getConfig().REDIRECT_EXPIREES_TO || ''}`
      .split('[cause]')
      .join('')

    if (
      (response.errors && response.type) ||
      (response.type && response.type === 'JavascriptError')
    ) {
      if (response.errors) {
        const updated_errors = {
          ...errors,
          ...response.errors,
        }
        setErrors(updated_errors)
      }
      setHasLoginErrors(true)
    } else if (response.type === 'NotAuthorizedException') {
      setHasLoginErrors(true)
    } else {
      if (response.redirect_to) {
        saveSessionTokens(response.record)
        setUser(response.record)
        setRefresh(true)
        let params = ''
        if (typeof window !== 'undefined') {
          if (window.location && window.location.hash) {
            params = window.location.hash
          }
        }
        redirect_to = `${response.redirect_to}${params}`
      }
      setTimeout(() => {
        router.push(redirect_to)
      }, 1200)
    }
  }

  function setAttribute(key: string, value: string) {
    setAttributes({
      ...attributes,
      [key]: value,
    })
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setHidden(false)
    }, 1500)

    return () => clearTimeout(handler)
  }, [hidden])

  return (
    <>
      <Head>
        <title>Feasly | Login</title>
        <meta name="description" content="Login" />
      </Head>
      <div
        className={`
          min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8
          ${ hidden && 'hide' }
        `}
      >
        <div className="max-w-md w-full px-8 py-10 bg-white rounded-2xl">
          <div className="pb-4">
            <img
              className="h-8 w-auto m-auto"
              src="/logo.png"
              alt="GREY"
            />
            <p className="mt-16 text-base text-blue-base">
              Log in to your account.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="pb-4">
              <div className="w-full mb-4">
                <label
                  htmlFor="txt_email"
                  className="block text-xs pb-2 text-blue-base"
                >
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm w-full">
                  <input
                    type="email"
                    name="email"
                    id="txt_email"
                    defaultValue={attributes.email}
                    onChange={e => {
                      setAttribute('email', e.target.value)
                    }}
                    className={`text-blue-base text-sm focus:ring block w-full h-10 px-2 border ${
                      Object.keys(errors).length
                        ? 'border-feedback-red border-opacity-30'
                        : 'border-neutral-gray-03'
                    } rounded-md hover:border-green-base`}
                  />
                </div>
              </div>
              <div className="my-2 w-full">
                <label
                  htmlFor="txt_password"
                  className="block text-xs pb-2 text-blue-base"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm w-full">
                  <input
                    type={show_password ? 'text' : 'password'}
                    name="password"
                    id="txt_password"
                    defaultValue={attributes.password}
                    onChange={e => {
                      setAttribute('password', e.target.value)
                    }}
                    className={`text-blue-base text-sm focus:ring block w-full h-10 px-2 border ${
                      Object.keys(errors).length
                        ? 'border-feedback-red border-opacity-30'
                        : 'border-neutral-gray-03'
                    } rounded-md hover:border-green-base`}
                  />
                  <button
                    type="button"
                    className={`absolute w-4 h-auto text-neutral-gray-01 hover:text-green-base cursor-pointer right-2 top-3 ${
                      show_password ? 'hidden' : ''
                    }`}
                    onClick={() => {
                      setShowPassword(true)
                    }}
                  >
                    <EyeIcon />
                  </button>
                  <button
                    type="button"
                    className={`absolute w-4 h-auto text-neutral-gray-01 hover:text-green-base cursor-pointer right-2 top-3 ${
                      !show_password ? 'hidden' : ''
                    }`}
                    onClick={() => {
                      setShowPassword(false)
                    }}
                  >
                    <EyeOffIcon />
                  </button>
                </div>
              </div>
              {has_login_errors && (
                <div className="mt-2 w-full flex flex-row">
                  <div className="text-feedback-red w-4 h-auto mr-2">
                    <AlertTriangleIcon />
                  </div>
                  <div className="text-neutral-gray-00 text-xs">
                    Oh no! Your email or password is not correct. Please
                    check and try again.
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={is_loading}
                className='button bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md h-10 w-full'
              >
                  {is_loading ? 'Logging you in...' : 'Login'}
              </button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm">
                <Link passHref href="/auth/forgot-password">
                  <a
                    href="#"
                    className="text-green-base hover:text-green-hover active:text-green-focus"
                  >
                    Forgot your password?
                  </a>
                </Link>
              </div>
            </div>
            <div className="border-t border-neutral-gray-03 pb-6 mt-6" />
            <div className="text-xs text-neutral-gray-00">
              By continuing, you agree to Feasly&#39;s{' '}
              <Link passHref href="/auth/forgot-password">
                <a
                  href="#"
                  className="text-green-base hover:text-green-hover active:text-green-focus"
                >
                  Terms of Use
                </a>
              </Link>
              . Read our{' '}
              <Link passHref href="/auth/forgot-password">
                <a
                  href="#"
                  className="text-green-base hover:text-green-hover active:text-green-focus"
                >
                  Privacy Policy
                </a>
              </Link>
              .
              <div className="flex items-center h-10 justify-between">
                <div>
                  Got no account?{' '}
                  <a
                    href="/auth/signup"
                    className="text-green-base hover:text-green-hover active:text-green-focus"
                  >
                    Sign-up
                  </a>
                </div>
                <VersionBox theme="light" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
