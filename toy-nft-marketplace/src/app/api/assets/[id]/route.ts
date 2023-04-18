import repository from "../../assetRepository";

const repo = repository();

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  try {
    const response = await repo.get(id);
    return new Response("ok", {
      status: 200,
      headers: {
        "x-amz-meta-name": response.headers["x-amz-meta-name"],
        "x-amz-meta-tokenUri": response.headers["x-amz-meta-tokenUri"],
        "x-amz-meta-description": response.headers["x-amz-meta-description"],
      },
    });
  } catch (error) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
