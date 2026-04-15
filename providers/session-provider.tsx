"use client";

import { SessionProvider } from "next-auth/react";

// const urlEndPoint = process.env.NEXT_PUBLIC_ENDPOINT!;
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
