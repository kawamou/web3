import axios from "axios";

const localBaseURL = "http://localhost:3000/api";

const repo = axios.create({
  baseURL: localBaseURL,
});

const assetRepository = () => {
  return {
    get: async (id: string) => {
      const res = await repo.get(`assets/${id}`);
      return {
        name: res.headers.name as string,
        description: res.headers.description as string,
        file: res.data as File,
      };
    },
    create: async (data: { name: string; description: string; file: File }) => {
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
