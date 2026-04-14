import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "@/controller/user.controller";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  params: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 400 });
    }
    const { id } = await params.params;
    const user = await getUserById(id);
    return user;
  } catch (error: any) {
    console.error("Error while fetching user:", error);
    throw new Error("Error to fetching user:", error);
  }
}
export async function DELETE(
  req: Request,
  params: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 400 });
    }
    const { id } = await params.params;
    const user = await deleteUser(id);
    return user;
  } catch (error: any) {
    console.error("Error while deleting a user:", error);
    throw new Error("Error to deleting a user:", error);
  }
}
export async function PUT(
  req: Request,
  params: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 400 });
    }
    const { id } = await params.params;
    const body = await req.json();
    const user = await updateUser(id, body);
    return user;
  } catch (error: any) {
    console.error("Error while deleting a user:", error);
    throw new Error("Error to deleting a user:", error);
  }
}
