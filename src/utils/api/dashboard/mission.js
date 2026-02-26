import axiosInstance from "../../axios";

export async function getMission() {
    const res = await axiosInstance.get(`/mission`);
    return res.data;
}

export async function updateMission(formData) {
    const res = await axiosInstance.post("/mission", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}