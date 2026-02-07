import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactFlowProvider } from "@xyflow/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diagram Editor",
  description: "Professional diagram editor",
  icons: {
    icon: [
      { url: "/devince_log.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: [
      { url: "/devince_log.svg", type: "image/svg+xml", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ReactFlowProvider>
              {children}
            </ReactFlowProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
