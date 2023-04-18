"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/context/authContext";
import { NftsContext } from "@/context/nftsContext";
import { useAssetFile } from "@/hooks/useAssetFile";

type FormInput = {
  price: number;
  name: string;
  description: string;
};

const CreateNft = () => {
  const [formInput, setFormInput] = useState<FormInput>({
    price: 0,
    name: "",
    description: "",
  });
  const [assetFile, updateAssetFile, uploadAssetFile] = useAssetFile();
  const { nfts } = useContext(NftsContext);
  const [_nfts, , listNft] = nfts!;
  const { auth } = useContext(AuthContext);
  const [, , , , getSigner, ,] = auth!;
  const router = useRouter();

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    updateAssetFile(file);
  };

  const uploadToIpfs = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price) return;
    try {
      const url = await uploadAssetFile(name, description);
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
          className="mt-8 rounded p-4 text-gray-900"
          onChange={(e) => {
            setFormInput({ ...formInput, name: e.target.value });
          }}
        />
        <textarea
          placeholder="asset descriprtion"
          className="mt-2 rounded p-4 text-gray-900 resize-none"
          onChange={(e) => {
            setFormInput({ ...formInput, description: e.target.value });
          }}
        />
        <input
          placeholder="asset price in eth"
          className="mt-2 rounded p-4 text-gray-900"
          onChange={(e) => {
            setFormInput({ ...formInput, price: parseFloat(e.target.value) });
          }}
        />
        <input
          id="file"
          type="file"
          name="asset"
          className="my-4"
          placeholder=""
          onChange={handleOnChange}
        />
        {assetFile?.onMemoryUrl && (
          <Image
            className="rounded mt-4"
            width="150"
            height="150"
            src={assetFile?.onMemoryUrl}
            alt=""
          />
        )}
        <button
          onClick={() => {
            (async () => {
              await listNftForSale();
            })();
          }}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
};

export default CreateNft;
