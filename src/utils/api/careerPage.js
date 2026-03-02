import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getCareerPage() {
    const res = await axiosInstance.get(`/career-page`);
    return res.data;
}

