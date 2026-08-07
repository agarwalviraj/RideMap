import { PropsWithChildren } from "react";
import "./globals.css";

export const metadata = {
  title: "Ride Destinations from Bengaluru",
  description:
    "Browse bike ride destinations from Bengaluru with server-rendered React.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
