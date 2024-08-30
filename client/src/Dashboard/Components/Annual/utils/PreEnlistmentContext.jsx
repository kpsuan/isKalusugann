import React, { createContext, useContext, useState } from 'react';

const PreEnlistmentContext = createContext();

export const usePreEnlistment = () => useContext(PreEnlistmentContext);

export const PreEnlistmentProvider = ({ children }) => {
  const [preEnlistStart] = useState(new Date('2024-08-01T00:00:00+08:00'));
  const [preEnlistEnd] = useState(new Date('2024-08-11T23:59:59+08:00'));

  return (
    <PreEnlistmentContext.Provider value={{ preEnlistStart, preEnlistEnd }}>
      {children}
    </PreEnlistmentContext.Provider>
  );
};
