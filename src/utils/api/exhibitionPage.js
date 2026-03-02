import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getExhibitionPage() {
    const res = await axiosInstance.get(`/exhibition-page`);
    return res.data;
}

