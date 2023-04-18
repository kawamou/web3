"use client";
import { useContext } from "react";
import Image from "next/image";

import { useNfts } from "@/hooks/useNfts";
import Header from "@/components/header";
import { AuthContext } from "@/context/authContext";

export default function Home() {
  const [nfts, buyNft, ,] = useNfts();
  const { auth } = useContext(AuthContext);
  const [, isLogin, , , getSigner, ,] = auth!;

  return (
    <>
      <Header />
      {isLogin() ? (
        <div className="flex justify-center">
          <div className="px-4 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {nfts.map((nft, i) => {
                return (
                  <div
                    key={i}
                    className="border border-gray-600 rounded-xl overflow-hidden"
                  >
                    <Image
                      src={nft.image}
                      className="w-full h-56"
                      width="450"
                      height="450"
                      alt=""
                    />
                    <div className="p-4">
                      <p className="text-lg font-semibold">{nft.name}</p>
                      <div className="overflow-hidden">
                        <p className="text-base text-gray-400">
                          {nft.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-lg font-semibold">{nft.price} wei</p>
                      <button
                        className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded"
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
      ) : (
        <></>
      )}
    </>
  );
}
