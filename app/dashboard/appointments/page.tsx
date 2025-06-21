"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AppointmentService } from "./appointment-service";
import { AppointmentTableRow } from "./types";
import { Button } from "@/components/ui/button";
import { fetchData } from "next-auth/client/_utils";

export default function AppointmentsPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const [appointments, setAppointments] = useState<AppointmentTableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchData() {
        try {
            const appointmentsData = await AppointmentService.getAppointmentsWithDetails();
            setAppointments(appointmentsData);

            setLoading(false);
        } catch (err) {
            console.error("Error loading appointments:", err);
            setError("There was an error loading the appointments. Please try again later.");
            setLoading(false);
        }
    }
    useEffect(() => {

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading appointment data...</p>
                    </div>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchData} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Appointments</h1>
                <p className="text-muted-foreground">Manage and view all appointments</p>
            </div>

            <DataTable columns={columns} data={appointments} />

        </div>
    );
}
