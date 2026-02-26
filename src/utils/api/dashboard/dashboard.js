import axiosInstance from "../../axios";

// Ambil semua SIJ
export async function getDashboardPage() {
    const res = await axiosInstance.get(`/dashboard`);
    return res.data;
}

