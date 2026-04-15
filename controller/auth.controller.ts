import { generateToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
export const register = async (data: User) => {
  //   const body = await req.json();
  const { username, firstName, lastName, email, password, gender, dob, role } =
    data;

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Name, Email and Password are required" },
      { status: 400 },
    );
  }
  if (!firstName || !lastName || !gender || !dob) {
    return NextResponse.json(
      { message: "First Name, last name, gender, dob and role are required" },
      { status: 400 },
    );
  }
  if (!role) {
    data = { ...data, role: "USER" };
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

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }
  const user = await prisma.user.findUnique({ where: { email } });
  // console.log("User from DB======================================>", user);
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(user);
  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      gender: user.gender,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      phoneNo: user.phoneNo,
    },
    token: token,
  });
};
