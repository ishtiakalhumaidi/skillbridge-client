import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const authApi = {
  login: async (data: any) => {
    // Better Auth default login route
    return api.post("/auth/sign-in/email", data);
  },
  register: async (data: any) => {
    // Better Auth default register route
    return api.post("/auth/sign-up/email", data);
  },
};

export const tutorSubjectsApi = {
  add: async (categoryId: string) => {
    // Expects categoryId in req.body
    const response = await api.post("/tutor-subjects", { categoryId });
    return response.data;
  },
  remove: async (categoryId: string) => {
   
    const response = await api.delete("/tutor-subjects", { 
      params: { categoryId } 
    });
    return response.data;
  }
};

export const tutorsApi = {
  create: async (data: { headline: string; bio: string; hourlyRate: number }) => {
    const response = await api.post("/tutors", data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/tutors");
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
    const response = await api.put("/tutors/profile", data);
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
  getMyBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/bookings/${id}`, { status });
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
    const response = await api.patch(`/admin/users/${id}`, { status });
    return response.data;
  },
  getAllBookings: async () => {
   
    const response = await api.get("/admin/bookings");
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
