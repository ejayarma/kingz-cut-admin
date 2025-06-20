"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AppointmentService } from "./appointment-service";
import { AppointmentTableRow } from "./types";

export default function AppointmentsPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const [appointments, setAppointments] = useState<AppointmentTableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const appointmentsData = await AppointmentService.getAppointmentsWithDetails();
                setAppointments(appointmentsData);

                // Optional: Fetch filter data
                // const [customers, services, staff] = await Promise.all([
                //     AppointmentService.getAllCustomers(),
                //     AppointmentService.getAllServices(),
                //     AppointmentService.getAllStaff(),
                // ]);

                setLoading(false);
            } catch (err) {
                console.error("Error loading appointments:", err);
                setError("There was an error loading the appointments. Please try again later.");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Appointments</h1>
                <p className="text-muted-foreground">Manage and view all appointments</p>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error Loading Appointments</h1>
                    <p className="text-muted-foreground mt-2">{error}</p>
                </div>
            ) : (
                <DataTable columns={columns} data={appointments} />
            )}
        </div>
    );
}
