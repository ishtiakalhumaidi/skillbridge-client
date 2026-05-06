/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export const auth_api = axios.create({
  baseURL: "localhost:5000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const authApi = {
  // login: async (data: any) => {
  //   return auth_api.post("/sign-in/email", data);
  // },
  // register: async (data: any) => {
  //   // Better Auth default register route
  //   return auth_api.post("/sign-up/email", data);
  // },
  session: async () => {
    return auth_api.get("/get-session");
  },
  logout: async () => {
    return auth_api.post("/sign-out");
  },
};

const buildQuery = (params?: Record<string, any>) => {
  if (!params) return "";
  const query = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  return query ? `?${query}` : "";
};

export const paymentsApi = {
  createCheckout: async (bookingId: string) => {
    const response = await api.post("/payments/create-checkout", { bookingId });
    return response.data;
  },
};
export const tutorSubjectsApi = {
  add: async (categoryId: string) => {
    const response = await api.post("/tutor-subjects", { categoryId });
    return response.data;
  },
  remove: async (categoryId: string) => {
    const response = await api.delete(`/tutor-subjects/${categoryId}`);
    return response.data;
  },
};

export const tutorsApi = {
  create: async (data: {
    headline: string;
    bio: string;
    hourlyRate: number;
  }) => {
    const response = await api.post("/tutors", data);
    return response.data;
  },
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get(`/tutors${buildQuery(params)}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  updateProfile: async (data: {
    headline?: string;
    bio?: string;
    hourlyRate?: number;
  }) => {
    const response = await api.patch("/tutors/profile", data);
    return response.data;
  },
};
export const bookingsApi = {
  create: async (data: {
    categoryId: string;
    availabilityId: string;
    date: string;
  }) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },
  getMyBookings: async (params?: Record<string, any>) => {
    const response = await api.get(
      `/bookings/my-bookings${buildQuery(params)}`,
    );
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/bookings/${id}/status  `, { status });
    return response.data;
  },

  updateMeetingLink: async (id: string, meetingLink: string) => {
    const response = await api.patch(`/bookings/${id}/meeting-link`, {
      meetingLink,
    });
    return response.data;
  },
};

export const availabilityApi = {
  getMyAvailability: async () => {
    const response = await api.get("/availability/my-availability");
    return response.data;
  },
  create: async (data: { day: string; startTime: string; endTime: string }) => {
    const response = await api.post("/availability", data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/availability/${id}`);
    return response.data;
  },
};

export const adminApi = {
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },
  updateUserStatus: async (id: string, status: string | boolean) => {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },
  getAllBookings: async (params?: Record<string, any>) => {
    const response = await api.get(`/admin/bookings${buildQuery(params)}`);
    return response.data;
  },
};

export const categoriesApi = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  create: async (data: { name: string }) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
  update: async (id: string, data: { name: string }) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const reviewsApi = {
  create: async (data: {
    bookingId: string;
    rating: number;
    comment?: string;
  }) => {
    const response = await api.post("/reviews", data);
    return response.data;
  },
};
