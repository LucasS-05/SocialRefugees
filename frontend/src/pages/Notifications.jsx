
import {
  BellIcon,
  ChartBarIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Navbar from '../components/Navbar';
import { userContext } from '../userContext';
import { useContext, useEffect, useState } from 'preact/hooks';
import Notification from '../components/Notification';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

let navigation = [

  { name: 'Cont', href: '/account', icon: UserCircleIcon, current: false },
  { name: 'Notificari', href: '/notifications', icon: BellIcon, current: true },
  { name: 'Grupuri', href: '/creategroup', icon: UsersIcon, current: false },
  { name: 'Dashboard', href: "/dashboard", icon: ChartBarIcon, current: false }
]

export default function Notifications() {

  const { user, setUser } = useContext(userContext)
  const [notifications, setNotifications] = useState()
  const [sender, setSender] = useState()
  const [success, setSuccess] = useState({ status: false, message: "" })

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setSender(data)
      setNotifications(data.notifications)
    } catch (error) {
      console.log(error);
    }
  }

  const handleAccept = async (groupId, notificationType, notificationId) => {
    try {
      const response = await fetch(`http://localhost:3001/groups/${groupId}/update-member-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'accepted', notificationId: notificationId, notificationType: notificationType, memberId: user._id }),
      });

      const data = await response.json();
      console.log(data);
      setSuccess({ status: true, message: data.message })
      // Handle success
    } catch (error) {
      setSuccess({ status: true, error: true, message: "an error occured" })
      console.log(error);
      // Handle error
    }
  };

  useEffect(() => {
    getUser();
  }, [])


  navigation = navigation.filter(item => {
    if (item.name === 'Grupuri' && user.role !== 'refugee') {
      console.log(user.role)
      return false;
    }
    if (item.name === 'Dashboard' && user.role !== 'admin')
      return false;
    return true
  });


  return (
    <div>
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>
      <Navbar />
      <div class="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
        <aside class="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
          <nav class="flex-none px-4 sm:px-6 lg:px-0">
            <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? `bg-gray-50 ${user.role == "helper" ? "text-red-600" : "text-yellow-600"}`
                        : `text-gray-700 ${user.role == "helper" ? "hover:text-red-600" : "hover:text-yellow-600"} hover:bg-gray-50`,
                      'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? `${user.role == "helper" ? "text-red-600" : "text-yellow-600"} text-red-600` : `text-gray-400 ${user.role == "helper" ? "group-hover:text-red-600" : "group-hover:text-yellow-600"}`,
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="bg-gray-50 rounded-3xl mt-8 sm:mb-8 flex-1 xl:overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notificări</h1>
            <form className="divide-y-slate-200 mt-6 space-y-8">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <h2 className="text-xl font-bold text-slate-900">Notificările tale</h2>
                </div>
                <div className="sm:col-span-6">
                  <div className="bg-white rounded-xl ring-1 ring-inset ring-gray-300 inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                    <ul role="list" className="divide-y divide-gray-100">
                      {notifications?.length > 0 ? (
                        notifications.every((notification) => notification.status === "read") ? (
                          <li className="py-5">Nu aveti notificari</li>
                        ) : (
                          notifications.map((notification) =>
                            notification.status === "read" ? null : (
                              <li key={notification._id} className="flex items-center justify-between gap-x-6 py-5">
                                <div className="min-w-0">
                                  <div className="flex items-start gap-x-3">
                                    <p className="text-sm font-semibold leading-6 text-gray-900">{notification.message}</p>
                                  </div>
                                  <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                    <p className="whitespace-nowrap">
                                      From {notification.ownerName || sender.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                  <button
                                    type="button"
                                    onClick={() => handleAccept(notification.groupId, notification.notificationType, notification._id)}
                                    className=" rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                                    return true>
                                    Accept
                                  </button>
                                </div>
                              </li>
                            )
                          )
                        )
                      ) : (
                        <li className="py-5">Nu aveti notificari</li>
                      )}
                    </ul>
                    {success.status && <Notification setSuccess={setSuccess} success={success} />}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
