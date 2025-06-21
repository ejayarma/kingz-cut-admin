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

    const fetchStaffData = async () => {
        const staffService = new StaffService();
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

    useEffect(() => {
        fetchStaffData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-lg">Loading staff...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <p className="text-red-500 text-lg">{error}</p>
                        <button
                            onClick={fetchStaffData}
                            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
