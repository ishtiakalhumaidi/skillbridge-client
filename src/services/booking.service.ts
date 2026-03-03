const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://skillbridge-server-xi.vercel.app";

export const bookingService = {
  createBooking: async (data: { tutorId: string; availabilityId: string }) => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { data: null, error: { message: errorData.message || "Failed to book session" } };
      }

      const result = await res.json();
      return { data: result, error: null };
    } catch (error) {
      console.error("Booking Error:", error);
      return { data: null, error: { message: "Something went wrong during booking" } };
    }
  },
};