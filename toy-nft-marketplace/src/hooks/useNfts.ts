import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { NFTMarketplace } from "@/../../typechain-types";

import abi from "@/../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

import { Nft } from "@/types/nft";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKET_PLACCE_ADDRESS ?? "";

export const useNfts = (): [
  Nft[],
  (nft: Nft, signer: ethers.providers.JsonRpcSigner) => Promise<void>,
  (
    ipfsUrl: string,
    price: number,
    signer: ethers.providers.JsonRpcSigner
  ) => Promise<void>,
  (id: string) => Nft | undefined
] => {
  const [nfts, setNfts] = useState<Nft[]>([]);

  useEffect(() => {
    (async () => {
      const prev = await loadNFTs();
      setNfts(prev);
    })();
  }, []);

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(
      marketplaceAddress,
      abi.abi,
      provider
    ) as NFTMarketplace;
    const data = await contract.fetchMarketItems();

    const items: Nft[] = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        return {
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          tokenUri: tokenUri,
        };
      })
    );
    return items;
  };

  const getNftById = (id: string) => {
    if (!nfts) return;
    return nfts.find((nft) => nft.tokenId === id);
  };

  const listNft = async (
    ipfsUrl: string,
    price: number,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    const priceString = ethers.utils.parseUnits(price.toString(), "ether");

    const contract = new ethers.Contract(
      marketplaceAddress,
      abi.abi,
      signer
    ) as NFTMarketplace;

    const listingPrice = await contract.getListingPrice();
    const listingPriceString = listingPrice.toString();

    const tx = await contract.createToken(ipfsUrl, price, {
      value: listingPriceString,
    });
  };

  const buyNft = async (nft: Nft, signer: ethers.providers.JsonRpcSigner) => {
    const contract = new ethers.Contract(
      marketplaceAddress,
      abi.abi,
      signer
    ) as NFTMarketplace;

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const tx = await contract.createMarketSale(nft.tokenId, { value: price });
    await tx.wait();
  };

  return [nfts ?? [], buyNft, listNft, getNftById];
};
