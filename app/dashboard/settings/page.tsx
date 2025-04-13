"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/dashboard/settings/business-details");
    }, [router]);

    return null; // This page will redirect, so no content is needed
}