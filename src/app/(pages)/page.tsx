"use client";

import useAuth from "@/context/useAuth";
import React from "react";
import HomeQuote from "@/components/HomeQuote";
import Starter from "./Starter/page";
import Image from "next/image";

const Home = () => {
  const { authStatus } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      <div className="flex flex-wrap -mx-2 mt-32 gap-y-8 justify-center">
        {!authStatus && (
          <div className="w-full sm:w-1/2 px-2 flex justify-center flex-wrap items-center">
            <div className="relative text-center w-full flex justify-center flex-wrap">
              <div className="w-full max-w-[100px]">
                <Image src="/favicon.ico" alt="Logo" height="100" width="100" />
              </div>
              <HomeQuote />
            </div>
          </div>
        )}
        <div className="w-full  px-2 flex flex-wrap justify-center">
          {authStatus && <div className="max-w-md">{/* <Starter /> */}</div>}
        </div>
      </div>
      <Starter />
    </div>
  );
};

export default Home;
