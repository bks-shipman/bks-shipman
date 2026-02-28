"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";

export const RBAC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const user = getUser();

    if (user.role == "ADMIN") {
        setIsAdmin(true);
    } else {
        setIsAdmin(false);
    }

    try {
        return isAdmin;
    } catch (error) {
        console.error("Error checking RBAC:", error);
        return false;
    }
}

