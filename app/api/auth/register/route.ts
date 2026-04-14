import { register } from "@/controller/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await register(body);
    return user;
  } catch (error: any) {
    console.error("Error while register user:", error);
    throw new Error("Error to register user:", error);
  }
}
