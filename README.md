<div align="center">

# 🎓 SkillBridge — Frontend

**A modern tutor-student marketplace with role-based dashboards, real-time booking, and Stripe payments**

[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.6-000000)](https://www.better-auth.com/)
[![TanStack Form](https://img.shields.io/badge/TanStack_Form-1.28-FF4154?logo=react)](https://tanstack.com/form/latest)

</div>

---

## 📋 Overview

SkillBridge is a full-stack tutoring marketplace that connects students with expert tutors. The frontend is a **Next.js 16** application built with **TypeScript** and the **App Router**, featuring an Edge middleware proxy for session-based role routing, a dual-font design system, domain-driven API services, and a complete booking lifecycle from discovery to post-session review.

> 🔗 **Live:** [SkillBridge](https://skillbridge-iah.vercel.app)  
> 🔗 **Backend Repo:** [skillbridge-server](https://github.com/ishtiakalhumaidi/skillbridge-server.git)  
> 🔗 **Backend API:** [https://skillbridge-server-xi.vercel.app](https://skillbridge-server-xi.vercel.app/)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🔐 Edge Middleware with Session Proxy** | Next.js Edge middleware fetches the live session from the backend on every protected route request, validates the user role, and enforces redirects with `?redirect` query param preservation |
| **🛡️ Strict Regex Route Guarding** | Uses precise regex patterns (`^\/tutors\/[^/]+\/book$`) to block role-inappropriate access to sensitive flows like tutor booking — Admins and Tutors are redirected to their respective dashboards |
| **📐 Three-Route-Group Layout Architecture** | `(auth)` for login/register, `(public)` for marketing + tutor browsing, `(dashboards)` for unified role-based dashboards — each with distinct layouts and no URL pollution |
| **🎨 Dual-Font Design System** | `Archivo Black` for display headings and `Space Grotesk` for body text, loaded via `next/font/google` with CSS variable tokens and `display: swap` for zero layout shift |
| **📊 Domain-Driven API Service Layer** | Typed service objects for 7 business domains: `tutorsApi`, `bookingsApi`, `availabilityApi`, `categoriesApi`, `reviewsApi`, `paymentsApi`, `adminApi` — each with full CRUD + query builders |
| **📅 Tutor Availability Management** | Tutors define recurring time slots by day-of-week, which students browse when booking sessions |
| **💳 Stripe Payment Integration** | Checkout session creation tied to booking IDs for secure, server-verified payments |
| **🔄 Booking Lifecycle Engine** | Full state machine: `PENDING` → `CONFIRMED` → `COMPLETED` with meeting link injection and post-session review submission |
| **⭐ Post-Session Review System** | Students submit star ratings and comments after completed sessions, driving tutor credibility |
| **📝 Tutor Onboarding Flow** | Dedicated `/onboarding/tutor` route for new tutors to create profiles, set hourly rates, and select subject categories before accessing the tutor dashboard |
| **🎭 Admin Control Panel** | User status/role management, global category CRUD, and platform-wide booking oversight |
| **🌗 next-themes Dark Mode** | System-preference-aware theme switching with Tailwind CSS dark variant support |
| **🍞 Sonner Toast Notifications** | Premium minimalist toast styling for async operation feedback across all user flows |
| **✅ TanStack Form + Zod Validation** | Headless, type-safe form state management with Zod schema validation and real-time error handling |
| **📅 react-day-picker Calendar** | Native date selection for booking flows with custom styling |

---

## 🛠️ Tech Stack

**Framework**
- [Next.js 16](https://nextjs.org/) — App Router, React Server Components
- [React 19](https://react.dev/) — Concurrent features
- [TypeScript 5](https://www.typescriptlang.org/) — End-to-end type safety

**Styling & UI**
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS
- [Shadcn UI](https://ui.shadcn.com/) — Headless component primitives
- [Lucide React](https://lucide.dev/) — Icon system

**Authentication**
- [Better Auth](https://www.better-auth.com/) — Session-based auth with Google OAuth

**Forms & Validation**
- [TanStack React Form](https://tanstack.com/form/latest) — Headless form state management
- [Zod](https://zod.dev/) — Runtime schema validation
- [@tanstack/zod-form-adapter](https://tanstack.com/form/latest/docs/framework/react/guides/validation) — Bridge between TanStack Form and Zod

**Date & Time**
- [date-fns](https://date-fns.org/) — Date formatting and manipulation
- [react-day-picker](https://react-day-picker.js.org/) — Calendar component

**Notifications**
- [Sonner](https://sonner.emilkowal.ski/) — Toast notification system

**Theme**
- [next-themes](https://github.com/pacocoursey/next-themes) — Dark mode management

**HTTP**
- [Axios](https://axios-http.com/) — HTTP client with credential forwarding

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18`
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ishtiakalhumaidi/skillbridge-client.git
cd skillbridge-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
# Backend API base URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Backend API version path
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Application URL (for auth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local` to version control.**

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
skillbridge-client/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Route Group: Auth pages
│   │   │   ├── layout.tsx             # Clean centered auth layout
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboards)/              # Route Group: Unified dashboards
│   │   │   ├── layout.tsx             # Server-side session validation + sidebar
│   │   │   ├── admin/                 # Admin control panel
│   │   │   │   ├── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   ├── bookings/
│   │   │   │   └── users/
│   │   │   ├── student/               # Student dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   └── bookings/
│   │   │   └── tutor/                 # Tutor dashboard
│   │   │       ├── page.tsx
│   │   │       ├── dashboard/
│   │   │       ├── sessions/
│   │   │       └── availability/
│   │   ├── (public)/                  # Route Group: Marketing + browsing
│   │   │   ├── layout.tsx             # Public navbar + footer
│   │   │   ├── page.tsx               # Landing page
│   │   │   └── tutors/
│   │   │       ├── page.tsx           # Tutor directory
│   │   │       └── [id]/page.tsx      # Tutor profile + book
│   │   ├── onboarding/                # Role-specific onboarding
│   │   │   └── tutor/
│   │   ├── layout.tsx                 # Root layout (fonts, providers)
│   │   ├── not-found.tsx              # Custom 404
│   │   └── globals.css                # Tailwind directives + CSS variables
│   ├── actions/                       # Server Actions (booking, user)
│   ├── components/
│   │   ├── home/                      # Landing page sections
│   │   ├── shared/                    # Navbar, DashboardSidebar, ThemeToggle
│   │   ├── theme-provider.tsx         # next-themes wrapper
│   │   └── ui/                        # Shadcn UI primitives
│   ├── lib/
│   │   ├── api.ts                     # Axios instance + 7 domain API services
│   │   ├── auth-client.ts             # Better Auth client config
│   │   └── utils.ts                   # cn() Tailwind merge utility
│   ├── proxy.ts                       # Edge middleware (session + role routing)
│   └── service/
│       └── user.service.ts            # Server-side session fetcher
├── public/                            # Static assets
├── components.json                    # Shadcn UI config
├── next.config.ts
├── package.json
└── README.md
```

---

## 🔑 Key Architectural Decisions

### 1. Edge Middleware with Backend Session Proxy
The `proxy.ts` middleware runs on Vercel Edge Runtime and validates auth by calling the backend's `/api/auth/get-session` endpoint directly:

```typescript
const res = await fetch(
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`,
  { headers: { Cookie: cookieHeader }, cache: "no-store" }
);
```

This design:
- **Eliminates JWT secret sharing** between frontend and backend — the frontend never verifies tokens, only proxies them
- **Enables instant session revocation** — logout on the backend immediately invalidates the middleware check
- **Preserves redirect targets** — stores the original `pathname` in `?redirect` so users land back where they were after login

### 2. Strict Regex Role Enforcement
The middleware uses precise regex matching for route-level role blocking:

```typescript
if (pathname.match(/^\/tutors\/[^/]+\/book$/)) {
  if (role === "ADMIN") return redirect("/admin");
  if (role === "TUTOR") return redirect("/tutor/dashboard");
}
```

This prevents Admins and Tutors from accidentally (or maliciously) accessing the student booking flow while allowing Students and unauthenticated users to browse tutor profiles.

### 3. Server-Side Session in Dashboard Layout
The `(dashboards)/layout.tsx` fetches the session server-side using Next.js `cookies()`:

```typescript
async function getSession() {
  const cookieStore = await cookies();
  const res = await fetch(`${BACKEND}/api/auth/get-session`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });
  return res.json();
}
```

This provides:
- **Zero client-side hydration mismatch** — the session is available during SSR
- **Immediate redirect on auth failure** — `redirect("/login")` before any UI renders
- **Role-aware sidebar** — `DashboardSidebar` receives the role prop for conditional navigation

### 4. Domain-Driven API Services
All backend interactions are abstracted into typed service objects in `lib/api.ts`:

```typescript
export const bookingsApi = {
  create: async (data: { categoryId, availabilityId, date }) =>
    api.post("/bookings", data),
  getMyBookings: async (params) =>
    api.get(`/bookings/my-bookings${buildQuery(params)}`),
  updateStatus: async (id, status) =>
    api.patch(`/bookings/${id}/status`, { status }),
  updateMeetingLink: async (id, meetingLink) =>
    api.patch(`/bookings/${id}/meeting-link`, { meetingLink }),
};
```

The `buildQuery()` utility converts objects to `URLSearchParams`, enabling type-safe filter/pagination across all list endpoints.

### 5. Dual-Font Typography System
The root layout loads two Google Fonts with CSS variables:

```typescript
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

This creates a visual hierarchy where display headings use a bold, impactful typeface while body text remains highly readable — critical for a marketplace where trust and clarity drive conversions.

### 6. TanStack Form + Zod for Type-Safe Validation
Forms use TanStack Form's headless approach with Zod adapters:

```typescript
const form = useForm({
  defaultValues: { headline: "", bio: "", hourlyRate: 0 },
  validators: { onChange: tutorProfileSchema },
});
```

This provides:
- **Real-time validation** without re-rendering the entire form on every keystroke
- **Type inference** from Zod schemas to form values
- **Field-level error tracking** with granular UI feedback

---

## 🗺️ Roadmap

- [ ] **Real-Time Notifications** — Integrate Socket.io or Server-Sent Events for instant booking status updates
- [ ] **Video Integration** — Embed Zoom/Meet SDK for in-app video sessions instead of external meeting links
- [ ] **Tutor Search & Filters** — Full-text search with subject, price range, and rating filters on the tutor directory
- [ ] **Calendar Sync** — Google Calendar / Outlook integration for tutor availability
- [ ] **Messaging System** — Pre-booking chat between students and tutors
- [ ] **PWA Support** — Service worker for offline browsing and push notifications
- [ ] **E2E Testing** — Playwright tests covering the full booking flow (search → book → pay → review)
- [ ] **i18n** — Multi-language support for international tutor-student matching
- [ ] **Analytics Dashboard** — Tutor earnings analytics, student progress tracking
- [ ] **Referral System** — Invite codes with discount incentives

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**🎓 Bridge the gap between learning and mastery**

Crafted by [Ishtiak Al Humaidi](https://github.com/ishtiakalhumaidi)

</div>
