export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log('password', password)
  console.log('email', email)
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  console.log('password', password)
  console.log('user.password', user.password)
  const valid = bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    "JWT_SECRET",
    { expiresIn: "1h" }
  );
    return NextResponse.json({ token })
}
