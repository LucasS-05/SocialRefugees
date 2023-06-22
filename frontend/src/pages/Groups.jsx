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
  });

  return (
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class={`${
          active ? "fixed" : "hidden"
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
    <div className="h-full overflow-y-auto">
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
    const users = await response.json();
    setUsers(users);
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
    getUsers();
    console.log(users);
  }, [activeGroup]);

  return (
    <div className="bg-gray-50 h-full rounded-tl-[8rem] overflow-hidden">
      <div className="mx-auto mt-32 max-w-7xl px-4 sm:px-8 lg:px-16">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-12">
          Group #{activeGroup}
        </h1>
        <p className="text-2xl font-semibold">Membri:</p>
        <div className="mt-8">
          <div>
            {users &&
              users.map((user) => {
                return (
                  <span className="inline-block mb-3 mr-3 bg-white rounded-lg shadow p-3">
                    {user.name} - {user?.location}
                  </span>
                );
              })}
          </div>
        </div>
        <div className="mt-8">
          <span className="font-semibold mt-12"> Nevoi : </span>
          {group?.needs.map((item) => {
            return (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-md font-medium text-blue-700 mr-2">
                {item}
              </span>
            );
          })}{" "}
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
  const { members, needs, urgency } = group;
  group.id = id;
  return (
    <div
      className={`col-span-6 mr-4 my-4 sm:col-span-3 flex flex-col space-y-4 p-6 ${
        urgency === "urgent" ? "" : ""
      } rounded-3xl shadow-sm ring-1 ring-gray-200 bg-gray-50 hover:cursor-pointer`}
      onClick={() => setActiveGroup(id)}
    >
      <p className="font-bold text-2xl mb-3">Group #{id}</p>
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
      {user?.role == "helper" ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          className={`${
            window.innerWidth > 124 ? "hidden" : "block"
          } rounded-xl w-full bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-400`}
        >
          Pot ajuta
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className={`${
            window.innerWidth > 124 ? "hidden" : "block"
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
  const [activeGroup, setActiveGroup] = useState(0);

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
