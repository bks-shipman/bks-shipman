import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFooterPage } from '@/utils/api/footer';

export const metadata = {
  title: "BKS SHIPMAN",
  description: "TOTAL SHIP MANAGEMENT SOLUTIONS",
};

export default async function LayoutLanding({ children }) {
  const footerData = await getFooterPage()
  console.log(footerData, "footer");

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
