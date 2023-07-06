import { useContext, useState } from "preact/hooks";
import { userContext } from "../userContext";
import { route } from "preact-router";

const navigation = [
  { name: "Acasa", href: "/" },
  { name: "Grupuri", href: "/groups", accept: false },
];

export default function Navbar({ position }) {
  const { user, setUser } = useContext(userContext);

  const [toggle, setToggle] = useState(false);

  const [open, setOpen] = useState(false);
  return (
    <header
      className={`${position == "relative" ? "relative" : "absolute"
        } z-10 w-full px-2 sm:px-4 lg:px-8 xl:px-16`}
    >
      <nav
        className="mx-auto max-w-7xl flex items-center flex-row-reverse lg:flex-row justify-between py-6 px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 justify-self-end inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700"
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 100 80" width="20" height="20">
              <rect width="100" height="10"></rect>
              <rect y="30" width="100" height="10"></rect>
              <rect y="60" width="100" height="10"></rect>
            </svg>
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <a
            href={"/"}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Acasă
          </a>
          <a
            href={user ? "/groups" : "/login"}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Grupuri
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <div class="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  onClick={() => setToggle(!toggle)}
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  Cont
                  <svg
                    class="-mr-1 h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div
                class={`${!toggle ? "hidden" : ""
                  } absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
              >
                <div class="py-1" role="none">
                  <a
                    href="/account"
                    class="text-gray-700 block px-4 py-2 text-sm font-medium"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-0"
                  >
                    Setări
                  </a>
                  <form method="POST" action="#" role="none">
                    <button
                      type="button"
                      onClick={() => (
                        setUser(null),
                        localStorage.removeItem("token"),
                        route("/")
                      )}
                      class="text-gray-700 block w-full px-4 py-2 text-left text-sm font-medium"
                      role="menuitem"
                      tabindex="-1"
                      id="menu-item-3"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex divide-x py-1.5">
              <a
                href="/login"
                className="text-sm pr-4 font-semibold leading-6 text-gray-900"
              >
                Logare <span aria-hidden="true"></span>
              </a>
            </div>
          )}
        </div>
      </nav>
      <div className={open ? "block" : "hidden"}>
        <div className="fixed inset-0 z-10" />
        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-lg p-2.5 text-gray-700"
              onClick={() => setOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                class="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="flex flex-col space-y-6 py-6">
                <a
                  href={"/"}
                  className="font-semibold leading-6 text-gray-900"
                >
                  Home
                </a>
                <a
                  href={user ? "/groups" : "/login"}
                  className="font-semibold leading-6 text-gray-900"
                >
                  Grupuri
                </a>
              </div>
              <div className="py-6">
                {user ? (
                  <div class="relative inline-block text-left">
                    <div className="-my-6 divide-y divide-gray-500/10">
                      <div class="pt-6" role="none">
                        <a
                          href="/account"
                          class="font-semibold leading-6 text-gray-900"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-item-0"
                        >
                          Setări
                        </a>
                        <form method="POST" action="#" role="none">
                          <button
                            type="button"
                            onClick={() => (
                              setUser(null),
                              localStorage.removeItem("token"),
                              route("/")
                            )}
                            class="font-semibold leading-6 text-gray-900 mt-4"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-3"
                          >
                            Sign out
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex divide-x py-1.5">
                    <a
                      href="/login"
                      className="text-sm pr-4 font-semibold leading-6 text-gray-900"
                    >
                      Logare <span aria-hidden="true"></span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
