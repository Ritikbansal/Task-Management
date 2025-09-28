export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const tasks = await prisma.task.findMany({
      include: { assignee: true },
      orderBy: { modifiedAt: "desc" },
      skip,
      take: limit,
    });

    const totalCount = await prisma.task.count();

    return NextResponse.json({ tasks, total: totalCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("body", body);
    const task = await prisma.task.create({
      data: {
        ...body,
        assignee: {
          connect: {
            id: parseInt(body.assignee),
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (task?.id)
      return NextResponse.json({ message: "Task created" }, { status: 201 });
    if (!task?.id)
      return NextResponse.json(
        { message: "Task creation failed" },
        { status: 403 }
      );
  } catch (err) {
    return NextResponse.json(
      { message: "Task creation failed" },
      { status: 403 }
    );
  }
}
