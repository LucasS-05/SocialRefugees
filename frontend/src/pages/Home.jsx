import { useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import SplitScreen from "../layouts/SplitScreen";
import red from "../assets/redback.webp";
import yellow from "../assets/yellowback.jpg";

const subtitlu = ["For people who can help", "For people who need help"];

const titlu = [
  "Poti oferi sprijin refugiatilor care au nevoie de ajutor?",
  "Ai nevoie de ajutor financiar sau sprijin comunitar?",
];

function LeftPanel({ change, setChange }) {
  return (
    <div className="h-full relative">
      <Navbar />
      <div className="flex flex-col px-2 sm:px-4 lg:px-8 xl:px-16 justify-center h-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl flex flex-col space-y-8">
            <h2 className="text-2xl sm:text-3xl">
              {change ? subtitlu[0] : subtitlu[1]}
            </h2>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight">
              {change ? titlu[0] : titlu[1]}
            </h1>
            {change ? (
              <button
                type="button"
                className="rounded-xl w-fit bg-red-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Lista de cereri →
              </button>
            ) : (
              <div className="flex items-center gap-x-6">
                <button
                  type="button"
                  className={`rounded-xl w-fit bg-yellow-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600`}
                >
                  Make a request →
                </button>
                <a
                  href="#"
                  className="text-sm sm:text-lg font-semibold leading-6 text-gray-900"
                >
                  Map of refugees <span aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {change ? (
        <button
          onClick={() => setChange(!change)}
          className="absolute flex items-center px-2 sm:px-4 lg:px-8 xl:px-16 py-6 w-full bg-red-500 hover:bg-red-400 bottom-0"
        >
          <div className="px-4 sm:px-6 px-8">
            <h3 className="text-xl sm:text-3xl text-white font-bold tracking-wide">
              Are you a refugee?→
            </h3>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setChange(!change)}
          className="absolute flex items-center px-4 sm:px-8 lg:px-16 py-6 w-full bg-yellow-500 hover:bg-yellow-400 bottom-0"
        >
          <div className="px-4 sm:px-6 px-8">
            <h3 className="text-xl sm:text-3xl text-white font-bold tracking-wide">
              Do you need help? →
            </h3>
          </div>
        </button>
      )}
    </div>
  );
}

function RightPanel({ change }) {
  return (
    <div className="h-full rounded-tl-[8rem] overflow-hidden">
      <img
        src={change ? red : yellow}
        className="min-w-full h-full object-cover object-left"
      ></img>
    </div>
  );
}

export default function Home() {
  const [change, setChange] = useState(true);
  return (
    <SplitScreen>
      <LeftPanel change={change} setChange={setChange} />
      <RightPanel change={change} />
    </SplitScreen>
  );
}
