import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getVesselPage() {
    try {
        const res = await axiosInstance.get(`/vessel-page`);
        console.log("VESSEL DATA:", res.data);
        return res.data;
    } catch (err) {
        console.log("ERROR VESSEL:", err.response?.data);
        return null;
    }
}

