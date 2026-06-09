import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trade Journal — Premium Forex Journal",
  description: "A premium forex trade journal built for disciplined traders.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
