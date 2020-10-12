import React, { useState, createContext } from "react";

export const ThingsContext = createContext();

export const ThingsContextProvider = (props) => {
  const [things, setThings] = useState([]);
  const addThings = (thing) => {
    setThings([...things, thing]);
  };
  return (
    <ThingsContext.Provider value={{ things, setThings, addThings }}>
      {props.children}
    </ThingsContext.Provider>
  );
};
