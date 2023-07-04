
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import { userContext } from "../userContext";
import Input from "../components/Input";
import def from "../assets/default.png";
import { route } from "preact-router";

import {
  BellIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid'

let navigation = [
  { name: 'General', href: '/account', icon: UserCircleIcon, current: false },
  { name: 'Notifications', href: '#', icon: BellIcon, current: false },
  { name: 'Groups', href: '/groups', icon: UsersIcon, current: true },
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

import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Power0 } from "gsap/gsap-core";

function Success({ setSuccess }) {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">Successfully uploaded</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
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


export default function Account() {
  const [searchUsers, setUsers] = useState()

  const needs = [
    { id: 1, name: 'mancare' },
    { id: 2, name: 'cazare' },
    { id: 3, name: 'haine' },
    { id: 4, name: 'apa' },
  ]

  const [success, setSuccess] = useState(false)
  const { user, setUser } = useContext(userContext)

  const [userGroup, setUserGroup] = useState()
  const [userGroupMembers, setUserGroupMembers] = useState([])

  const [groupExists, setGroupExists] = useState(false);

  navigation = navigation.filter(item => {
    if (item.name === 'Groups' && user.role === 'helper') {
      return false; // Exclude 'Friends' object for admin user
    }
    return true; // Include all other objects
  });

  const getUsersFromGroup = async () => {
    const ids = userGroup.members.map((member) => member.user)
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
      console.log(res)
      setUserGroupMembers(res)
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    console.log(userGroup)
    if (userGroup) {
      getUsersFromGroup()
    }
  }, [userGroup])

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`http://localhost:3001/groups/${user._id}`, {
          method: 'POST',
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error(response);
        }

        const data = await response.json();
        if (data.length > 0) {
          setGroupExists(true)
          setUserGroup(data[0])
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchGroup()
  }, [])

  const handleSearch = async event => {
    if (event.target.value.length < 3) return;
    try {
      const response = await fetch(`http://localhost:3001/users/search`, {
        method: 'POST',
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: event.target.value })
      });

      if (!response.ok) {
        throw new Error(response);
      }

      const data = await response.json();
      setUsers(data)
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (e, need) => {
    const isChecked = e.target.checked;
    setUserGroup((prevData) => {
      if (isChecked) {
        return {
          ...prevData,
          needs: [...prevData.needs, need.name],
        };
      } else {
        const updatedNeeds = prevData.needs.filter((item) => item !== need.name);
        console.log(updatedNeeds)
        return {
          ...prevData,
          needs: updatedNeeds,
        };
      }
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault()
    //if group empty, create group
    if (!userGroup) setUserGroup({
      ownerId: user._id,
      urgency: "urgent",
      needs: [],
      members: [{
        user: user._id,
        role: "admin"
      }]
    })
    else {
      if (!groupExists) {
        console.log(userGroup)
        //post to groups
        try {
          const response = await fetch(`http://localhost:3001/${userGroup}`, {
            method: 'POST',
            headers: {
              "Content-Type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userGroup)
          });

          if (!response.ok) {
            throw new Error(response);
          }
        } catch (error) {
          console.log(error)
        }
      }
      else {
        try {
          const response = await fetch(`http://localhost:3001/groups/${userGroup._id}/update`, {
            method: 'PATCH',
            headers: {
              "Content-Type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userGroup)
          });

          const data = await response.json()
          console.log(data)
          if (!response.ok) {
            throw new Error(response);
          }
        } catch (error) {
          console.log(error)
        }

      }
    }
  }

  return (
    <div>
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
        <div className="flex-1 xl:overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Group</h1>
            <form onSubmit={(e) => handleCreate(e)} className="divide-y-slate-200 mt-6 space-y-8">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <h2 className="text-xl font-bold text-slate-900">Create group</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    If you dont have a group, you can create one.
                  </p>
                </div>
                {
                  userGroup &&
                  <div className="sm:col-span-6">


                    <div className="sm:col-span-6">
                      <Input
                        required={false}
                        type="text"
                        name="Search users"
                        id="name"
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                }
              </div>
              {
                userGroup &&
                <div>
                  <div>
                    <ul role="list" className="divide-y divide-gray-100">
                      {searchUsers && searchUsers.map((person) => (
                        person._id != user._id &&
                        <li key={person.email} className="flex justify-between items-center gap-x-6 py-2">
                          <div className="flex gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={`http://localhost:3001/${person.picturePath ? person.picturePath : "assets/default.png"}`} alt="" />
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.location}</p>
                            </div>
                          </div>
                          <div className="flex sm:flex-col sm:items-end">
                            <button
                              type="button"
                              onClick={() => {
                                const isMember = userGroup.members.some((member) => member.user === person._id);
                                if (isMember) return;
                                setUserGroup((prevState) => ({
                                  ...prevState,
                                  members: [
                                    ...prevState.members,
                                    {
                                      user: person._id,
                                      role: "user"
                                    }
                                  ]
                                }));
                              }}
                              className="rounded-full bg-yellow-600 p-1 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yello-600"
                            >
                              <PlusIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="">
                    <div className="mt-8 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                  Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                  Location
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                  Role
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                  <span className="sr-only">Remove</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {userGroupMembers && userGroupMembers.map((person) => (
                                <tr key={person?.email}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                    {person?.name}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person?.location}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{userGroup?.members.map((member) => member.user == person._id ? member.role : "")}</td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                    <button onClick={() => {
                                      setUserGroup((prevState) => ({
                                        ...prevState,
                                        members:
                                          prevState.members.filter((member) => member.user !== person._id)
                                      }))
                                    }}
                                      className="text-yellow-600 hover:text-yellow-900">
                                      {userGroup?.members.map((member) => member.user == person._id && member.role !== "admin" ? "Remove" : "")}<span className="sr-only">, {person.name}</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <fieldset className="max-w-sm">
                        <legend className="text-base font-semibold leading-6 text-gray-900">Needs</legend>
                        <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                          {needs.map((need, needId) => (
                            <div key={needId} className="relative flex items-start py-4">
                              <div className="min-w-0 flex-1 text-sm leading-6">
                                <label htmlFor={`person-${need.id}`} className="select-none font-medium text-gray-900">
                                  {need.name}
                                </label>
                              </div>
                              <div className="ml-3 flex h-6 items-center">
                                <input
                                  id={`need-${need.id}`}
                                  name={`${need.name}`}
                                  checked={userGroup.needs.includes(need.name) ? true : false}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                  onChange={(e) => handleCheckboxChange(e, need)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              }
              <div>
                {
                  success &&
                  <div className="py-4">
                    <Success setSuccess={setSuccess} />
                  </div>
                }
                <div className={`flex ${userGroup ? "justify-end pt-8" : "justify-start pt-0"} gap-x-3 `}>
                  <button
                    type="button"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {groupExists ? "Update" : "Create"}
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
