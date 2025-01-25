import React from "react";
import Background from "./ui/background";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import About from "./About";
import Link from "next/link";
const { isAuthenticated } = getKindeServerSession();
const Home: React.FC = async () => {
  return (
    <div>
      <div>
        <Background />
        <div className="h-screen flex items-center justify-center flex-col">
          <div className="flex justify-center text-center mb-[4rem]">
            <h1
              className="text-6xl font-extrabold"
              style={{ color: "#2f1c6a" }}
            >
              <span className="bg-gradient-to-r from-violet-600 to-pink-400 bg-clip-text text-transparent">
                AI{" "}
              </span>
              Driven Comment Analysis
              <br /> for Content Creators
            </h1>
          </div>
          <div>
            {(await isAuthenticated()) ? (
              <Link href="/select">
                <button className="px-12 py-4 rounded-full bg-[#ac99f1] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#967ce1] transition-transform duration-200">
                  Start Now
                </button>
              </Link>
            ) : (
              <Link href="/api/auth/login">
                <button className="px-12 py-4 rounded-full bg-[#ac99f1] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#967ce1] transition-transform duration-200">
                  Start Now
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div>
        <About/>
      </div>
    </div>
  );
};

export default Home;
