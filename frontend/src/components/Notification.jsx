import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

export default function Notification({ setSuccess, success }) {
  return (
    <div className={`rounded-md p-4 ring-1 ring-inset ${success.error ? "ring-red-300 bg-red-50" : "ring-green-300 bg-green-50"}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {success.error ? <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" /> :
            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
          }
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${success.error ? "text-red-800" : "text-green-800"}`}>{success.message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className={`inline-flex rounded-md ${success.error ? "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50" : "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50"} p-1.5 focus:outline-none focus:ring-2  focus:ring-offset-2 `}
              onClick={() => setSuccess(false)}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

