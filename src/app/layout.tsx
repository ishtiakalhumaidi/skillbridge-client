import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

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

export const metadata: Metadata = {
  title: "SkillBridge | Premium Learning",
  description: "Master your craft with world-class mentors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivoBlack.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}

          {/* 👉 FIX: Premium Minimalist Toaster Styling */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "bg-background border border-foreground/10 rounded-2xl shadow-xl font-sans text-foreground p-4 text-sm font-semibold",
                actionButton: "bg-primary rounded-xl text-primary-foreground font-bold hover:bg-primary/90 transition-colors px-4 py-2",
                cancelButton: "bg-foreground/5 rounded-xl text-foreground font-bold hover:bg-foreground/10 transition-colors px-4 py-2",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}