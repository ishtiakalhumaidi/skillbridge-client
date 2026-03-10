import { cookies } from "next/headers";

export const userService = {
  getSession: async function () {
    try {
      const cookiesStore = await cookies();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`,
        {
          headers: {
            Cookie: cookiesStore.toString(),
          },
          cache: "no-store",
        },
      );
      const session = await res.json();
      if (session === null) {
        return {
          data: null,
          error: {
            message: "Session is missing",
          },
        };
      }

      return { data: session, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
  signOut: async function () {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-out`, {
        method: "POST",
      });

      return { message: "Signed out successfully" };
    } catch (error) {
      console.error(error);
      return { error: { message: "Something Went Wrong" } };
    }
  },
};
