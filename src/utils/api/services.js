import axiosInstance from "../axios";

export async function getServiceById(id) {
    const res = await axiosInstance.get(`/services/${id}`);
    return res.data;
}
