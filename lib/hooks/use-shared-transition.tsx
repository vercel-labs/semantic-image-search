"use client";

import React, { createContext, useContext, useTransition } from "react";

const defaultValue: {
  isPending: boolean;
  startTransition?: React.TransitionStartFunction;
} = { isPending: false };
const TransitionContext = createContext(defaultValue);

export const TransitionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPending, startTransition] = useTransition();

  return (
    <TransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useSharedTransition = () => useContext(TransitionContext);
