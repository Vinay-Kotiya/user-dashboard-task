import axios from "axios";

export const getAllUsers = async (token: string) => {
  // console.log("Token for fetching employees:", token);
  try {
    const response = await axios.get(`/api/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    // console.log("Fetched Employees:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error?.response?.data || error);
    throw new Error("Failed to fetch users");
  }
};
export const deleteUser = async (userId: string, token: string) => {
  // console.log("Token for Delete employees:", token);
  // console.log("Employee Id:", empId);
  try {
    const response = await axios.delete(
      `/api/users/${userId}`,
      // ← Empty body (or pass body if needed)
      {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      },
    );
    // console.log("Delete Employee:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error Deleting user:", error?.response?.data || error);
    throw new Error("Failed to delete user");
  }
};
export const getUserById = async (id: string, token: string) => {
  // console.log("Token for fetching employees:", token);
  try {
    const response = await axios.get(`/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    // console.log("Fetched Employees:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching user:", error?.response?.data || error);
    throw new Error("Failed to fetch user");
  }
};
