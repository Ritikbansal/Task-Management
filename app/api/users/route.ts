export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
const prisma = new PrismaClient();
export async function POST(req: Request) {
    const body = await req.json()
    console.log(body)
  const user = await prisma.user.create({
    data: {
      ...body, password:  await bcrypt.hash(body.password, 10)
    },
    select: {
      id: true,
    },
  });
  if (user.id)
    return NextResponse.json(
      { message: "User created Successfully" },
      { status: 201 }
    );
  if (!user || !user.id)
    return NextResponse.json(
      { message: "User creation failed" },
      { status: 403 }
    );
}

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: {
      modifiedAt: Prisma.SortOrder.asc,
    },
  });
  return NextResponse.json(users);
}
