import { Suspense } from "react";
import { UpdateUserForm } from "@/components/UpdateUserForm";

export default function AddUser() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <UpdateUserForm />
        </Suspense>
      </div>
    </div>
  );
}
