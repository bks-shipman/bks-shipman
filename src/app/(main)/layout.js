import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFooterPage } from '@/utils/api/footer';

export default async function LayoutLanding({ children }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/footer-page`,
    { cache: "no-store" }
  );

  const footerData = await res.json();
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full">
        {children}
      </div>
      <Footer data={footerData.company} />
    </>
  );
}
