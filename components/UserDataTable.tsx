"use client";

import { useState, useEffect, use } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";
// import { Employee } from "@/types/Employee";
// import { deleteEmployee, getAllEmployees } from "@/lib/api/employee";
import { useSession } from "next-auth/react";
// import { useAuth } from "@/context/AuthContext";

// import { ROUTES } from "@/app/constant/routes";
import Link from "next/link";
import { toast } from "sonner";
import { User } from "@prisma/client";
import { deleteUser, getAllUsers } from "@/lib/api";
// import { deleteUser, getAllUsers } from "@/lib/api";

export function UserDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();
  const [userData, setUserData] = useState<User[]>([]);
  const { data: session } = useSession();
  //   const authContext = useAuth();
  // const authToken = authContext?.authToken;
  const authToken = session?.authToken || "";
  //   console.log("session data=====>", session);
  // console.log("authToken from context api stored in localstorage:", authToken);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(authToken);

        if (response) {
          const users: User[] = await response;
          //   console.log("user data:", users);
          setUserData(users);
        } else {
          console.error("Failed to fetch users:", response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [authToken, session]);
  const IntentDelete = (userId: string) => {
    const afterUserDeleteData = userData.filter((user) => user.id !== userId);
    // console.log(afterUserDeleteData);
    setUserData(afterUserDeleteData);
  };

  const deleteUserById = async (id: string) => {
    // const response = await deleteEmployee(id, "EMP0000864");
    // console.log("id:", id);
    IntentDelete(id);
    try {
      // const response = await getAllEmployees(
      //   authToken ? authToken : session?.authToken ? session?.authToken : ""
      // );
      const response = await deleteUser(id, authToken);

      if (response) {
        // const employees: User[] = await response.data;
        toast.success("User Deleted Successfully.");
        // setUserData
        // (Users);
      } else {
        console.error("Failed to Delete User:", response.statusText);
      }
    } catch (error) {
      console.error("Error Deleting User:", error);
    }
  };
  ///////////////////////////////Columns Definition//////////////////////
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      //   cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
      // cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },

    {
      accessorKey: "username",
      header: "User Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("username")}</div>
      ),
    },
    // {
    //   accessorKey: "middleName",
    //   header: "Middle Name",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("middleName")}</div>
    //   ),
    // },
    // {
    //   accessorKey: "lastName",
    //   header: "Last Name",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("lastName")}</div>
    //   ),
    // },

    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    // {
    //   accessorKey: "mobile",
    //   header: "Mobile No.",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("mobile")}</div>
    //   ),
    // },
    {
      accessorKey: "role",
      //   header: "Role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },

    // {
    //   accessorKey: "bankName",
    //   header: "Bank Name",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("bankName")}</div>
    //   ),
    // },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Join Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleDateString("IN")}</div>;
      },
    },

    // {
    //   accessorKey: "baseSalary",
    //   header: "Base Salary",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("baseSalary")}</div>
    //   ),
    // },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.empId)}
            >
              Copy user ID
            </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {/* <Link href={`${ROUTES.viewEmp}/${user.empId}`}> */}

                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={() => {
                    router.push(`/dashboard/users/${user.id}`);
                  }}
                >
                  View user
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {/* <Link href={`${ROUTES.updateEmp}/${user.empId}`}> */}

                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={() => {
                    router.push(`/dashboard/users/update-user?id=${user.id}`);
                  }}
                >
                  Update user
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant={"destructive"}
                  className="w-full"
                  onClick={() => {
                    deleteUserById(user.id);
                  }}
                >
                  Delete User
                </Button>
                {/* <AlertDialogTrigger>Delete employee</AlertDialogTrigger> */}
                {/* <AlertDialog>
                <AlertDialogTrigger>Delete employee</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      employee
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: userData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // const handleViewClientDetails = (id: string) => {
  //   // console.log("client id :", id);
  //   router.push(`/dashboard/clients/clients-detail/${id}`);
  // };
  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter Name..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white"
        />
        <DropdownMenu>
          <Button
            onClick={() => {
              router.push("users/add-user");
            }}
          >
            Add User
          </Button>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="">
          <TableHeader className="bg-blue-200 rounded-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  // onClick={() => {
                  //   const id = row.original.empId;
                  //   // console.log(id);

                  //   handleViewClientDetails(id);
                  // }}
                  className=" hover:bg-gray-200 bg-blue-100"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4 cursor-pointer">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
