import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import { userContext } from "../userContext";
import Input from "../components/Input";
import def from "../assets/default.png";
import { route } from "preact-router";

import {
  BellIcon,
  ChartBarIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Notification from "../components/Notification";

let navigation = [
  { name: 'General', href: '/account', icon: UserCircleIcon, current: true },
  { name: 'Notifications', href: '#', icon: BellIcon, current: false },
  { name: 'Groups', href: '/creategroup', icon: UsersIcon, current: false },
  { name: 'Dashboard', href: "/dashboard", icon: ChartBarIcon, current: false }
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const formatter = new Intl.DateTimeFormat("en-RO", {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "numeric",
});

export default function Account() {
  const [file, setFile] = useState()
  const [submitData, setData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    location: ""
  })

  const [success, setSuccess] = useState({ status: false, message: "" })
  const { user, setUser } = useContext(userContext)

  navigation = navigation.filter(item => {
    if (item.name === 'Groups' && user.role !== 'refugee') {
      console.log(user.role)
      return false;
    }
    if (item.name === 'Dashboard' && user.role !== 'admin')
      return false;
    return true
  });


  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload the file.');
      }

      const data = await response.json();
      const formattedUser = {};
      if (submitData.name) formattedUser.name = submitData.name;
      if (submitData.email) formattedUser.email = submitData.email;
      if (submitData.phone) formattedUser.phone = submitData.phone;
      if (submitData.location) formattedUser.location = submitData.location;

      setUser((prevUser) => ({
        ...prevUser,
        ...formattedUser
      }))
      setSuccess({ status: true, message: data.message })
      if (!file) return;

      let formData = new FormData()
      formData.append("user-photo", file)

      const response2 = await fetch(`http://localhost:3001/images/${user._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      if (!response2.ok) {
        throw new Error('Failed to upload the file.');
      }

      const data2 = await response2.json();
      setUser(prevUser => ({
        ...prevUser,
        picturePath: data2.imageUrl,
      }));

    } catch (error) {
      console.error(error);
    }
  };

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

        <div className="bg-gray-50 mt-8 sm:mb-8 rounded-3xl flex-1 xl:overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account</h1>

            <form onSubmit={handleSubmit} className="divide-y-slate-200 mt-6 space-y-8 divide-y">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <h2 className="text-xl font-bold text-slate-900">Profile</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="photo" className="block text-sm lg:text-base font-semibold leading-6 text-slate-900">
                    Photo
                  </label>
                  <div className="mt-2 flex items-center">
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={file ? URL.createObjectURL(file) : `http://localhost:3001/${user.picturePath ? user.picturePath : "assets/default.png"}`}
                      alt=""
                    />
                    <div className="relative ml-4">
                      <input
                        id="user-photo"
                        name="user-photo"
                        filename={file}
                        onChange={e => setFile(e.target.files[0])}
                        type="file"
                        accept="image/*"
                        className="peer absolute inset-0 h-full w-full rounded-md opacity-0"
                      />
                      <label
                        htmlFor="user-photo"
                        className="pointer-events-none block rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 peer-hover:bg-slate-50 peer-focus:ring-2 peer-focus:ring-blue-600"
                      >
                        <span>Change</span>
                        <span className="sr-only"> user photo</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <Input
                    required={false}
                    type="text"
                    placeholder={user.name}
                    name="Full Name"
                    id="name"
                    onChange={(e) => {
                      setData(prevData => ({
                        ...prevData,
                        name: e.target.value
                      }))
                    }}
                    autoComplete="given-name"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm sm:text-base font-semibold leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2 sm:mt-4">
                    <textarea
                      id="description"
                      name="description"
                      onChange={(e) => {
                        setData(prevData => ({
                          ...prevData,
                          description: e.target.value
                        }))
                      }}
                      rows={4}
                      className="block w-full rounded-xl border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <Input
                    required={false}
                    placeholder={user?.email}
                    type="text"
                    name="Email"
                    id="email-address"
                    autoComplete="email"
                    onChange={(e) => {
                      setData(prevData => ({
                        ...prevData,
                        email: e.target.value
                      }))
                    }}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    required={false}
                    placeholder={user?.phone}
                    type="text"
                    name="Phone"
                    id="phone-number"
                    onChange={(e) => {
                      setData(prevData => ({
                        ...prevData,
                        phone: e.target.value
                      }))
                    }}

                    autoComplete="tel"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    required={false}
                    placeholder={user?.location}
                    type="text"
                    name="Country"
                    id="country"
                    onChange={(e) => {
                      setData(prevData => ({
                        ...prevData,
                        location: e.target.value
                      }))
                    }}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="text-sm text-slate-500 sm:col-span-6">
                  This account was created on{' '}
                  <time dateTime={user.createdAt}>{formatter.format(new Date(user.createdAt))}</time>.
                </p>
              </div>
              <div>
                <div className="py-4">
                  {success.status && <Notification setSuccess={setSuccess} success={success} />}
                </div>
                <div className="flex justify-end gap-x-3 pt-8">
                  <button
                    type="button"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
