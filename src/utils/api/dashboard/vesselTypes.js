import axiosInstance from "../../axios";

// Ambil semua SIJ
export async function getVesselTypeData() {
    const res = await axiosInstance.get(`/vessel-types`);
    return res.data;
}

export async function createVesselType(formData) {
    const res = await axiosInstance.post("/vessel-types", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function updateVesselTypes(id, formData) {
    const res = await axiosInstance.put(`/vessel-types/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function deleteVesselTypes(id) {
    const res = await axiosInstance.delete(`/vessel-types/${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}