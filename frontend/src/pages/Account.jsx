import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import { userContext } from "../userContext";
import Input from "../components/Input";
import def from "../assets/default.png";
import { route } from "preact-router";

export default function Account() {
  const [user, setUser] = useState(null);
  const [rerender, setRerender] = useState(false);

  const getUser = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${localStorage.getItem("id").slice(1, -1)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  const [picture, setPicture] = useState({ picture: false, src: false });

  //efectiv nu mai am niciun chef sa implementez uploadingu pozelor
  function handlePictureSelected(e) {
    var pic = e.target.files[0];
    var src = URL.createObjectURL(pic);
    setPicture({ picture: pic, src: src });
  }

  const onSubmit = async (data) => {
    try {put
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
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formElement = e.target;
    const isValid = formElement.checkValidity();

    const invalidField = formElement.querySelector(":invalid");
    invalidField?.focus();

    if (isValid) {
      var data = new FormData(formElement);
      data = Array.from(data).filter(function ([k, v]) {
        return v;
      });
      onSubmit(data);
    }
  };

  console.log(picture);
  return (
    <div className="h-screen bg-gray-50">
      <Navbar position="relative" />
      <div className="flex flex-col space-y-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-24">
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
          <form onSubmit={handleSubmit} id="form">
            <div className="px-4 py-5 sm:px-6 flex items-center flex-wrap justify-between">
              <h1 className="text-3xl sm:text-4xl font-bold">Account</h1>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-3 mt-6">
                  <Input
                    name="name"
                    id="name"
                    placeholder={user.name}
                    type="text"
                    required={false}
                  />
                </div>
                <div className="sm:col-span-3 sm:mt-6">
                  <Input
                    name="email"
                    id="email"
                    placeholder={user.email}
                    type="email"
                    required={false}
                  />
                </div>
                <div className="sm:col-span-3 sm:mt-6">
                  <Input
                    type="tel"
                    name="phone"
                    id="phone"
                    required={false}
                    placeholder={user?.phone}
                  />
                </div>
                <div className="sm:col-span-3 sm:mt-6">
                  <Input
                    type="text"
                    name="location"
                    id="location"
                    required={false}
                    placeholder={user?.location}
                  />
                </div>
                <div className="sm:justify-self-end sm:col-span-6">
                  <button
                    type="submit"
                    className="mt-6 rounded-xl w-full bg-red-500 px-12 py-3.5 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
