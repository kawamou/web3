import axios from "axios";

type createAssetRequest = {
  name: string;
  description: string;
  file: File;
};

const localBaseURL = "http://localhost:3000/api";

const repo = axios.create({
  baseURL: localBaseURL,
});

const assetRepository = () => {
  return {
    get: (id: string) => repo.get(`assets/${id}`),
    create: async (data: createAssetRequest) => {
      const { name, description, file } = data;
      const formData = new FormData();
      formData.append("file", file);
      return repo.post("assets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          name: name,
          description: description,
        },
      });
    },
  };
};

export default assetRepository;
