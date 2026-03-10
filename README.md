# SkillBridge - Frontend Client

SkillBridge is a modern, full-stack platform designed to connect students with expert tutors. This repository contains the frontend client built with Next.js 16, featuring a responsive UI, role-based dashboards, and a seamless booking experience.

---

## 🚀 Features

- **Role-Based Access Control (RBAC):** Dedicated flows and dashboards for Students, Tutors, and Admins protected by Next.js Proxy middleware.
- **Student Portal:** Browse tutors, filter by subject categories, book sessions, manage profile settings, and leave post-session reviews.
- **Tutor Portal:** Dedicated onboarding flow, manage teaching subjects, set hourly rates, and update session statuses (Confirmed, Completed, Cancelled).
- **Admin Dashboard:** Oversee the entire platform, manage global subject categories (CRUD), and view all users and bookings.
- **Robust Authentication:** Secure cross-origin authentication powered by Better Auth.
- **Modern Forms:** Fully type-safe and validated forms using TanStack Form and Zod Standard Schema.
- **Dark/Light Mode:** Built-in theme toggling for user preference.

---

## 💻 Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [Shadcn UI](https://ui.shadcn.com/) (Radix UI) |
| Icons | [Lucide React](https://lucide.dev/) |
| Form State & Validation | [TanStack Form](https://tanstack.com/form/latest) & [Zod](https://zod.dev/) |
| Authentication | [Better Auth](https://better-auth.com/) (Client-side integration) |

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- npm (comes with Node.js)
- The **SkillBridge Backend** server running locally or deployed.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following variables. Replace the URLs with your local or production backend endpoints:

```env
# The base URL of your backend server
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# The API version path for fetching data
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

> **Note:** If deploying to Vercel, ensure these are added to your Vercel Project Environment Variables.

---

## 🚀 Getting Started

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/skillbridge-client.git
cd skillbridge-client
```

**2. Install dependencies:**

```bash
npm install
```

**3. Run the development server:**

```bash
npm run dev
```

**4. Open the app:**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```
src/
├── app/                        # Next.js App Router pages and layouts
│   ├── admin/                  # Admin dashboard pages (Categories, Bookings, Users)
│   ├── dashboard/              # Student dashboard pages (My Bookings, Profile)
│   ├── tutor/                  # Tutor dashboard pages (Availability, Profile, Sessions)
│   └── tutors/                 # Public tutor browsing and individual profile pages
├── components/                 # Reusable UI components
│   ├── ui/                     # Shadcn UI components
│   └── shared/                 # Global components like Navbar and ThemeToggle
├── lib/                        # Utilities, API interceptors, and Auth client configurations
└── proxy.ts                    # Edge middleware for secure role-based routing
```

---

## 📜 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the development server using Turbopack |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code quality issues |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request