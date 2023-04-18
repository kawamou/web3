import axios from "axios";

export type Metadata = {
  id: string;
  name: string;
  description: string;
};

const localBaseURL = "http://localhost:9000/default-bucket";

const repo = axios.create({
  baseURL: localBaseURL,
});

const repository = () => {
  return {
    self: () => repo,
    get: async (id: string) => {
      return repo.get(`${id}`);
    },
    create: async (formData: FormData, metaData: Metadata) => {
      // https://qiita.com/the_red/items/b5668ee9d3bcc5ff0adf/
      // formDataの永続化かなり面倒だった...
      const file = formData.get("file");
      if (file instanceof Blob) {
        const f = file as Blob;
        const stream = f.stream();
        const chunks = [];
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const buffer = Buffer.concat(chunks);
        return repo.put(`${metaData.id}.png`, buffer, {
          headers: {
            // "Content-Type": "application/octet-stream",
            "x-amz-meta-name": metaData.name,
            "x-amz-meta-tokenUri": `${localBaseURL}/${metaData.id}.png`,
            "x-amz-meta-description": metaData.description,
          },
        });
      } else {
      }
    },
  };
};

export default repository;
