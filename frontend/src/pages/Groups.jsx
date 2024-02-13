import { useContext, useEffect, useRef, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import SplitScreen from "../layouts/SplitScreen";
import def from "../assets/default.png";
import { userContext } from "../userContext";
import { route } from "preact-router";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { XCircleIcon } from '@heroicons/react/20/solid'
import Notification from "../components/Notification";

function LeftPanel({ groups, setActiveGroup, activeGroup, panelPosY }) {
  const { user } = useContext(userContext);
  const [complete, setComplete] = useState(false);
  const groupRef = useRef()

  useEffect(() => {
    const groups = groupRef.current.querySelectorAll('.group-container');

    gsap.from(groups, {
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.1, // Adjust the stagger delay as desired
      ease: 'power2.out',
    });
  }, [groups]);



  console.log(panelPosY)
  return (
    <div className={`bg-gray-50 h-full ${panelPosY == 0 ? "overflow-y-hidden" : "overflow-y-auto"}`}>
      <Navbar position="relative" />
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16 mt-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-12">Grupuri</h1>
        <div ref={groupRef} className={` grid grid-cols-6 mb-8`}>
          {groups?.map((group, index) => {
            return (
              <Container
                group={group}
                id={index}
                setActiveGroup={setActiveGroup}
                activeGroup={activeGroup}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RightPanel({ group, setGroups, activeGroup, formData, setFormData, panelPosY,
  setPanelPosY, user }) {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [loading, setLoading] = useState(true);

  const ref = useRef()

  //1 ii jos, 0 ii sus

  // TODO : move to utils
  function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  const draggablePanel = document.getElementById("draggable-panel");
  const windowHeight = document.documentElement.clientHeight;

  console.log(windowHeight)

  if (window.innerWidth < 1200) {

    Draggable.create(draggablePanel, {
      type: "y",
      edgeResistance: 0.65,
      bounds: {
        minY: windowHeight,
        maxY: 0
      },
      trigger: "#topBar",
      onDragEnd: function() {
        const panelPosition = this.target.getBoundingClientRect().top;

        if (panelPosition <= windowHeight * 0.75 && panelPosY == 1) {
          gsap.to(this.target, { y: 0, duration: 0.3 });
          setPanelPosY(0);
        } else if (panelPosition >= windowHeight * 0.75 && panelPosY == 1) {
          gsap.to(this.target, { y: windowHeight - convertRemToPixels(2), duration: 0.3 });
        } else if (panelPosition <= windowHeight * 0.25 && panelPosY == 0) {
          gsap.to(this.target, { y: 0, duration: 0.3 });
        } else if (panelPosition >= windowHeight * 0.25 && panelPosY == 0) {
          gsap.to(this.target, { y: windowHeight - convertRemToPixels(2), duration: 0.3 });
          setPanelPosY(1);
        }
      }
    });

  }

  const getUsers = async () => {
    const ids = group.members.map((member) => member.user)
    console.log(ids)
    try {
      const response = await fetch(`http://localhost:3001/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ids),
      });
      const res = await response.json()
      console.log(res)
      setUsers(res)
    } catch (e) {
      console.log(e)
    }
  };

  const handleTextareaChange = (e) => {
    setSuccess({ status: false })
    const value = e.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      descriere: value,
    }));
  };

  const handleCheckboxChange = (e, need) => {
    setSuccess({ status: false })
    const isChecked = e.target.checked;

    setFormData((prevFormData) => {
      if (isChecked) {
        return {
          ...prevFormData,
          resurse: [...prevFormData.resurse, need],
          isFormValid: true,
        };
      } else {
        const updatedResurse = prevFormData.resurse.filter((item) => item !== need);
        const isFormValid = updatedResurse.length > 0;

        return {
          ...prevFormData,
          resurse: updatedResurse,
          isFormValid: isFormValid,
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (formData.isFormValid) {
      try {
        const response = await fetch(`http://localhost:3001/groups/${group._id}/helped`, {
          method: "PATCH",
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId: user._id, groupId: group._id, needs: formData.resurse, description: formData.descriere }),
        });
        const res = await response.json()
        if (response.ok) setSuccess({ status: true, message: res.message })
        console.log(res)
        if (response.error) setSuccess({ status: true, error: true, message: res.error })
      } catch (e) {
        console.log(e)
      }

    }
    else if (user.role == "refugee") handleGroupRequest()
    else setSuccess({ status: true, error: true, message: "completati tot formularul" })
  }

  const handleGroupRequest = async () => {
    try {
      const response = await fetch(`http://localhost:3001/groups/${group._id}/request-join`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: user._id })
      });

      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        setSuccess({ status: true, error: true, message: data.message })
        throw response.error
      }
      setSuccess({ status: true, message: data.message })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoading(false)
    setSuccess({})
    // setLoading(true)
    const element = ref.current
    getUsers()
    // .then(() => {
    //   gsap.from(
    //     element,
    //     {
    //       onStart: () => {
    //         setLoading(false)
    //       },
    //       opacity: 0,
    //       duration: 1,
    //       ease: 'power4.inOut',
    //     }
    //   );
    // })


    //reset checkboxes on state change
    var clist = document.getElementsByTagName("input");
    for (var i = 0; i < clist.length; ++i) { clist[i].checked = false; }

    //reset textarea
    var textarea = document.getElementById("comment")
    textarea.value = ""
    if (formData.isFormValid)
      console.log(formData)

    //reset form data
    setFormData({
      resurse: [],
      descriere: ""
    })
  }, [activeGroup]);

  return (
    <div ref={ref} className={`{loading ? "hidden" : ""} rounded-tl-[8rem] h-full overflow-y-auto`}>
      <div id="draggable-panel" className={`translate-y-[calc(100dvh-2rem-env(safe-area-inset-bottom))] lg:translate-y-0 bg-white w-full z-10 fixed top-0 bottom-0 lg:relative`}>
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
        <div id="topBar" className="lg:hidden w-full p-4 flex justify-center">
          <div className="h-1 w-1/2 rounded-full bg-gray-500"></div>
        </div>
        <div className="overflow-y-auto h-full">
          <div className="mx-auto pt-16 lg:pt-32 pb-16 max-w-7xl px-4 sm:px-8 lg:px-16">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-12">
              {`Grupa #${group.shortId}`}
            </h1>
            {
              <>
                <div>
                  <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                      <h1 className="text-base font-semibold leading-6 text-gray-900">Membri : </h1>
                    </div>
                  </div>
                  <div className="-mx-4 mt-8 sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Nume
                          </th>
                          <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                          >
                            Provenienta
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Rol
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {users && users.map((person) => (
                          group.members.some(
                            (member) => member.user === person._id && member.status === "pending"
                          ) ? false : true &&
                          <tr key={person._id}>
                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                              {person.name}
                              <dl className="font-normal lg:hidden">
                                <dt className="sr-only">Provenienta</dt>
                                <dd className="mt-1 truncate text-gray-700">{person.location}</dd>
                              </dl>
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{person.location}</td>
                            <td className="px-3 py-4 text-sm text-gray-500">{person._id == group.ownerId ? "owner" : "membru"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className={`${user.role == "refugee" ? "hidden" : ""}`}>
                    <div className="mt-8">
                      <fieldset>
                        <legend className="text-base font-semibold leading-6 text-gray-900">Pot ajuta cu :</legend>
                        <div className="max-w-sm mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                          {!loading && group?.needs.map((need, needId) => (
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
                                  onChange={(e) => handleCheckboxChange(e, need)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                    <div className="mt-8">
                      <label htmlFor="comment" className="block font-medium text-base font-semibold leading-6 text-gray-900">
                        <legend className="">Descrie in detaliu modul prin care ne poti ajuta : </legend>
                      </label>
                      <p className="mb-4">(cantitatea de mancare/apa, spatiul de cazare (camere, dimensiuni))</p>
                      <div className="mt-2">
                        <textarea
                          rows={4}
                          name="comment"
                          id="comment"
                          className="mb-6 block w-full max-w-sm rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-blue sm:text-sm sm:leading-6"
                          defaultValue={''}
                          onChange={(e) => handleTextareaChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                  {success.status && <div className="max-w-sm"><Notification success={success} setSuccess={setSuccess} /></div>}
                  {user?.role == "helper" ? (
                    <button
                      type="submit"
                      className="rounded-xl mt-6 w-fit bg-red-500 px-4 py-2 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-red-400 "
                    >
                      Trimite solicitare
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="rounded-xl mt-6 w-fit bg-yellow-500 px-4 py-2 text-sm sm:text-base font-medium text-white shadow-sm hover:bg-yellow-400"
                    >
                      Intră in acest grup
                    </button>
                  )}
                </form>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function Container({ group, id, activeGroup, setActiveGroup }) {
  const { members, needs, urgency, createdAt } = group;

  return (
    <div
      className={`bg-white group-container col-span-6 mr-4 my-4 sm:col-span-3 flex flex-col space-y-8 p-6 ${activeGroup === id ? "ring ring-blue-200" : ""
        } rounded-3xl shadow-lg shadow-gray-100 hover:cursor-pointer`}
      onClick={() => setActiveGroup(id)}
    >
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <p className="">Grup ID </p>
          <p className="font-semibold text-main-purple">{group.shortId}</p>
        </div>
        <p className="font-semibold">{createdAt.toLocaleString('en-ro').slice(0, 10)}</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Prioritate : </span>
          {(() => {
            console.log(urgency)
            switch (urgency) {
              default:
                return (
                  <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-900 ">
                    <svg className="h-2.5 w-2.5 fill-orange-500" viewBox="0 0 6 6" aria-hidden="true">
                      <circle cx={3} cy={3} r={3} />
                    </svg>
                    nevoie
                  </span>
                )
              case "urgent":
                return (
                  <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-900 ">
                    <svg className="h-2.5 w-2.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
                      <circle cx={3} cy={3} r={3} />
                    </svg>
                    {urgency}
                  </span>
                );
            }
          })()}
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Membri:</span>
          <div className="isolate w-fit -space-x-2 overflow-hidden">
            {members.map((member) => (
              member.status != "pending" &&
              <img
                className="relative z-30 inline-block h-8 aspect-square rounded-full ring ring-gray-50 "
                src={def}
              />
            ))}
          </div>
        </div>
        <div>
          <span className="font-semibold"> Nevoi : </span>
          {needs.map((item) => {
            return (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 mr-2 my-1">
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Groups() {

  const { user } = useContext(userContext);
  user.role == "admin" && route("/dashboard");

  const [groups, setGroups] = useState();
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [activeGroup, setActiveGroup] = useState(0);
  const [panelPosY, setPanelPosY] = useState(1)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    resurse: [],
    descriere: "",
    isFormValid: true,
  })

  const ref = useRef()
  gsap.registerPlugin(Draggable);

  const getGroups = async () => {
    const response = await fetch(`http://localhost:3001/groups/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await response.json();
    if (!response.ok) setSuccess({ status: true, error: true, message: data.message });
    setGroups(data);
  };

  useEffect(() => {
    getGroups();
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power4.inOut" })
    setLoading(false)
    return () => {
      gsap.killTweensOf(ref.current);
    };
  }, []);

  return !success.error ? (
    <div className={`${loading ? "hidden" : ""}`} ref={ref}>
      <SplitScreen>
        <LeftPanel panelPosY={panelPosY} groups={groups} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
        {
          groups && (
            <RightPanel
              activeGroup={activeGroup}
              group={groups[activeGroup]}
              setGroups={setGroups}
              formData={formData}
              setFormData={setFormData}
              panelPosY={panelPosY}
              setPanelPosY={setPanelPosY}
              user={user}
            />)
        }
      </SplitScreen>
    </div>
  ) : (
    "An error has occured"
  );
}
