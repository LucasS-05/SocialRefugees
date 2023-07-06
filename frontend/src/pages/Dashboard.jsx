
import { useContext, useEffect, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import { userContext } from "../userContext";
import Input from "../components/Input";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Notification from "../components/Notification";
import {
  BellIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

let navigation = [

  { name: 'Cont', href: '/account', icon: UserCircleIcon, current: false },
  { name: 'Notificari', href: '/notifications', icon: BellIcon, current: false },
  { name: 'Dashboard', href: "/dashboard", icon: ChartBarIcon, current: true }
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function GroupItem({ group, userId, noButton = false }) {
  const [members, setMembers] = useState([])
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState({ status: false, message: "", error: false });

  const getUsersFromGroup = async () => {
    const ids = group.members.map((member) => member.user)
    try {
      const response = await fetch(`http://localhost:3001/users`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ids),
      });
      const res = await response.json()
      setMembers(res)
    } catch (e) {
      console.log(e)
    }
  };

  const takeUnderAdmin = async () => {
    try {
      const response = await fetch(`http://localhost:3001/groups/change-admin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ adminId: userId, groupId: group._id, helpers: group.helpedBy }),
      });
      const res = await response.json()
      if (response.ok) setSuccess({ status: true, message: res.message, error: false })
      else setSuccess({ status: true, message: res.message, error: true })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getUsersFromGroup()
  }, [])

  return (
    <div>
      <li
        key={group._id}
        onClick={() => setOpen(!open)}
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 hover:cursor-pointer sm:flex-nowrap"
      >
        <div>
          <p className="text-sm font-semibold leading-6 text-gray-900">
            Group Id : {group._id}
          </p>
          <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
            <p>
              Owner : {members.map((member) => member._id == group.ownerId ? member.name : null)}
            </p>
            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
              <circle cx={1} cy={1} r={1} />
            </svg>
            <p>
              {console.log(group.helpers)}
              {group.members.length > 1 ? `${group.members.length} members` : `${group.members.length} member`}
            </p>
            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
              <circle cx={1} cy={1} r={1} />
            </svg>
            <p>
              {console.log(group.helpedBy)}
              {group.helpedBy.length > 1 ? `${group.helpedBy.length} helpers` : `${group.helpedBy.length} helper`}
            </p>
          </div>
        </div>
        <dl className="flex items-center w-full flex-none justify-between gap-x-8 sm:w-auto">
          <div className="flex -space-x-0.5">
            <dt className="sr-only">Members</dt>
            {members.map((member) => (
              console.log(member),
              <dd key={member.user}>
                <img
                  className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white"
                  src={`http://localhost:3001/${member.picturePath ? member.picturePath : "assets/default.png"}`}
                />
              </dd>
            ))}
          </div>
          <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
        </dl>
      </li>
      <ul role="list" className="divide-y divide-gray-100 ">
        {open && members && members.map((member) => (
          <li key={member._id} className="flex gap-x-4 py-5 first:pt-0">
            <img className="h-16 w-16 flex-none rounded-full bg-gray-50" src={`http://localhost:3001/${member.picturePath ? member.picturePath : "assets/default.png"}`} alt="" />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-6 text-gray-900">{member.name}</p>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p>
                  {member.location}
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p>
                  {member.phone}
                </p>
              </div>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">{member.email}</p>
            </div>
          </li>
        ))}
      </ul>
      {open &&
        <div>
          {success.status && <Notification success={success} setSuccess={setSuccess} />}
          {
            !noButton &&
            <div className="flex sm:justify-end gap-x-3 pt-4 pb-12 border-t border-gray-100">
              <button
                type="button"
                onClick={takeUnderAdmin}
                className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Take under administration
              </button>
            </div>
          }
        </div>
      }
    </div>
  )
}


export default function Dashboard() {
  const [file, setFile] = useState()
  const [submitData, setData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    location: ""
  })

  const [groups, setGroups] = useState()
  const [unAdminGroups, setUnAdminGroups] = useState()
  const [success, setSuccess] = useState({ status: false, message: "" })
  const { user, setUser } = useContext(userContext)

  navigation = navigation.filter(item => {
    if (item.name === 'Grupuri' && user.role !== 'refugee') {
      console.log(user.role)
      return false;
    }
    if (item.name === 'Dashboard' && user.role !== 'admin')
      return false;
    return true
  });

  const getAdministeredGroups = async () => {
    const response = await fetch(`http://localhost:3001/groups/administered`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ userId: user._id })
    });
    if (!response.ok) setError(true);
    const data = await response.json();
    setGroups(data);
    console.log(data)
  };

  const getUnadministeredGroups = async () => {
    const response = await fetch(`http://localhost:3001/groups/unadministered`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    });
    if (!response.ok) setError(true);
    const data = await response.json();
    console.log(data)
    setUnAdminGroups(data);
  };

  useEffect(() => {
    getAdministeredGroups();
    getUnadministeredGroups();
  }, []);

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
          </pattern>64a5514b26ed8b0a6eb2e993
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>

            <form className="divide-y-slate-200 mt-6 space-y-8 divide-y">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <h2 className="text-xl font-bold text-slate-900">Not administered groups</h2>
                </div>
                {
                  (unAdminGroups && unAdminGroups.length > 0) &&
                  <div className="sm:col-span-6 bg-white rounded-xl ring-1 ring-inset ring-gray-300 inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                    <ul role="list" className="divide-y divide-gray-100">
                      {unAdminGroups.map((group) => (
                        <GroupItem group={group} userId={user._id} />
                      ))}
                    </ul>
                  </div>
                }
              </div>

              <div className="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <h2 className="text-xl font-bold text-slate-900">Your administered groups</h2>
                </div>
                {
                  (groups && groups.length > 0) &&
                  <div className="sm:col-span-6 bg-white rounded-xl ring-1 ring-inset ring-gray-300 inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                    <ul role="list" className="divide-y divide-gray-100">
                      {groups.map((group) => (
                        <GroupItem group={group} userId={user._id} noButton={true} />
                      ))}
                    </ul>
                  </div>
                }
              </div>
            </form>
          </div>
        </div>
      </div >
    </div >
  )
}
