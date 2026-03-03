const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://skillbridge-server-xi.vercel.app";

export const adminService = {
  getAllUsers: async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
       
        credentials: "include", 
      });

      if (!res.ok) {
        return { data: null, error: { message: "Failed to fetch users" } };
      }

      const result = await res.json();
      return { data: result.data || result, error: null };
    } catch (error) {
      console.error("Fetch Users Error:", error);
      return { data: null, error: { message: "Something went wrong fetching users" } };
    }
  },
};