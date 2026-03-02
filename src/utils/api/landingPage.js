import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getLandingPage() {
    const res = await axiosInstance.get(`/landing-page`);
    return res.data;
}

