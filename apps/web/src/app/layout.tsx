import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quiz2Biz - Business Planning Platform",
  description: "Transform your business ideas into actionable plans with our adaptive questionnaire platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

