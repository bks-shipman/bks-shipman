import axiosInstance from "../../axios";

// Ambil semua SIJ
export async function getUsersData() {
    const res = await axiosInstance.get(`/users`);
    return res.data;
}

export async function createUser(formData) {
    const res = await axiosInstance.post("/users", formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function updateUser(id, formData) {
    const res = await axiosInstance.put(`/user-password/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function changePassword(formData) {
    const res = await axiosInstance.patch(`/user-password`, formData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function deleteUser(id) {
    const res = await axiosInstance.delete("/users", {
        data: { "id": id },
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

export async function suspendUsers(id, formData) {
    const res = await axiosInstance.patch(`user-suspend/${id}`, formData, {
        headers: { "Content-type": "application/json" }
    });

}