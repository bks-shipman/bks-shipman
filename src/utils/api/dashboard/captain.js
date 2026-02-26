import axiosInstance from "../../axios";

export async function getCaptain() {
    const res = await axiosInstance.get(`/captain`);
    return res.data;
}

export async function updateCaptain(formData) {
    const res = await axiosInstance.post("/captain", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}