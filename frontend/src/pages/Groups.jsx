import { useContext, useEffect, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import SplitScreen from "../layouts/SplitScreen";
import def from "../assets/default.png";
import { userContext } from "../userContext";
import { route } from "preact-router";

function LeftPanel({ groups, setActiveGroup }) {
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
  const { user } = useContext(userContext);

  const getUsers = async () => {
    const ids = group.members;
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
        {user.role === "refugee" ? (
          <button
            type="button"
            onClick={() => handleRequest(group._id)}
            className="rounded-xl mt-12 w-fit bg-red-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-red-400 "
          >
            Pot ajuta
          </button>
        ) : (
          <button
            type="button"
            className={`rounded-xl w-fit bg-yellow-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-yellow-400 `}
          >
            Make a request →
          </button>
        )}
      </div>
    </div>
  );
}

function Container({ group, id, setActiveGroup }) {
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
