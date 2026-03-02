import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getAboutPage() {
    const res = await axiosInstance.get(`/about-page`);
    return res.data;
}

