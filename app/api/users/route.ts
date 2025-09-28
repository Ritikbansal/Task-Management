export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import { getCurrentUser } from "@/lib/utils";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "Owner") {
      return NextResponse.json(
        { message: "Forbidden: Only Owner can create users" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const user = await prisma.user.create({
      data: {
        ...body,
        password: await bcrypt.hash(body.password, 10),
      },
      select: {
        id: true,
      },
    });

    if (user?.id) {
      return NextResponse.json(
        { message: "User created successfully", userId: user.id },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "User creation failed" },
      { status: 403 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: {
      modifiedAt: Prisma.SortOrder.asc,
    },
  });
  return NextResponse.json(users);
}
