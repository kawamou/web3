"use client";
import "./globals.css";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/authContext";
import { useNfts } from "@/hooks/useNfts";
import { NftsContext } from "@/context/nftsContext";

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};

const NftsProvider = ({ children }: { children: React.ReactNode }) => {
  const nfts = useNfts();
  return (
    <NftsContext.Provider value={{ nfts }}>{children}</NftsContext.Provider>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <Header></Header> */}
        <AuthProvider>
          <NftsProvider>{children}</NftsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
