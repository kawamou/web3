"use client";
import { AuthContext } from "@/context/authContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Signin = () => {
  const { auth } = useContext(AuthContext);
  const [initAuth, isLogin, login, logout, getSigner, getAddress, getBalance] =
    auth!;
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen w-full gap-4">
      <button
        className=" bg-pink-500 text-white rounded px-4 py-2 shadow-lg"
        onClick={async () => {
          const isLoggedIn = await isLogin();
          console.log(isLoggedIn);
          if (!isLoggedIn) {
            console.log("login");
            const web3auth = await initAuth();
            const provider = await web3auth?.connect();
            if (!provider) return;
            login(provider);
          }
          router.push("/");
        }}
      >
        Login
      </button>
      <button
        className="bg-pink-500 text-white rounded px-4 py-2 shadow-lg"
        onClick={async () => {
          console.log("logout");
          await logout();
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Signin;
