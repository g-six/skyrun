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
import { CheckCircleIcon, EyeOffIcon } from '@heroicons/react/solid'
import { Messages } from 'data-types/messages'

export default function SignUp() {
  const router = useRouter()
  const { setUser, setRefresh } = useContext(AuthContext)
  const [hidden, setHidden] = useState(true)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [has_errors, setFormErrorState] = useState<boolean>(false)
  const [attributes, setAttributes] = useState<Record<string, string>>(
    {}
  )
  const [is_loading, setIsLoading] = useState<boolean>(false)
  const [show_password, setShowPassword] = useState<boolean>(false)
  const [show_confirmation, setShowConfirmation] = useState<boolean>(false)

  const [success_message, setSignUpSuccessMessage] = useState<string>('')

  let message
  if (router && router.query) {
    const query = router.query as unknown as Record<string, string>
    message = query.msg
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const { confirm_password, ...data } = attributes
    if (confirm_password && data.password !== confirm_password) {
        let err = {
            ...errors,
            password: 'Password confirmation does not match.'
        }
        setErrors(err)
        return
    }

    setFormErrorState(false)
    setIsLoading(true)

    const response = await postApiRequest('/auth/signup', data)
    setIsLoading(false)

    let redirect_to = `${getConfig().REDIRECT_EXPIREES_TO || ''}`
      .split('[cause]')
      .join('')

    if (
      (response.errors && response.type) ||
      (response.type && response.type === 'InvalidRequestHeaders')
    ) {
      if (response.errors) {
        const updated_errors = {
          ...errors,
          ...response.errors,
        }
        setErrors(updated_errors)
      }
      setFormErrorState(true)
    } else if (response.type === 'NotAuthorizedException') {
      setFormErrorState(true)
    } else if (response.redirect_to) {
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
        setTimeout(() => {
          router.push(redirect_to)
        }, 1200)
    } else if (response.type === 'Success') {
        setSignUpSuccessMessage(response.message || 'SIGNUP_SUCCESS_MESSAGE')
        setTimeout(() => {
            router.push('/auth/login?msg=CHECK_EMAIL_TO_ACTIVATE')
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
    if (attributes.password && attributes.password === attributes.confirm_password) {
        setShowPassword(false)
        setShowConfirmation(false)
    }
  }, [attributes.password, attributes.confirm_password, setShowConfirmation, setShowPassword])

  useEffect(() => {
    const handler = setTimeout(() => {
      setHidden(false)
    }, 1500)

    return () => clearTimeout(handler)
  }, [hidden])

  return (
    <>
      <Head>
        <title>50SoGrey | Login</title>
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
            <div className="mt-16 text-base text-blue-base">
                {
                    message && <p className='text-gray-500 text-xs font-medium leading-none mb-3 bg-gray-100 border-gray-400 rounded-md p-3 block whitespace-pre-wrap'>{Messages[message]}</p>
                }
                Sign up
            </div>
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
                    className={`text-sm 
                    focus:ring focus:ring-gray-300 focus:outline-gray-600
                    block w-full h-10 px-2 
                    rounded-md hover:border-gray-200 
                    border ${
                      Object.keys(errors).length
                        ? 'border-red-700 border-opacity-30'
                        : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>
              <div className="mt-1 mb-4 w-full">
                <label
                  htmlFor="txt_password"
                  className="block text-xs pb-2 text-blue-base"
                >
                  Password {errors.password && <sup className='text-gray-500'>{errors.password}</sup>}
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
                    className={`text-sm 
                    focus:ring focus:ring-gray-300 focus:outline-gray-600
                    block w-full h-10 px-2 
                    rounded-md hover:border-gray-200 
                    border ${
                      Object.keys(errors).length
                        ? 'border-red-700 border-opacity-30'
                        : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    className={`absolute w-4 h-auto text-gray-500 
                    focus:outline-none focus:text-black hover:text-black
                    cursor-pointer right-2 top-3 ${
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
                    className={`absolute w-4 h-auto text-gray-500 
                    focus:outline-none focus:text-black hover:text-black
                    cursor-pointer right-2 top-3 ${
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

              <div className={`mt-1 ${ has_errors || success_message ? 'mb-4' : 'mb-12' } w-full`}>
                <label
                  htmlFor="txt_confirm_password"
                  className="block text-xs pb-2 text-blue-base"
                >
                  {errors.password ? 'Please enter' : 'Re-enter'} {errors.password ? <u>the same</u> : 'your chosen'} password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm w-full">
                  <input
                    type={show_confirmation ? 'text' : 'password'}
                    name="confirm_password"
                    id="txt_confirm_password"
                    defaultValue={attributes.confirm_password}
                    onChange={e => {
                      setAttribute('confirm_password', e.target.value)
                    }}
                    className={`text-sm 
                    focus:ring focus:ring-gray-300 focus:outline-gray-600
                    block w-full h-10 px-2 
                    rounded-md hover:border-gray-200 
                    border ${
                      Object.keys(errors).length
                        ? 'border-red-700 border-opacity-30'
                        : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    className={`absolute w-4 h-auto text-gray-500 
                    focus:outline-none focus:text-black hover:text-black
                    cursor-pointer right-2 top-3 ${
                        show_confirmation ? 'hidden' : ''
                    }`}
                    onClick={() => {
                        setShowConfirmation(true)
                    }}
                  >
                    <EyeIcon />
                  </button>
                  <button
                    type="button"
                    className={`absolute w-4 h-auto text-gray-500 
                    focus:outline-none focus:text-black hover:text-black
                    cursor-pointer right-2 top-3 ${
                      !show_confirmation ? 'hidden' : ''
                    }`}
                    onClick={() => {
                      setShowConfirmation(false)
                    }}
                  >
                    <EyeOffIcon />
                  </button>
                </div>
              </div>

              {has_errors && (
                <div className="w-full flex flex-row">
                  <div className="text-red-500 w-4 h-auto mr-2">
                    <AlertTriangleIcon />
                  </div>
                  <div className="text-gray-700 text-xs">
                    Oh no! Your email or password (or both) is invalid.<br />Please
                    check and try again.
                  </div>
                </div>
              )}
              
              {success_message && (
                <div className="w-full flex flex-row">
                  <div className="text-green-600 w-4 h-auto mr-2">
                    <CheckCircleIcon />
                  </div>
                  <div className="text-gray-700 text-xs">
                    {success_message}
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
                  {is_loading ? 'Signing you up...' : 'Signup'}
              </button>
            </div>

            <div className="border-t border-neutral-gray-03 pb-6 mt-6" />
            <div className="text-xs text-neutral-gray-00">
              <div className="flex items-center h-10 justify-between">
                <div>
                  Already signed up?{' '}
                  <Link passHref href="/auth/login">
                    <a
                      className="text-green-base hover:text-green-hover active:text-green-focus"
                    >
                      Login
                    </a>
                  </Link>
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

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
