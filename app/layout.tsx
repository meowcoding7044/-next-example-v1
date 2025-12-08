
import "../styles/globals.css";
import React from "react";
import { ReactQueryProvider } from "@/providers/ReactProviders";
import NavBar from "@/features/nav-bar/nav.bar";
import { Toaster } from "react-hot-toast";


export const metadata = { title: "Demo App v2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <NavBar />
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
