import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar'
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import CartDrawer from '../components/CartDrawer'
import { Toaster } from 'react-hot-toast'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkinGlow",
  description: "Clean, gentle skincare for radiant skin",
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
        <UserProvider>
          <AuthProvider>
            <CartProvider>
            <Toaster position="top-center" />
            <Navbar />
            {children}
            <CartDrawer/>
            </CartProvider>
          </AuthProvider>
         
        </UserProvider>
      </body>
    </html>
  );
}
