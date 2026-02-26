import axiosInstance from "../../axios";

// Ambil semua SIJ
export async function getCareer() {
    const res = await axiosInstance.get(`/careers`);
    return res.data;
}

export async function createCareer(formData) {
    const res = await axiosInstance.post("/careers", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function updateCareer(id, formData) {
    const res = await axiosInstance.put(`/careers/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function deleteCareer(id) {
    const res = await axiosInstance.delete("/careers", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}