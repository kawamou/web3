import React from "react";
import { useNfts } from "@/hooks/useNfts";

export const NftsContext = React.createContext<{
  nfts: ReturnType<typeof useNfts> | null;
}>({ nfts: null });
