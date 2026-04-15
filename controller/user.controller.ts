import { generateToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      phoneNo: true,
      gender: true,
      dob: true,
      address: true,
      city: true,
      state: true,
      hobby: true,
      profession: true,
      country: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(users);
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      phoneNo: true,
      gender: true,
      dob: true,
      address: true,
      city: true,
      state: true,
      hobby: true,
      profession: true,
      country: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
};
export const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({ where: { id } });

  return NextResponse.json(user);
};
export const updateUser = async (id: string, data: User) => {
  const user = await prisma.user.update({ where: { id }, data });

  return NextResponse.json(user);
};

export const createUser = async (data: User) => {
  const { username, firstName, lastName, email, password, gender, dob, role } =
    data;

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Name, Email and Password are required" },
      { status: 400 },
    );
  }
  if (!firstName || !lastName || !gender || !dob || !role) {
    return NextResponse.json(
      { message: "First Name, last name, gender, dob and role are required" },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  const token = generateToken(user);
  return NextResponse.json({ user, token }, { status: 201 });
};
