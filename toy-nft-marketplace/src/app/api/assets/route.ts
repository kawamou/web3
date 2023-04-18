import repository from "../assetRepository";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import fs from "fs";

const repo = repository();

export const GET = (req: Request) => {
  return new Response("ok", {
    status: 200,
  });
};

export const POST = async (req: Request) => {
  const name = req.headers.get("name") as string;
  const description = req.headers.get("description") as string;
  const file = await req.formData();
  if (!file) return;
  const id = randomUUID();
  try {
    await repo.create(file, {
      id,
      name: name,
      description: description,
    });
    return NextResponse.json({
      url: `${repo.self().defaults.baseURL}/${id}.png`,
    });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
