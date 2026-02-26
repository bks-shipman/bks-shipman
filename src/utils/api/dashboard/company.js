import axiosInstance from "../../axios";

export async function getCompanyData() {
    const res = await axiosInstance.get(`/company`);
    return res.data;
}

export async function updateCompany(formData) {
    const res = await axiosInstance.post("/company", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}