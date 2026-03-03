import axiosInstance from "../../axios";

export async function getCertificateData() {
    const res = await axiosInstance.get(`/certificates`);
    return res.data;
}

export async function createCertificates(formData) {
    const res = await axiosInstance.post("/certificates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function updateCertificates(id, formData) {
    const res = await axiosInstance.put(`/certificates/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function deleteCertificates(id) {
    const res = await axiosInstance.delete("/certificates", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}
