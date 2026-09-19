import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({ 
  weight: "400",
  variable: "--font-display", 
  subsets: ["latin"] 
});

const inter = Inter({ 
  weight: ["400", "500"],
  variable: "--font-body", 
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "Velorah® — Where dreams rise through the silence.",
  description: "Digital spaces for sharp focus and inspired work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${instrumentSerif.variable} ${inter.variable} font-body antialiased min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
