
import "../styles/globals.css";
import React from "react";
import { ReactQueryProvider } from "@/providers/ReactProviders";
import NavBar from "@/features/navmenu/components/NavBar";
import { Toaster } from "react-hot-toast";


export const metadata = { title: "Demo App v2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <a className="sr-only focus:not-sr-only p-2" href="#content">Skip to content</a>
        <NavBar />
        <ReactQueryProvider>
          <main id="content">{children}</main>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
