"use client";
import { Web3Auth } from "@web3auth/modal";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { NFTMarketplace } from "@/../../typechain-types";
import Image from "next/image";

import { useAuth } from "@/hooks/useAuth";
import { useNfts } from "@/hooks/useNfts";
import Header from "@/components/header";
import { AuthContext } from "@/context/authContext";

export default function Home() {
  const [nfts, buyNft, ,] = useNfts();
  const { auth } = useContext(AuthContext);
  const [initAuth, isLogin, login, logout, getSigner, getAddress, getBalance] =
    auth!;

  console.log(getAddress());

  return (
    <>
      <Header></Header>
      <div className="flex justify-center">
        <div className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => {
              console.log(nft.image);
              return (
                <div
                  key={i}
                  className="border shadow rounded-xl overflow-hidden"
                >
                  <Image src={nft.image} width="150" height="150" alt="" />
                  <div className="p-4">
                    <p className="text-2xl font-semibold">{nft.name}</p>
                    <div className="overflow-hidden">
                      <p className="text-gray-400">{nft.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">
                      {nft.price} ETH
                    </p>
                    <button
                      className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                      onClick={() => {
                        const signer = getSigner();
                        if (!signer) return;
                        buyNft(nft, signer);
                      }}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
