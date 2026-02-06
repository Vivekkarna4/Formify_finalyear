import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./_components/ThemeProvider";
import { Navbar } from "./_components/Navbar";
import { icons } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Formify AI",
  description: "AI Powered Form Generator",
  icons: {
    icon: "/logo-icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light" className={inter.className}>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster
              richColors
              position="bottom-right"
              closeButton
              toastOptions={{
                style: {
                  fontSize: "0.875rem",
                  maxWidth: "420px",
                  padding: "0.75rem 1rem",
                },
              }}
            />
            <Navbar />
            <main className="pt-16">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
