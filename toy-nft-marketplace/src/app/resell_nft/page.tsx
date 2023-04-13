"use client";
import { AuthContext } from "@/context/authContext";
import { useAuth } from "@/hooks/useAuth";
import { useNfts } from "@/hooks/useNfts";
import { Nft } from "@/types/nft";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

type FormInput = {
  price: number;
  image: string;
};

const getQueryStringValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
};

const ResellNft = () => {
  const [nft, setNft] = useState<Nft>();
  const [nfts, , listNft, getNftById] = useNfts();
  const { auth } = useContext(AuthContext);
  const [initAuth, isLogin, login, logout, getSigner, getAddress, getBalance] =
    auth!;
  const [formInput, setFormInput] = useState<FormInput>({
    price: 0,
    image: "",
  });
  const router = useRouter();
  const { id } = router.query;
  const { image, price } = formInput;

  const listNftForSale = async () => {
    const signer = getSigner();
    if (!signer) return;
    if (!nft?.tokenUri) return;
    await listNft(nft?.tokenUri, formInput.price, signer);
    router.push("/");
  };

  useEffect(() => {
    (async () => {
      const nft = getNftById(getQueryStringValue(id));
      if (!nft?.tokenUri) return;
      const meta = await axios.get(nft?.tokenUri);
      setFormInput((state) => ({ ...state, image: meta.data.image }));
      setNft(nft);
    })();
  });

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="asset price in eth"
          className="mt-2 border rounded p-4"
          onChange={(e) => {
            setFormInput({ ...formInput, price: Number(e.target.value) });
          }}
        />
        {image && (
          <Image className="rounded mt-4" width="350" src={image} alt="" />
        )}
        <button
          onClick={listNftForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        ></button>
      </div>
    </div>
  );
};

export default ResellNft;
