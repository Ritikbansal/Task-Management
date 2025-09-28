import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { clsx, type ClassValue } from 'clsx'
import {jwtDecode} from "jwt-decode"
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type JwtPayload = {
  id: number
  email: string
  name: string
  role: "Admin" | "Owner" | "User"
  exp: number
}

export function getUser() {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const decoded: JwtPayload = jwtDecode(token)
    return decoded
  } catch (e) {
    console.error("Invalid token", e)
    return null
  }
}

const prisma = new PrismaClient();

export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const user = await prisma.user.findUnique({ where: { id: parseInt(token) } });
  return user;
}
