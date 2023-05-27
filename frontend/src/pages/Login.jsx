import Navbar from "../components/Navbar";
import SplitScreen from "../layouts/SplitScreen";
import Input from "../components/Input";
import red from "../assets/abstractred.jpg";
import { route } from "preact-router";
import { useContext, useState } from "preact/hooks";
import { userContext } from "../userContext";

/* <div className="relative my-8">
  <div className="absolute inset-0 flex items-center" aria-hidden="true">
    <div className="w-full border-t border-gray-200" />
  </div>
  <div className="relative flex justify-center text-sm font-medium leading-6">
    <span className="text-lg bg-white px-6 text-gray-900">
      Or continue with
    </span>
  </div>
</div>; */

function LeftPanel() {
  const [ok, setOk] = useState("");

  const { setUser } = useContext(userContext);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://192.168.0.103:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const message = await response.json();
      console.log(message);
      if (response.status == 400) setOk(message);
      else if (!response.ok) setOk("server error");
      else {
        setUser(message.user);
        localStorage.setItem("token", message.token);
        route("/");
      }
    } catch (error) {
      setOk("server error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formElement = e.target;
    const isValid = formElement.checkValidity();

    const invalidField = formElement.querySelector(":invalid");
    invalidField?.focus();

    if (isValid) {
      const data = new FormData(formElement);
      onSubmit(data);
      console.log(data);
    }
  };

  return (
    <div className="h-full relative">
      <Navbar />
      <div className="flex flex-col px-2 sm:px-4 lg:px-8 xl:px-16 justify-center h-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-9 tracking-tight text-gray-900">
              Ready to contribute to the world?
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="flex flex-col space-y-4 md:space-y-8 mt-12">
              <div>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  error="not a valid email address"
                  placeholder="you@example.com"
                />
                <p
                  className={`mt-2 text-sm sm:text-lg font-semibold text-red-500 ${
                    ok.user ? "visible" : "invisible"
                  }`}
                >
                  {ok.user}
                </p>
              </div>
              <div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  error="Your password is incorrect"
                  placeholder="Enter your password"
                />
                <p
                  className={`mt-2 text-sm sm:text-lg mb-4 font-semibold text-red-500 ${
                    ok.password ? "visible" : "invisible"
                  }`}
                >
                  {ok.password}
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  className="rounded-xl w-full bg-red-500 px-6 py-3.5 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Sign in
                </button>
                <p
                  className={`mt-2 text-sm sm:text-lg font-semibold text-red-500 ${
                    ok === "server error" ? "visible" : "invisible"
                  }`}
                >
                  {ok === "server error"
                    ? "An error occured logging in."
                    : "bac"}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <button
        onClick={() => route("/register")}
        className="absolute flex items-center px-2 sm:px-4 lg:px-8 xl:px-16 py-6 w-full bg-red-500 hover:bg-red-400 bottom-0"
      >
        <div className="px-4 sm:px-6 px-8">
          <h3 className="text-lg sm:text-2xl text-white font-bold tracking-wide">
            Don't have an account? Sign up!
          </h3>
        </div>
      </button>
    </div>
  );
}

function RightPanel() {
  return (
    <div className="h-full rounded-tl-[8rem] overflow-hidden">
      <img
        src={red}
        className="min-w-full h-full object-cover object-left"
      ></img>
    </div>
  );
}

export default function Login() {
  return (
    <SplitScreen>
      <LeftPanel />
      <RightPanel />
    </SplitScreen>
  );
}
