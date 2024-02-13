import { useState, useEffect } from "preact/hooks";

export default function SplitScreen({ children }) {
  const [left, right] = children;

  //De ce aceasta bucata de cod?
  //Well, exista o problema cu 100vh in browsere, in special pe deviceurile iOS
  //in Safari, cele cu toolbar ascund partea de jos a paginii pentru ca
  //toolbarul nu este luat in considerare la calcularea vh-ului.

  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const updateVh = () => {
      setVh(window.innerHeight);
    };

    window.addEventListener('resize', updateVh);

    return () => window.removeEventListener('resize', updateVh);
  }, []);

  return (
    <div style={{ height: vh }} className="relative flex lg:flex-row flex-col">
      <div className="w-full h-full lg:w-1/2">
        {left}
      </div>
      <div className="w-full lg:w-1/2">
        {right}
      </div>
    </div>
  )
}
