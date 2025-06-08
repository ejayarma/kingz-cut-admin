"use client";

import { useEffect, useState } from "react";
import { StaffService } from "../settings/staff/firebase-services";
import { StaffMember } from "../settings/staff/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const [data, setData] = useState<StaffMember[]>([]);
    const staffService = new StaffService();

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const staffData = await staffService.getAllStaff();
                setData(staffData);
            } catch (error) {
                console.error("Error fetching staff data:", error);
            }
        };

        fetchStaffData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
