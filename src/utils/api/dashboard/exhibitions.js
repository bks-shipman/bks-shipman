import axiosInstance from "../../axios";

export async function getExhibition() {
    const res = await axiosInstance.get(`/exhibitions`);
    return res.data;
}

export async function createExhibition(formData) {
    const res = await axiosInstance.post("/exhibitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function updateExhibition(id, formData) {
    const res = await axiosInstance.put(`/exhibitions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function deleteExhibition(id) {
    const res = await axiosInstance.delete("/exhibitions", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}
