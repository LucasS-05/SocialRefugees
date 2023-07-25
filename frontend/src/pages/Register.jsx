import Navbar from "../components/Navbar";
import SplitScreen from "../layouts/SplitScreen";
import Input from "../components/Input";
import yellow from "../assets/abstractyellow.jpg";
import { useState } from "preact/hooks";
import { route } from "preact-router";

const onSubmit = async (data) => {
  try {
    const response = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data)),
    });
    const message = await response.json();
    console.log(message);
    if (response.status == 400) setOk(message);
    else if (!response.ok) console.log("server error");
    else {
      route("/login");
    }
  } catch (error) {
    setOk("server error");
  }
};

function LeftPanel({ change, setChange }) {
  const [selected, setSelected] = useState("refugee");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("dababy");
    const formElement = e.target;
    const isValid = formElement.checkValidity();

    const invalidField = formElement.querySelector(":invalid");
    invalidField?.focus();

    if (isValid) {
      const data = new FormData(formElement);
      data.append("role", selected);
      console.log(Object.fromEntries(data))
      onSubmit(data);
    }
  };
  return (
    <div className="h-full relative overflow-auto">
      <Navbar />
      <div className="flex flex-col px-2 sm:px-4 lg:px-8 xl:px-16 justify-center h-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-9 tracking-tight text-gray-900">
              Ready to contribute to the world?
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4 md:space-y-8 mt-8 sm:mt-12">
              <Input
                id="name"
                type="text"
                name="name"
                error=""
                placeholder="Enter your full name"
              />
              <Input
                id="email"
                type="email"
                name="email"
                error="not a valid email address"
                placeholder="you@example.com"
              />
              <Input
                id="password"
                type="password"
                name="password"
                error="Your password is incorrect"
                placeholder="Enter a password"
              />
              <div className="relative flex flex-1 flex-wrap sm:space-x-6 justify-between items-center">
                <p className="shrink-0 mr-2 mb-1 block text-md sm:text-lg font-semibold leading-6 text-gray-900">
                  You are a
                </p>
                <div className="flex flex-1">
                  <button
                    type="button"
                    onClick={() => setSelected("helper")}
                    className={` ${selected === "helper"
                      ? "text-white hover:bg-yellow-400 bg-yellow-500 focus-visible:outline-yellow-600"
                      : "text-gray-900 bg-transparent"
                      } rounded-l-xl px-6 py-2 sm:py-2.5 ring-1 ring-inset ring-gray-300 grow text-black  text-sm sm:text-lg font-medium  shadow-sm  focus-visible:outline `}
                  >
                    Helper
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected("refugee")}
                    className={` ${selected === "refugee"
                      ? "text-white hover:bg-yellow-400 bg-yellow-500 focus-visible:outline-yellow-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 bg-transparent"
                      } rounded-r-xl px-6 py-2 sm:py-2.5 text-sm grow sm:text-lg font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                  >
                    Refugee
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="rounded-xl w-full bg-yellow-500 px-6 py-3 sm:py-3.5 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
      <button
        onClick={() => route("/login")}
        className="absolute flex items-center px-4 xl:px-16 py-6 w-full bg-yellow-500 hover:bg-yellow-400 bottom-0"
      >
        <div className="px-4 sm:px-6 px-8">
          <h3 className="text-lg sm:text-2xl text-white font-bold tracking-wide">
            Already have an account? Sign in!
          </h3>
        </div>
      </button>
    </div>
  );
}

function RightPanel() {
  return (
    <div className="h-full rounded-tl-[8rem] overflow-hidden hidden lg:block">
      <img
        src={yellow}
        className="min-w-full h-full object-cover object-left"
      ></img>
    </div>
  );
}

export default function Login() {
  const [change, setChange] = useState(false);
  return (
    <SplitScreen>
      <LeftPanel setChange={setChange} change={change} />
      <RightPanel change={change} />
    </SplitScreen>
  );
}
