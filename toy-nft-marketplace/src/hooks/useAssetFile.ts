import { useState } from "react";
import assetRepository from "./assetRepository";

type AssetFile = {
  name: string;
  description: string;
  file: File;
  onMemoryUrl: string;
};

export const useAssetFile = (): [
  AssetFile | undefined,
  (file: File) => void,
  (name: string, description: string) => Promise<string | undefined>
] => {
  const [assetFile, setAssetFile] = useState<AssetFile>({
    name: "",
    description: "",
    file: new File([], ""),
    onMemoryUrl: "",
  });

  const updateAssetFile = (file: File) => {
    setAssetFile((prev) => {
      URL.revokeObjectURL(prev.onMemoryUrl);
      const newUrl = URL.createObjectURL(file);
      return {
        ...prev,
        file: file,
        onMemoryUrl: URL.createObjectURL(file),
      };
    });
  };

  const uploadAssetFile = async (name: string, description: string) => {
    if (assetFile?.file === undefined) return;
    const repo = assetRepository();
    const res = await repo.create({
      name,
      description,
      file: assetFile.file,
    });
    return res.data.url as string;
  };

  return [assetFile, updateAssetFile, uploadAssetFile];
};
