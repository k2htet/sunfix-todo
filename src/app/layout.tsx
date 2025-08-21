import { Provider } from "@/providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunfix's Todo",
  description: "Write down your task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased bg-gray-50`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
