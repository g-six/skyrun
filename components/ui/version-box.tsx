import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import getConfig from 'next/config'
import { Fragment } from 'react'

export interface VersionBoxUIProps {
  theme: 'dark' | 'light'
}
export function VersionBox(
  p: VersionBoxUIProps = { theme: 'light' }
) {
  const {
    RELEASE_VERSION: version,
    RELEASE_BUILD: build,
    RELEASE_SHA: commit,
    RELEASE_DESC: description,
    ENVIRONMENT_NAME: environment,
  } = getConfig().publicRuntimeConfig
  const release = {
    build,
    environment,
    commit,
    version,
  }
  return (
    <div className="text-xs text-neutral-400">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                ${
                  p.theme === 'light'
                    ? 'hover:bg-neutral-100/80'
                    : 'hover:bg-black/10'
                }
                group px-2 py-1 rounded-md inline-flex items-center text-xs hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span>v{release.version}</span>
              <ChevronDownIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute w-screen max-w-sm px-4 mt-3 transform -translate-x-0 right-0 sm:px-0 lg:max-w-sm">
                <div
                  className={`
                    shadow-slate-400${
                      p.theme === 'light'
                        ? '/20 shadow-xl ring-black'
                        : ' shadow-md ring-slate-400'
                    }
                    overflow-hidden rounded-lg ring-1 ring-opacity-5
                `}
                >
                  <div
                    className={`
                    ${
                      p.theme === 'light'
                        ? 'bg-slate-800/90'
                        : 'bg-slate-800'
                    }
                    relative p-3 flex flex-wrap gap-3
                  `}
                  >
                    {Object.keys(release).map((key: string) => (
                      <div
                        key={key}
                        className="flex items-center py-2 px-3 -m-3 transition duration-150 ease-in-out rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="ml-2">
                          <p className="text-[8px] tracking-widest font-semibold text-neutral-100">
                            {key.toUpperCase()}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {
                              (release as Record<string, string>)[
                                `${key}`
                              ]
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center p-2 -mx-3 -my-2 transition duration-150 ease-in-out rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 w-full">
                      <div className="ml-2">
                        <p className="text-xs text-neutral-400">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
