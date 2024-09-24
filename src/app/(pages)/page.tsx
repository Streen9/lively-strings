"use client";

import React from "react";
import useAuth from "@/context/useAuth";
import HomeQuote from "@/components/HomeQuote";
import Starter from "./Starter/page";

const Home = () => {
  const { authStatus } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      <div className="flex flex-wrap -mx-2 mt-6 gap-y-8 justify-center">
        {!authStatus && (
          <div className="w-full sm:w-1/2 px-2 flex justify-center flex-wrap items-center">
            <div className="relative text-center w-full flex justify-center flex-wrap">
              <HomeQuote />
            </div>
          </div>
        )}
        <div className="w-full px-2 flex flex-wrap justify-center">
          <Starter />
        </div>
      </div>
    </div>
  );
};

export default Home;
