"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dob: Date;
  role: string;
  phoneNo: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  hobby: string | null;
  profession: string | null;
  createdAt: Date;
  updatedAt: Date;
};
export default function Home() {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const { data: session } = useSession();
  console.log("Session data=>", session);
  useEffect(() => {
    // setUser(session?.user);
    const fetchUser = async () => {
      try {
        const userRes = await axios.get(`/api/users/${session?.user.id}`, {
          headers: {
            Authorization: session?.authToken,
          },
        });
        console.log("User data fetched by id:", userRes.data);
        if (userRes.status == 200) {
          setUser(userRes.data);
        }
      } catch (error) {
        console.error("failed to fetch user detail", error);
      }
    };
    fetchUser();
  }, [session]);
  // signOut({ callbackUrl: "/" });
  return (
    // <div className="min-h-screen bg-zinc-50">
    //   <nav className="w-full h-[10vh] bg-blue-300 flex items-center justify-between px-5">
    //     <span className="text-2xl font-semibold">User Dashboard</span>
    //     {!session?.user ? (
    //       <Button
    //         onClick={() => {
    //           router.push("/login");
    //         }}
    //       >
    //         Login
    //       </Button>
    //     ) : (
    //       <Button
    //         onClick={() => {
    //           signOut({ callbackUrl: "/" });
    //         }}
    //       >
    //         Logout
    //       </Button>
    //     )}
    //   </nav>

    //   <main className="p-6">
    //     {user ? (
    //       <div className="max-w-2xl mx-auto bg-white shadow rounded-2xl p-6">
    //         <h1 className="text-3xl font-bold mb-4">
    //           Welcome, {user.firstName} {user.lastName}
    //         </h1>

    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
    //           <p>
    //             <span className="font-semibold">Username:</span> {user.username}
    //           </p>
    //           <p>
    //             <span className="font-semibold">Email:</span> {user.email}
    //           </p>
    //           <p>
    //             <span className="font-semibold">Phone:</span> {user.phoneNo}
    //           </p>
    //           <p>
    //             <span className="font-semibold">Gender:</span> {user.gender}
    //           </p>
    //           <p>
    //             <span className="font-semibold">Role:</span> {user.role}
    //           </p>
    //           <p>
    //             <span className="font-semibold">DOB:</span>{" "}
    //             {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
    //           </p>
    //           <p className="md:col-span-2">
    //             <span className="font-semibold">User ID:</span> {user.id}
    //           </p>
    //         </div>
    //       </div>
    //     ) : (
    //       <div className="text-center mt-20 text-xl text-gray-600">
    //         No user found in local storage.
    //       </div>
    //     )}
    //   </main>
    // </div>
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 h-16 bg-white shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">User Dashboard</h1>

        {!session?.user ? (
          <Button onClick={() => router.push("/login")}>Login</Button>
        ) : (
          <Button variant="destructive" onClick={() => signOut()}>
            Logout
          </Button>
        )}
      </nav>

      {/* Main */}
      <main className="p-6">
        {user ? (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">@{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              <span className="px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-600 font-medium">
                {user.role}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Personal Info</h3>

                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Gender:</strong> {user.gender}
                  </p>
                  <p>
                    <strong>DOB:</strong>{" "}
                    {new Date(user.dob).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phoneNo || "N/A"}
                  </p>
                  <p>
                    <strong>Profession:</strong> {user.profession || "N/A"}
                  </p>
                  <p>
                    <strong>Hobby:</strong> {user.hobby || "N/A"}
                  </p>
                </div>
              </div>

              {/* Address Info */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Address Info</h3>

                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Country:</strong> {user.country}
                  </p>
                  <p>
                    <strong>State:</strong> {user.state}
                  </p>
                  <p>
                    <strong>City:</strong> {user.city}
                  </p>
                  <p>
                    <strong>Address:</strong> {user.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-600">
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-500 text-lg">
            Loading user data...
          </div>
        )}
      </main>
    </div>
  );
}
