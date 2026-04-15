import { AddUserForm } from "@/components/AddUserForm";

export default function AddUser() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AddUserForm />
      </div>
    </div>
  );
}
