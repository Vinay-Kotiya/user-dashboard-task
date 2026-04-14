import { register } from "@/controller/auth.controller";
import { createUser, getAllUsers } from "@/controller/user.controller";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 400 });
    }
    const user = await getAllUsers();
    return user;
  } catch (error: any) {
    console.error("Error while fetching users:", error);
    throw new Error("Error to fetching users:", error);
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 400 });
    }
    const body = await req.json();
    const user = await createUser(body);
    return user;
  } catch (error: any) {
    console.error("Error while register user:", error);
    throw new Error("Error to register user:", error);
  }
}
