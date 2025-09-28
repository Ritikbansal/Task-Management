export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET(req: Request) {
  const url = req.url;
  const { searchParams } = new URL(url);
  console.log("searchParams", searchParams.get("q"));
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;
  console.log('skip', skip)
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchParams.get("q") || "",
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchParams.get("q") || "",
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      modifiedAt: "asc",
    },
    skip: skip,
    take: limit,
  });
    const totalCount = await prisma.user.count({
        where: {
            OR: [
                {
                    name: {
                        contains: searchParams.get("q") || "",
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchParams.get("q") || "",
                        mode: "insensitive",
                    },
                },
            ],
        },
    })
  console.log("users", users);
    return NextResponse.json({ users: users, total: totalCount });
}
