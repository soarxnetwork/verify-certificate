
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import {HeroUIProvider} from '@heroui/react'

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <HeroUIProvider>
    <NextUIProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {children}
    </NextUIProvider>
    </HeroUIProvider>
  );
};

export default Providers;
