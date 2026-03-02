import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getCareerPage() {
    try {
        const res = await axiosInstance.get(`/career-page`);
        console.log("CAREER DATA:", res.data);
        return res.data;
    } catch (err) {
        console.log("ERROR CAREER:", err.response?.data);
        return null;
    }
}

