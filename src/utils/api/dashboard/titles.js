import axiosInstance from "../../axios";

// Ambil semua SIJ
export async function getTitle() {
    const res = await axiosInstance.get(`/titles`);
    return res.data;
}

export async function createTitle(formData) {
    const res = await axiosInstance.post("/titles", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function updateTitle(id, formData) {
    const res = await axiosInstance.put(`/titles/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function deleteTitle(id) {
    const res = await axiosInstance.delete("/titles", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}