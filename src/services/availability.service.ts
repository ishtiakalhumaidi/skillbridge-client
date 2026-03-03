const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://skillbridge-server-xi.vercel.app";

export const availabilityService = {
  createSlot: async (data: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }) => {
    try {
      const res = await fetch(`${API_URL}/availability`, {
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
          error: { message: errorData.message || "Failed to add availability" },
        };
      }

      const result = await res.json();
      return { data: result, error: null };
    } catch (error) {
      console.error("Availability Error:", error);
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
  getTutorAvailability: async (tutorId: string) => {
    try {
      const res = await fetch(`${API_URL}/availability/tutor/${tutorId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch availability" },
        };
      }

      const result = await res.json();
      return { data: result.data || result, error: null };
    } catch (error) {
      console.error("Fetch Availability Error:", error);
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};
