import React, { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useNfts } from "@/hooks/useNfts";

type FormInput = {
  price: number;
  name: string;
  description: string;
};

const client = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
});

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKET_PLACCE_ADDRESS ?? "";

const CreateNft = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, setFormInput] = useState<FormInput>({
    price: 0,
    name: "",
    description: "",
  });
  const [, , listNft] = useNfts();
  const [login, logout, getSigner, getAddress, getBalance] = useAuth();
  const router = useRouter();

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("failed to upload file: ", error);
    }
  };

  const uploadToIpfs = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("failed to upload file: ", error);
    }
  };

  const listNftForSale = async () => {
    const url = await uploadToIpfs();
    if (!url) return;
    const signer = getSigner();
    if (!signer) return;
    await listNft(url, formInput.price, signer);
    router.push("/");
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="asset name"
          className="mt-8 border rounded p-4"
          onChange={(e) => {
            setFormInput({ ...formInput, name: e.target.value });
          }}
        />
        <textarea
          placeholder="asset descriprtion"
          className="nt-2 border rounded p-4"
          onChange={(e) => {
            setFormInput({ ...formInput, description: e.target.value });
          }}
        />
        <input
          type="file"
          name="asset"
          className="my-4"
          onChange={handleOnChange}
        />
        {fileUrl && (
          <Image className="rounded mt-4" width="350" src={fileUrl} alt="" />
        )}
        <button
          onClick={listNftForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        ></button>
      </div>
    </div>
  );
};

export default CreateNft;
