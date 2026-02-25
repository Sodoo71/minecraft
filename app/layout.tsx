import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Minecraft Admin Panel",
  description: "Manage your Minecraft server with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            <div className="flex min-h-screen items-center justify-center">
              <SignIn routing="hash" />
            </div>
          </SignedOut>

          <SignedIn>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <AppSidebar /> 
                <div className="flex-1 flex flex-col">
                  <header className="flex justify-between border-b px-4 py-2">
                    <div className="flex items-center gap-2">
                      <SidebarTrigger />
                      <a href="/" className="text-xl font-bold">Minecraft Admin</a>
                    </div>
                    <UserButton showName />
                  </header>
                  <main className="flex-1 p-6">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
