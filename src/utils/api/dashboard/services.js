import axiosInstance from "../../axios";

// Ambil semua SIJ
export async function getService() {
    const res = await axiosInstance.get(`/services`);
    return res.data;
}

export async function createService(formData) {
    const res = await axiosInstance.post("/services", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function updateService(id, formData) {
    const res = await axiosInstance.put(`/services/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function deleteService(id) {
    const res = await axiosInstance.delete("/services", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}