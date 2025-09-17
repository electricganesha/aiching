import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { auth } from "@/lib/auth";
import { Footer } from "@/components/Footer/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I-Chingify",
  description:
    "A modern way to connect with the ancient wisdom of the I-Ching.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <AuthProvider session={session}>
          <Navbar />
          <div className="content">{children}</div>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
