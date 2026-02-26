import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFooterPage } from '@/utils/api/footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BKS SHIPMAN",
  description: "TOTAL SHIP MANAGEMENT SOLUTIONS",
};

export default async function RootLayout({ children }) {
  const footerData = await getFooterPage()
  console.log(footerData, "footer");

  return (
    <main>
      <Navbar />
      <div className="min-h-screen w-full">
        {children}
      </div>
      <Footer data={footerData.company} />
    </main>
  );
}
