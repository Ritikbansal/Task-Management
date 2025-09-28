import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const task = await prisma.task.findUnique({
    where: { id: Number(params.id) },
  })
  return NextResponse.json(task)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = await prisma.task.update({
    where: { id: Number(params.id) },
      data: {
          ...data, assignee: {
          connect: {
            id: parseInt(data.assignee),
          },
        },
      },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    console.log('params', params)
  const updated = await prisma.task.delete({
    where: {
      id: parseInt(params.id),
    },
  });
  return NextResponse.json(updated);
}
