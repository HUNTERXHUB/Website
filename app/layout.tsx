import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar, { shortname } from "../component/navbar";
import Footer from "../component/footer";
import { ToastContainer, Slide } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import "./font.css";
import "./globals.css";
import * as Icons from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hunter X Hub",
  description: "",
  keywords: ["Hunter X Hub"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        1) Make the <body> a flex container, column direction.
        2) Use min-h-screen to span the full viewport height.
      */}
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          flex 
          flex-col 
          min-h-screen
        `}
        style={{ backgroundImage: "url(http://localhost:3000/image/bg.svg)" }}
      >
        {/* Toast notification container */}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="dark"
          transition={Slide}
        />

        <Navbar />

       

        {/*
          3) Wrap your main content in a <main> with flex-grow,
             so it expands to fill the remaining space.
        */}
        <main className="flex-grow">
          {children}
        </main>

        {/*
          4) The footer comes after <main>;
             it naturally sits at the bottom if the page is short.
        */}
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
