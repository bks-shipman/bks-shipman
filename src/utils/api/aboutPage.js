import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getAboutPage() {
    try {
        const res = await axiosInstance.get(`/about-page`);
        console.log("ABOUT DATA:", res.data);
        return res.data;
    } catch (err) {
        console.log("ERROR ABOUT:", err.response?.data);
        return null;
    }
}

