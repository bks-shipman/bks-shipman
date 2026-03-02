import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getFooterPage() {
    try {
        const res = await axiosInstance.get(`/footer-page`);
        console.log("FOOTER DATA:", res.data);
        return res.data;
    } catch (err) {
        console.log("ERROR FOOTER:", err.response?.data);
        return null;
    }
}

