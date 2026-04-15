"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowBigLeft, Router } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getUserById } from "@/lib/api";
import { useEffect } from "react";
import { format } from "date-fns";
export function UpdateUserForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const { data: session } = useSession();
  const authToken = session?.authToken || "";
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const updateUserSchema = z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username cannot exceed 20 characters."),
    firstName: z.string().min(2, "First name is required.").max(50),
    lastName: z.string().min(2, "Last name is required.").max(50),
    email: z.string().email("Invalid email address."),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Please select a valid gender.",
    }),
    dob: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format.",
    }),
    role: z.enum(["ADMIN", "USER"], {
      message: "Please select a valid role.",
    }),
    phoneNo: z
      .string()
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number is too long."),
    country: z.string().min(1, "Country is required."),
    state: z.string().min(1, "State is required."),
    city: z.string().min(1, "City is required."),
    address: z.string().min(5, "Full address is required."),
    hobby: z.string().optional(),
    profession: z.string().min(2, "Profession is required."),
  });

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",

      gender: undefined, // Or a default like "male"
      dob: "",
      role: undefined,
      phoneNo: "",
      country: "",
      state: "",
      city: "",
      address: "",
      hobby: "",
      profession: "",
    },
  });
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        if (!id) return;
        // const res = await axios.get(`/api/users/${id}`, authToken);
        const res = await getUserById(id, authToken);
        // console.log("User by id ==========>", res);
        form.setValue("email", res.email);
        form.setValue("username", res.username);
        form.setValue("role", res.role);
        form.setValue("firstName", res.firstName);
        form.setValue("lastName", res.lastName);
        form.setValue("gender", res.gender);
        form.setValue("hobby", res.hobby);
        form.setValue(
          "dob",
          res.dob ? format(new Date(res.dob), "yyyy-MM-dd") : "",
        );
        form.setValue("profession", res.profession);
        form.setValue("phoneNo", res.phoneNo);
        form.setValue("country", res.country);
        form.setValue("state", res.state);
        form.setValue("city", res.city);
        form.setValue("address", res.address);

        // form.setValue("password", res.data.password);
      } catch (error: any) {
        console.error("Error while fetching user by id", error);
        toast.error(error);
      }
    };
    if (id) fetchUserById();
  }, [id, authToken]);

  async function onSubmit(data: z.infer<typeof updateUserSchema>) {
    try {
      console.log("Data:", data);
      const payload = {
        ...data,
        dob: new Date(data.dob),
      };
      console.log("Add user data ====>", payload);
      const res = await axios.put(`/api/users/${id}`, payload, {
        headers: {
          Authorization: authToken,
        },
      });
      //   if (res.status == 400) {
      //     throw new Error("Error");
      //   }
      //   if (res.status == 500) {
      //     toast.error(res.data);
      //   }
      //   console.log("Response from server:", res);
      if (res.status == 200) {
        form.reset();
        router.back();
        toast.success("User updated successfully!");
      }
    } catch (error: any) {
      console.error("Error while updating ", error);
      toast.error(error);
    }
  }
  const roles = ["USER", "ADMIN"] as const;
  const genders = ["MALE", "FEMALE", "OTHER"] as const;
  return (
    <Card>
      {/* <Button className="w-20 mx-3" onClick={()=>{}}>
        <ArrowBigLeft />
        Back
      </Button> */}
      <CardHeader>
        <CardTitle className="text-2xl">Update User</CardTitle>
        <CardDescription>
          Update information below to update user account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Username <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Username"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    First Name
                    <span className="text-red-500">*</span>{" "}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter First Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Last Name
                    <span className="text-red-500">*</span>{" "}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Last Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Email <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Gender <span className="text-red-500">*</span>{" "}
                  </FieldLabel>

                  <Combobox
                    items={genders}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  >
                    <ComboboxInput
                      value={field.value || ""} // ✅ THIS IS THE FIX
                      onChange={(e) => field.onChange(e.target.value)} // optional
                      className={"border border-gray-500 "}
                      placeholder="Select a Gender"
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem
                            key={item}
                            value={item}
                            onSelect={() => field.onChange(item)}
                          >
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Role <span className="text-red-500">*</span>{" "}
                  </FieldLabel>

                  <Combobox
                    items={roles}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  >
                    <ComboboxInput
                      value={field.value || ""} // ✅ THIS IS THE FIX
                      onChange={(e) => field.onChange(e.target.value)} // optional
                      className={"border border-gray-500 "}
                      placeholder="Select a Role"
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem
                            key={item}
                            value={item}
                            onSelect={() => field.onChange(item)}
                          >
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="dob"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Date of birth
                    <span className="text-red-500">*</span>{" "}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter DOB"
                    autoComplete="off"
                    type="date"
                    value={field.value || ""} // ✅ THIS IS THE FIX
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phoneNo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Phone Number
                    <span className="text-red-500">*</span>{" "}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Phone No"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Country <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Country"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    State <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter State"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    City <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter City"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Address <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Address"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="hobby"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Hobby</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Hobby"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="profession"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Profession
                    <span className="text-red-500">*</span>{" "}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Profession"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex justify-between">
          <Button type="submit" form="form-rhf-demo">
            Update
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
