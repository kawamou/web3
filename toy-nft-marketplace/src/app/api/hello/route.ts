import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = (req: Request) => {
  return NextResponse.json({ name: "John Doe" });
};
