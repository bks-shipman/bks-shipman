import axiosInstance from "../../axios";

export async function getPartner() {
    const res = await axiosInstance.get(`/partners`);
    return res.data;
}

export async function createPartner(formData) {
    const res = await axiosInstance.post("/partners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function updatePartner(id, formData) {
    const res = await axiosInstance.put(`/partners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function deletePartner(id) {
    const res = await axiosInstance.delete("/partners", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}
