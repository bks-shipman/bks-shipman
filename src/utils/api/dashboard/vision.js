import axiosInstance from "../../axios";

export async function getVision() {
    const res = await axiosInstance.get(`/vision`);
    return res.data;
}

export async function updateVision(formData) {
    const res = await axiosInstance.post("/vision", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}