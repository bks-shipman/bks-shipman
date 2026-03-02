import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getLandingPage() {
    try {
        const res = await axiosInstance.get(`/landing-page`);
        console.log("LANDING DATA:", res.data);
        return res.data;
    } catch (err) {
        console.log("ERROR LANDING:", err.response?.data);
        return null;
    }
}

