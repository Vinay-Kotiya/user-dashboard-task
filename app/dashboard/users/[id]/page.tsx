"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { clsx } from "clsx";
import { FilePen, ShieldCheck, ArrowBigLeft } from "lucide-react";

import { useSession } from "next-auth/react";
import { getUserById } from "@/lib/api";
import { User } from "@prisma/client";

// ── Helpers ────────────────────────────────────────────────────────────────────
function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getRoleMeta(role: string) {
  const map: Record<
    string,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    ADMIN: {
      label: "Admin",
      className: "bg-rose-50 text-rose-700 border border-rose-200",
      icon: <ShieldCheck size={11} />,
    },
    USER: {
      label: "User",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
      icon: <FilePen size={11} />,
    },
  };
  return map[role] ?? map["USER"];
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={clsx("animate-pulse rounded-lg bg-zinc-100", className)} />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
        <div className="h-24 bg-zinc-100 animate-pulse" />
        <div className="px-8 pb-8 pt-4 space-y-4">
          <SkeletonPulse className="w-20 h-20 rounded-full -mt-10" />
          <SkeletonPulse className="h-7 w-48" />
          <SkeletonPulse className="h-4 w-64" />
          <div className="flex gap-8 pt-2">
            <SkeletonPulse className="h-4 w-32" />
            <SkeletonPulse className="h-4 w-32" />
            <SkeletonPulse className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <SkeletonPulse key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <SkeletonPulse key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  icon,
  bottomBarClass,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  bottomBarClass: string;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-zinc-200 p-5 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 h-0.5",
          bottomBarClass,
        )}
      />
      <div className="mb-3">{icon}</div>
      <div className="text-3xl font-bold text-zinc-900 tracking-tight">
        {value}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mt-1">
        {label}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ViewUser() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const authToken = session?.authToken || "";
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      //   const res = await axios.get<UserData>(`/api/users/${id}`, );
      const res = await getUserById(id, authToken);
      // console.log("Response from the server for user by id===========>", res);
      setUser(res);
    } catch {
      setError("Unable to load user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, id]);

  //
  const role = user ? getRoleMeta(user.role) : null;
  return (
    <>
      <button
        className="flex  flex-row bg-gray-200 p-1 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 rounded-2xl rounded-bl-none border border-gray-300"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBigLeft /> Back
      </button>
      {user && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold uppercase text-zinc-500 tracking-wide">
                Personal Info
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-400 text-xs">First Name</p>
                  <p className="font-medium">{user.firstName}</p>
                </div>

                <div>
                  <p className="text-zinc-400 text-xs">Last Name</p>
                  <p className="font-medium">{user.lastName}</p>
                </div>

                <div>
                  <p className="text-zinc-400 text-xs">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>

                <div>
                  <p className="text-zinc-400 text-xs">Phone</p>
                  <p className="font-medium">{user.phoneNo}</p>
                </div>

                <div>
                  <p className="text-zinc-400 text-xs">Gender</p>
                  <p className="font-medium">{user.gender}</p>
                </div>

                <div>
                  <p className="text-zinc-400 text-xs">Date of Birth</p>
                  <p className="font-medium">
                    {format(new Date(user.dob), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold uppercase text-zinc-500 tracking-wide">
                Professional Info
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-400 text-xs">Role</p>
                  <p className="font-medium">{user.role}</p>
                </div>

                <div>
                  <p className="text-zinc-400 text-xs">Profession</p>
                  <p className="font-medium">{user.profession}</p>
                </div>

                <div>
                  <p className="text-zinc-400 text-xs">Hobby</p>
                  <p className="font-medium">{user.hobby}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mt-6">
            <h2 className="text-sm font-bold uppercase text-zinc-500 tracking-wide mb-4">
              Address Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-zinc-400 text-xs">Address</p>
                <p className="font-medium">{user.address}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-xs">City</p>
                <p className="font-medium">{user.city}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-xs">State</p>
                <p className="font-medium">{user.state}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-xs">Country</p>
                <p className="font-medium">{user.country}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
