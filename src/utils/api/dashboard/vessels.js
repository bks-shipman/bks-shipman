import axiosInstance from "../../axios";

export async function getVesselsData() {
    const res = await axiosInstance.get(`/vessels`);
    return res.data;
}

export async function createVessels(formData) {
    const res = await axiosInstance.post("/vessels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function updateVessels(id, formData) {
    const res = await axiosInstance.put(`/vessels/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function deleteVessels(id) {
    const res = await axiosInstance.delete("/vessels", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}
