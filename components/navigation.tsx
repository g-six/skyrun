import { Fragment, useContext } from 'react'
import Link from 'next/link'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { AuthContext } from 'context/auth-context'
import {
  destroySessionTokens,
  removeLocalStorageItem,
} from 'utils/session'
import { deleteApiRequest } from 'utils/fetch-helper'
1
import { BellIcon, ChevronDownIcon } from './ui/basic-icons'
import { VersionBox } from './ui/version-box'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation({ open }: { open: boolean }) {
  const { context, setUser, setRefresh } = useContext(AuthContext)
  const { user } = context

  const { first_name, last_name, refresh_token } = user || {}

  const handleLogout = async () => {
    await deleteApiRequest('/auth/logout', { refresh_token }).then(
      () => {
        setUser(null)
        destroySessionTokens()
        removeLocalStorageItem('user')
        setRefresh(true)
      }
    )
  }

  return (
    <div className="mx-auto px-2 sm:px-4 md:px-8 w-full bg-white shadow">
      <div className="relative flex items-center justify-between h-16">
        <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
          {/* Mobile menu button */}
          <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300">
            <span className="sr-only">Open main menu</span>
            {open ? (
              <XIcon
                className="block h-6 w-6"
                aria-hidden="true"
              />
            ) : (
              <MenuIcon
                className="block h-6 w-6"
                aria-hidden="true"
              />
            )}
          </Disclosure.Button>
        </div>
        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex-shrink-0 flex items-center -ml-1 md:-ml-3">
            <img
              className="hidden md:block h-10 w-auto"
              src="/logo.png"
              alt="50SoGREY"
            />
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <VersionBox theme="light" />
          <div className="h-4 border-l border-gray-700 mx-4 opacity-10" />
          <div className="cursor-pointer text-black w-4 h-auto mr-4">
            <BellIcon />
          </div>
          {/* Profile dropdown */}
          <Menu as="div" className="ml-1 relative">
            <div>
              <Menu.Button className="bg-transparent flex text-sm items-center text-black">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <span className="ml-2">
                  {first_name} {last_name}
                </span>
                <div className="cursor-pointer text-black w-4 h-auto ml-2">
                  <ChevronDownIcon />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="bg-white origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                      onClick={() => {
                        handleLogout()
                      }}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}
