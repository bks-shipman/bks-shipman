"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/auth";

export const useAuthGuard = (allowedRoles = []) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const user = getUser();

        if (!user) {
            router.replace("/");
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            router.replace("/dashboard");
            return;
        }

        setAuthorized(true);
    }, []);

    return authorized;
};