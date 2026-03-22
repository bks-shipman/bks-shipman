import axiosInstance from "../../axios";

/**
 * Mengambil semua konfigurasi halaman (Backoffice)
 */
export async function getPageConfigs() {
    const res = await axiosInstance.get("/page-configs");
    return res.data;
}

/**
 * Mengambil status spesifik satu halaman (Landing Page/Public)
 * Gunakan ini untuk cek isActive di Navbar atau Page Guard
 */
export async function getPageStatus(key) {
    const res = await axiosInstance.get(`/page-status/${key}`);
    return res.data;
}

/**
 * Mengupdate status On/Off halaman (Toggle)
 * @param {string} key - Enum Key (contoh: 'VESSELS', 'CAREERS')
 * @param {boolean} isActive - Status baru
 */
export async function updatePageVisibility(key, isActive) {
    const res = await axiosInstance.patch(`/page-configs/${key}`, {
        isActive
    });
    return res.data;
}