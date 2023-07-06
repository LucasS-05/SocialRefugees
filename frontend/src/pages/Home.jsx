import { useContext, useEffect, useRef, useState } from "preact/hooks";
import Navbar from "../components/Navbar";
import SplitScreen from "../layouts/SplitScreen";
import red from "../assets/redback.webp";
import yellow from "../assets/yellowback.webp";
import { route } from "preact-router";
import { userContext } from "../userContext";
import { gsap } from "gsap";

const subtitlu = ["Pentru cei care pot ajuta", "Pentru cei care au nevoie de ajutor"];

const titlu = [
  "Poti oferi sprijin refugiatilor care au nevoie de ajutor?",
  "Ai nevoie de ajutor financiar sau sprijin comunitar?",
];

function LeftPanel({ change, setChange, handleAnimation }) {
  const textRefs = useRef([]);
  const { user } = useContext(userContext);

  useEffect(() => {
    gsap.from([textRefs.current], {
      delay: 0.1,
      ease: 'power3.out',
      y: 256,
      stagger: {
        amount: "0.25"
      }
    })
  }, [change])

  return (
    <div className="h-full relative overflow-y-hidden">
      <Navbar />
      <div className="flex flex-col px-2 sm:px-4 lg:px-8 xl:px-16 justify-center h-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl flex flex-col space-y-8">
            <div className="overflow-hidden">
              <h2 ref={(el) => (textRefs.current[0] = el)} className="text-xl sm:text-3xl">
                {change ? subtitlu[0] : subtitlu[1]}
              </h2>
            </div>
            <div className="overflow-hidden py-3">
              <h1 ref={(el) => (textRefs.current[1] = el)} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight">
                {change ? titlu[0] : titlu[1]}
              </h1>
            </div>
            <div className="overflow-hidden">

              {change ? (
                <button
                  type="button"
                  ref={(el) => (textRefs.current[2] = el)}
                  onClick={() => user ? route("/groups") : route("/login")}
                  className="rounded-xl w-fit bg-red-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-red-400 "
                >
                  Lista de cereri →
                </button>
              ) : (
                <div className="flex items-center gap-x-6">
                  <button
                    ref={(el) => (textRefs.current[3] = el)}
                    type="button"
                    onClick={() => user ? route("/groups") : route("/login")}
                    className={`rounded-xl w-fit bg-yellow-500 px-6 py-3 text-sm sm:text-lg font-medium text-white shadow-sm hover:bg-yellow-400 `}
                  >
                    Vezi grupurile →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {(change ? (
        <button
          ref={(el) => (textRefs.current[4] = el)}
          onClick={handleAnimation}
          className="absolute flex items-center px-2 sm:px-4 lg:px-8 xl:px-16 py-6 w-full bg-red-500 hover:bg-red-400 bottom-0"
        >
          <div
            className="px-4 sm:px-6 px-8">
            <h3
              className="text-xl sm:text-3xl text-white font-bold tracking-wide">
              Esti refugiat?→
            </h3>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAnimation}
          className="absolute flex items-center px-4 sm:px-8 lg:px-16 py-6 w-full bg-yellow-500 hover:bg-yellow-400 bottom-0"
        >
          <div className="px-4 sm:px-6 px-8">
            <h3 className="text-xl sm:text-3xl text-white font-bold tracking-wide">
              Poți oferi ajutor? →
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
}

function RightPanel({ change }) {
  return (
    <div className="h-full rounded-tl-[8rem] overflow-hidden hidden lg:block">
      <img
        loading="lazy"
        src={change ? red : yellow}
        className={`min-w-full h-full object-cover object-left `}
      ></img>
    </div>
  );
}

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef(null);
  const [change, setChange] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      const element = ref.current;

      gsap.fromTo(
        element,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: () => {
            setChange(!change)
            gsap.fromTo(
              element,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => {
                  setIsAnimating(false);
                },
              }
            );
          },
        }
      );
    }
  }

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power4.inOut" })
    setLoading(false);
    return () => {
      gsap.to(ref.current, { opacity: 0, duration: 1 });
    };

  }, [])

  return (
    <div className={`${loading ? "hidden" : ""}`} ref={ref}>
      <SplitScreen>
        <LeftPanel change={change} setChange={setChange} handleAnimation={handleAnimation} />
        <RightPanel change={change} />
      </SplitScreen>
    </div>
  );
}
