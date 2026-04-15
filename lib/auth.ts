import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDatabase } from "./db";
// import User from "@/models/User";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { TokenExpiredError } from "jsonwebtoken";
import { generateToken } from "./jwt";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        try {
          //   await connectToDatabase();
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isValid) {
            throw new Error("Invalid Password.");
          }
          const token = generateToken(user);
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNo: user.phoneNo,
            gender: user.gender,
            role: user.role,
            authToken: `Bearer ${token}`,
          } as any;
        } catch (error) {
          console.error("Next Auth Error: ", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNo = user.phoneNo;
        token.gender = user.gender;
        token.role = user.role;
        token.authToken = user.authToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.phoneNo = token.phoneNo;
        session.user.role = token.role;
        session.authToken = token.authToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
