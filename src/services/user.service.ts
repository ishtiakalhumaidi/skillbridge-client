import { cookies } from "next/headers";

// Make sure this matches your backend URL
const AUTH_URL = process.env.NEXT_PUBLIC_API_URL || "https://skillbridge-server-xi.vercel.app";

export const userService = {
  getSession: async function () {
    try {
      const cookiesStore = await cookies();
      
  
      const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
        headers: {
          Cookie: cookiesStore.toString(),
        },
        cache: "no-store",
      });
      
      if (!res.ok) {
        return { data: null, error: { message: "Session fetch failed" } };
      }

      const session = await res.json();
      
      if (!session) {
        return { data: null, error: { message: "Session is missing" } };
      }

      return { data: session, error: null };
    } catch (error) {
      console.error("Session fetch error:", error);
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};