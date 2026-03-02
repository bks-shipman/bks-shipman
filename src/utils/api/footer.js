import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getFooterPage() {
    const res = await axiosInstance.get(`/footer-page`);
    return res.data;
}

