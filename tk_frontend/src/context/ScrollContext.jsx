import { createContext, useState, useContext } from "react";

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const [skipScroll, setSkipScroll] = useState(false);
  return (
    <ScrollContext.Provider value={{ skipScroll, setSkipScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
