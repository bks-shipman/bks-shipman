import axiosInstance from "../../axios";

export async function getCrewingData() {
    const res = await axiosInstance.get(`/crewing`);
    return res.data;
}

export async function updateCrewing(formData) {
    const res = await axiosInstance.post("/crewing", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}