import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getExhibitionPage() {
    try {
        const res = await axiosInstance.get(`/exhibition-page`);
        console.log("EXHIBITION DATA:", res.data);
        return res.data;
    } catch (err) {
        console.log("ERROR EXHIBITION:", err.response?.data);
        return null;
    }
}

