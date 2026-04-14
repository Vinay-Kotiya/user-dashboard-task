import { login } from "@/controller/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    console.log("User email==>", email, " Password => ", password);
    const user = await login({ email, password });
    return user;
  } catch (error: any) {
    console.error("Error while login :", error);
    throw new Error("Error to Login user:", error);
  }
}
