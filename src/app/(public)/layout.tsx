import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { userService } from "@/service/user.service";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await userService.getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}