import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getVesselPage() {
    const res = await axiosInstance.get(`/vessel-page`);
    return res.data;
}

