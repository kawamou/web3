"use client";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const Auth = () => {
  const { auth } = useContext(AuthContext);
  const [initAuth, isLogin, login, logout, getSigner, getAddress, getBalance] =
    auth!;
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen w-full gap-4">
      <button
        className=" bg-blue-500 text-white rounded px-4 py-2"
        onClick={async () => {
          if (!isLogin()) {
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
        className="bg-blue-500 text-white rounded px-4 py-2"
        onClick={async () => {
          await logout();
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Auth;
