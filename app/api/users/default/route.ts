import { Prisma, PrismaClient, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const defaultUsers: Prisma.UserCreateInput[] = [
      { name: "Admin User", email: "admin@example.com", password: "1234", role: 'Admin' },
      { name: "Regular User", email: "user@example.com", password: "1234", role: 'User' },
      { name: "Owner User", email: "owner@example.com", password: "1234", role: 'Owner' },
    ];

    const roles: Role[] = [Role.User, Role.Admin, Role.Owner];
    const randomUsers = Array.from({ length: 100 }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: '1234',
      role: roles[Math.floor(Math.random() * roles.length)]
    }));

    const allUsers = [...defaultUsers, ...randomUsers];
    const createdUsers = [];

    for (const userData of allUsers) {
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await prisma.user.create({
          data: { ...userData, password: hashedPassword },
        });
        createdUsers.push(user);
      }
    }

    return NextResponse.json(
      { message: "Default + random users seeded with hashed passwords", createdUsers },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to seed users" },
      { status: 500 }
    );
  }
}
