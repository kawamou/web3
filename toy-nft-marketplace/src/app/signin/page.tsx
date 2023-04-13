"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Signin = () => {
  const [initAuth, isLogin, login, logout, getSigner, getAddress, getBalance] =
    useAuth();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex justify-center items-center h-screen w-full gap-4">
      <button
        className=" bg-pink-500 text-white rounded px-4 py-2 shadow-lg"
        onClick={async () => {
          console.log("login");
          const isLoggedIn = await isLogin();
          if (!isLoggedIn) {
            setIsLoggedIn(true);
            const web3auth = await initAuth();
            const provider = await web3auth?.connect();
            if (!provider) return;
            await login(provider);
            router.push("/");
          }
        }}
      >
        Login
      </button>
      <button
        className="bg-pink-500 text-white rounded px-4 py-2 shadow-lg"
        onClick={async () => {
          console.log("logout");
          await logout();
          setIsLoggedIn(false);
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Signin;
