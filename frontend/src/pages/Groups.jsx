import { useContext, useEffect, useRef, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import SplitScreen from "../layouts/SplitScreen";
import def from "../assets/default.png";
import { userContext } from "../userContext";
import { route } from "preact-router";

function Modal({ active, setActive, role, user }) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class={`${active ? "fixed" : "hidden"
          }  inset-0 bg-gray-500 bg-opacity-75 transition-opacity`}
      ></div>
      <div
        class={`${active ? "fixed" : "hidden"} inset-0 z-10 overflow-y-auto`}
      >
        <div
          class={`flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0`}
        >
          <div
            ref={ref}
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
          >
            <div>
              <div class="mt-3 text-center sm:mt-5">
                <h3
                  class="text-3xl font-semibold text-gray-900"
                  id="modal-title"
                >
                  {role === "refugee"
                    ? "Do you want to join this group?"
                    : "Can you help?"}
                </h3>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              {role === "refugee" ? (
                <button
                  type="button"
                  onClick={() => (user ? route("/multumim?role=refugee") : route("/login"))}
                  class="inline-flex w-full justify-center rounded-md bg-yellow-500 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-yellow-400 "
                >
                  Yes I do!
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => route("/multumim")}
                  class="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-red-400 "
                >
                  Yes I can!
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftPanel({ groups, setActiveGroup }) {
  const { user } = useContext(userContext);

  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      <Navbar position="relative" />
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16 mt-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-12">Grupuri</h1>
        <div className="grid grid-cols-6">
          {groups?.map((group, index) => {
            return (
              <Container
                group={group}
                id={index}
                setActiveGroup={setActiveGroup}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RightPanel({ group, activeGroup }) {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(userContext);

  const getUsers = async () => {
    const ids = group.members
    const response = await fetch(`http://localhost:3001/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(ids),
    });
    if (!response.ok) console.log(response.error);
    else setLoading(false);
    const users = await response.json();
    return users;
  };

  const handleRequest = async (data) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const message = await response.json();
      if (!response.ok) console.log("server error");
      route("/multumim");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers().then(users => setUsers(users));
    //reset checkboxes on state change
    var clist = document.getElementsByTagName("input");
    for (var i = 0; i < clist.length; ++i) { clist[i].checked = false; }
  }, [activeGroup]);

  return (
    <div className="h-full rounded-tl-[8rem] overflow-hidden">
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
      {

      }<div className="mx-auto mt-32 max-w-7xl px-4 sm:px-8 lg:px-16">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-12">
          Group #{activeGroup}
        </h1>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle px-1">
                <p className="text-base font-semibold leading-6 text-gray-900">Membri :</p>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 mt-4 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Nume
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Provenienta
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Loc curent
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Varsta
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users && users.map((person) => (
                        <tr key={person.email}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {person.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title || "-"}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.location}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <fieldset>
            <legend className="text-base font-semibold leading-6 text-gray-900">Pot ajuta cu :</legend>
            <div className="max-w-sm mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
              {group?.needs.map((need, needId) => (
                <div key={needId} className="relative flex items-start py-4">
                  <div className="min-w-0 flex-1 text-sm leading-6">
                    <label htmlFor={`person-${need.id}`} className="select-none font-medium text-gray-900">
                      {need}
                    </label>
                  </div>
                  <div className="ml-3 flex h-6 items-center">
                    <input
                      id={`person-${need.id}`}
                      name={`person-${need.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-main-blue focus:outline-none focus:ring-0 focus:ring-offset-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        {user?.role == "helper" ? (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="rounded-xl mt-12 w-fit bg-red-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-red-400 "
          >
            Pot ajuta
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="rounded-xl mt-12 w-fit bg-yellow-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-yellow-400"
          >
            Join this group
          </button>
        )}
      </div>
      <Modal
        active={active}
        setActive={setActive}
        role={user?.role}
        user={user}
      />
    </div>
  );
}

function Container({ group, id, setActiveGroup }) {
  const { user } = useContext(userContext);
  const { members, needs, urgency, createdAt } = group;
  group.id = id;
  return (
    <div
      className={`bg-white col-span-6 mr-4 my-4 sm:col-span-3 flex flex-col space-y-8 p-6 ${urgency === "urgent" ? "" : ""
        } rounded-3xl shadow-lg shadow-gray-100 hover:cursor-pointer`}
      onClick={() => setActiveGroup(id)}
    >
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <p className="">Group ID </p>
          <p className="font-semibold text-main-purple">002</p>
        </div>
        <p className="font-semibold">{createdAt.toLocaleString('en-ro').slice(0, 10)}</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Prioritate : </span>
          <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-900 ">
            <svg className="h-2.5 w-2.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
              <circle cx={3} cy={3} r={3} />
            </svg>
            Mare
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Membri:</span>
          <div className="isolate w-fit -space-x-2 overflow-hidden">
            {members.map((member) => {
              return (
                <img
                  className="relative z-30 inline-block h-8 aspect-square rounded-full ring ring-gray-50 "
                  src={def}
                />
              );
            })}
          </div>
        </div>
        <div>
          <span className="font-semibold"> Nevoi : </span>
          {needs.map((item) => {
            return (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 mr-2">
                {item}
              </span>
            );
          })}
        </div>
      </div>
      {user?.role == "helper" ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          className={`${window.innerWidth > 124 ? "hidden" : "block"
            } rounded-xl w-full bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-400`}
        >
          Pot ajuta
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className={`${window.innerWidth > 124 ? "hidden" : "block"
            } rounded-xl w-full bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-400`}
        >
          Join this group
        </button>
      )}
    </div>
  );
}

export default function Groups() {
  const [groups, setGroups] = useState();
  const [error, setError] = useState(false);
  const [activeGroup, setActiveGroup] = useState(-1);

  const getGroups = async () => {
    const response = await fetch(`http://localhost:3001/groups/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) setError(true);
    const data = await response.json();
    setGroups(data);
  };

  useEffect(() => {
    getGroups();
  }, []);

  return !error ? (
    <SplitScreen>
      <LeftPanel groups={groups} setActiveGroup={setActiveGroup} />
      <RightPanel
        activeGroup={activeGroup}
        group={groups && groups[activeGroup]}
      />
    </SplitScreen>
  ) : (
    "An error has occured"
  );
}
