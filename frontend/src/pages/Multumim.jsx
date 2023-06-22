import { Link } from "preact-router";
import Navbar from "../components/Navbar";

export default function Multumim() {
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);

  const role = params.get("role");
  return (
    <div className="h-screen">
      <Navbar />
      <div class="text-center h-full flex flex-col items-center justify-center">
        <div>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {role == "refugee" ? "Group joined successfully" : "Thank you!"}
          </h1>
          <p class="mt-6 text-xl leading-7 text-gray-600">
            {role == "refugee"
              ? "Your request has been sent"
              : "A request has been sent to the administrators who manage this group."}
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              class="rounded-md bg-red-500 px-3.5 py-2.5 text-sm sm:text-lg font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Home
            </Link>
            <Link
              href="/groups"
              class="text-sm sm:text-lg font-semibold text-gray-900"
            >
              Lista de cereri
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
