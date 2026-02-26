import axiosInstance from "../../axios";

export async function getAboutUs() {
    const res = await axiosInstance.get(`/about-us`);
    return res.data;
}

export async function updateAboutUs(formData) {
    const res = await axiosInstance.post("/about-us", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}