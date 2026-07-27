import "./globals.css";

export const metadata = {
  title: "Ride Destinations from Bengaluru",
  description:
    "Browse bike ride destinations from Bengaluru with server-rendered React.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
