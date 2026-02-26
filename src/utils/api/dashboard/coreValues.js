import axiosInstance from "../../axios";

// Ambil semua SIJ
export async function getCoreValueData() {
    const res = await axiosInstance.get(`/core-values`);
    return res.data;
}

export async function createCoreValue(formData) {
    const res = await axiosInstance.post("/core-values", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function updateCoreValue(id, formData) {
    const res = await axiosInstance.put(`/core-values/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function deleteCoreValue(id) {
    const res = await axiosInstance.delete(`/core-values/${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}