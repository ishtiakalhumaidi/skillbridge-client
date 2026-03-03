import { env } from "@/env"; // Using your T3 env validator
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://skillbridge-server-xi.vercel.app";

export const tutorService = {
  createProfile: async (data: { bio: string; hourlyRate: number }) => {
    try {
      const res = await fetch(`${API_URL}/tutors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          data: null,
          error: { message: errorData.message || "Failed to create profile" },
        };
      }

      const result = await res.json();
      return { data: result, error: null };
    } catch (error) {
      console.error("Tutor Profile Error:", error);
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
  getAllTutors: async () => {
    try {
     
      const res = await fetch(`${API_URL}tutors`, {
        cache: "no-store", 
      });

      if (!res.ok) {
        return { data: null, error: { message: "Failed to fetch tutors" } };
      }

     
      const result = await res.json();
      return { data: result.data || result, error: null };
    } catch (error) {
      console.error("Fetch Tutors Error:", error);
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};
