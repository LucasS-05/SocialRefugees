import { createContext } from "preact";
import { useState, useEffect } from "preact/hooks";

export const userContext = createContext(null);

function setLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
}

function getLocalStorage(key, initial) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : initial;
  } catch (e) {
    return initialValue;
  }
}

const Context = ({ children }) => {
  const [user, setUser] = useState(() => getLocalStorage("user", null));

  useEffect(() => {
    setLocalStorage("user", user);
    setLocalStorage("id", user._id);
  }, [user]);

  return <userContext.Provider value={{ user, setUser }}>{children}</userContext.Provider>;
};

export default Context;
