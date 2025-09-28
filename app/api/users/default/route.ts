export const dynamic = "force-dynamic";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const defaultUsers: Prisma.UserCreateInput[] = [
      { name: "Admin User", email: "admin@example.com", password: "1234", role: 'Admin' },
      { name: "Regular User", email: "user@example.com", password: "1234", role: 'User' },
      { name: "Owner User", email: "owner@example.com", password: "1234", role: 'Owner' },
    ];

    const createdUsers = [];

    for (const userData of defaultUsers) {
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existing) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await prisma.user.create({
          data: { ...userData, password: hashedPassword },
        });
        createdUsers.push(user);
      }
    }

    return NextResponse.json(
      { message: "Default users seeded with hashed passwords", createdUsers },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create default users" },
      { status: 500 }
    );
  }
}

