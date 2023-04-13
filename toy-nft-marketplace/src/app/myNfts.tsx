"use client";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKET_PLACCE_ADDRESS ?? "";

import { NFTMarketplace } from "@/../../typechain-types";
import { useNfts } from "@/hooks/useNfts";
import { useAuth } from "@/hooks/useAuth";
import { Nft } from "@/types/nft";
import Image from "next/image";
import { list } from "postcss";
import { AuthContext } from "@/context/authContext";

export const MyNfts = () => {
  const [nfts, ,] = useNfts();
  const { auth } = useContext(AuthContext);
  const [initAuth, isLogin, login, logout, getSigner, getAddress, getBalance] =
    auth!;
  const router = useRouter();
  const address = getAddress() ?? "";

  const listNft = (nft: Nft) => {
    router.push(`/resell-nft?id=${nft.tokenId}`);
  };
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => {
            if (nft.owner !== address) return;
            return (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <Image src={nft.image} className="rounded" alt="" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    Price - {nft.price} ETH
                  </p>
                  <button
                    className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => {
                      listNft(nft);
                    }}
                  >
                    List
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
