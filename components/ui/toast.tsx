// transition ease-out duration-200
import { Fragment, MouseEvent, useContext, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, XIcon } from './basic-icons'
import {
    AuthContext,
    ToastMode,
    default_toast,
} from 'context/auth-context'
import { GenericObject } from 'data-types/validation'

const toast_components: GenericObject = {
  // add toast component here...
}

function Toast() {
  const { context, setToast } = useContext(AuthContext)
  const {
    data,
    component,
    component_props,
    header_text,
    message,
    mode,
    timeout,
    visible,
  } = context?.toast || {}

  const handleClose = (evt?: MouseEvent) => {
    evt?.preventDefault()
    evt?.stopPropagation()
    if (context?.toast) {
      setToast({ visible: false })
      setTimeout(() => {
        setToast(default_toast)
      }, 500)
    }
  }

  const renderToastComponent = () => {
    const BodyComponent = toast_components[component as string]
    // eslint-disable-next-line react/jsx-props-no-spreading
    return BodyComponent ? (
      <BodyComponent
        data={data}
        setToast={setToast}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...component_props}
      />
    ) : null
  }
  useEffect(() => {
    let timeout_handler: any
    if (timeout !== 'infinite') {
      timeout_handler = setTimeout(() => {
        handleClose()
      }, timeout)
    }
    return () => {
      clearTimeout(timeout_handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <div className="absolute z-[999] inset-x-0 bottom-5 flex flex-col justify-center">
      <Transition
        show={!!visible}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div
          aria-atomic="true"
          aria-live="assertive"
          className={`
            shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3 
            ${
                mode === ToastMode.SUCCESS && 'bg-green-base-12 border border-green-base'
            }
          `}
          data-mdb-autohide="false"
          id="ftoast-component"
          role="alert"
        >
          <div className="flex justify-between items-center py-2 px-3 bg-clip-padding rounded-t-lg">
            <div className="bg-transparent font-medium flex items-center">
              <div
                aria-hidden="true"
                className="h-5 w-5 text-green-base mr-2"
                onClick={handleClose}
              >
                <CheckCircleIcon />
              </div>
              {header_text}
            </div>
            <div className="flex items-center">
              <div
                aria-hidden="true"
                className="h-4 w-4 text-gray-500 hover:bg-transparent hover:text-gray-700"
                onClick={handleClose}
              >
                <XIcon />
              </div>
            </div>
          </div>
          <div id="toas-body" className="p-3 break-words">
            {component ? renderToastComponent() : message}
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default Toast
