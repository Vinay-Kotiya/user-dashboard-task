import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    authToken: string;
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dob: Date;
    role: string;
    phoneNo: string;
    country: string;
    state: string;
    city: string;
    address: string;
    hobby: string;
    profession: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    authToken: string;
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      gender: string;
      dob: Date;
      role: string;
      phoneNo: string;
      country: string;
      state: string;
      city: string;
      address: string;
      hobby: string;
      profession: string;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    authToken: string;
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dob: Date;
    role: string;
    phoneNo: string;
    country: string;
    state: string;
    city: string;
    address: string;
    hobby: string;
    profession: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
