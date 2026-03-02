import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFooterPage } from '@/utils/api/footer';

export default async function LayoutLanding({ children }) {
  let footerData = null;

  try {
    // Membungkus fetch dalam try-catch untuk menangani kegagalan network/API
    footerData = await getFooterPage();
  } catch (error) {
    console.error("Gagal mengambil data footer:", error);
  }
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
