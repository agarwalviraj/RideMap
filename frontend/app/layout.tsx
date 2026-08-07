import { PropsWithChildren } from "react";
import "./globals.css";
import Toolbar from "../components/Toolbar";
import SuggestionSheet from "../components/SuggestionSheet";

export const metadata = {
  title: "Ride Destinations from Bengaluru",
  description:
    "Browse bike ride destinations from Bengaluru with server-rendered React.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-slate-50">
          <div className="flex min-h-screen flex-col md:flex-row">
            <Toolbar />
            {children}
            <SuggestionSheet />
          </div>
        </main>
      </body>
    </html>
  );
}
