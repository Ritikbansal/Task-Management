import { PrismaClient, TaskPriority, TaskStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Get all existing users
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found. Seed users first." },
        { status: 400 }
      );
    }

    const tasksData = Array.from({ length: 30 }, () => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      assignee: {
        connect: {
          id: faker.helpers.arrayElement(users).id,
        },
      },
      status: faker.helpers.arrayElement(Object.values(TaskStatus)),
      priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
    }));

    const createdTasks = [];
    for (const taskData of tasksData) {
      const task = await prisma.task.create({
        data: taskData,
      });
      createdTasks.push(task);
    }

    return NextResponse.json(
      { message: "Default tasks seeded", createdTasks },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to seed tasks", error: err },
      { status: 500 }
    );
  }
}
