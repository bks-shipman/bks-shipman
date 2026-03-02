import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api",
});

// Tambahkan token dari cookie secara otomatis
axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstance;
