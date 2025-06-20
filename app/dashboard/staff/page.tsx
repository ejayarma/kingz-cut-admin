"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { StaffService } from "../settings/staff/firebase-services";
import { StaffMember } from "../settings/staff/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Page() {
    const [data, setData] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams(); // If you need dynamic route params
    const searchParams = useSearchParams(); // If you need query strings

    useEffect(() => {
        const staffService = new StaffService();

        const fetchStaffData = async () => {
            try {
                const staffData = await staffService.getAllStaff();
                setData(staffData);
            } catch (error) {
                console.error("Error fetching staff data:", error);
                setError("Failed to load staff.");
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            {loading ? (
                <p>Loading staff data...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <DataTable columns={columns} data={data} />
            )}
        </div>
    );
}
