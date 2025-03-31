import { Appointment, Payment, columns } from "./columns"
import { DataTable } from "./data-table"

import { v4 as uuidv4 } from "uuid";

async function getAppointmentData(): Promise<Appointment[]> {
    const statuses = ["cancelled", "absent", "done", "booked"];
    const servicesList = [
        { name: "Haircut", price: 50 },
        { name: "Massage", price: 100 },
        { name: "Facial", price: 80 },
        { name: "Manicure", price: 60 },
    ];

    const appointments: Appointment[] = [];

    for (let i = 1; i <= 50; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const startTime = new Date(2025, 2, i % 28, 9 + (i % 5), 0).toISOString(); // Random time
        const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString(); // +1 hour
        const date = startTime.split("T")[0]; // Extract YYYY-MM-DD

        appointments.push({
            no: i,
            customerName: `Customer ${i}`,
            startTime,
            endTime,
            date, // Extracted from startTime
            services: [servicesList[i % servicesList.length]], // Assigning a service
            amount: servicesList[i % servicesList.length].price,
            status: randomStatus as "cancelled" | "absent" | "done" | "booked",
        });
    }

    return appointments;
}

async function getData(): Promise<Payment[]> {
    return [
        {
            id: uuidv4(),
            amount: 100,
            status: "pending",
            email: "a@example.com",
        },
        {
            id: uuidv4(),
            amount: 200,
            status: "success",
            email: "b@example.com",
        },
        {
            id: uuidv4(),
            amount: 150,
            status: "failed",
            email: "c@example.com",
        },
        {
            id: uuidv4(),
            amount: 300,
            status: "pending",
            email: "d@example.com",
        },
        {
            id: uuidv4(),
            amount: 250,
            status: "success",
            email: "e@example.com",
        },
        {
            id: uuidv4(),
            amount: 400,
            status: "failed",
            email: "f@example.com",
        },
        {
            id: uuidv4(),
            amount: 500,
            status: "pending",
            email: "g@example.com",
        },
        {
            id: uuidv4(),
            amount: 600,
            status: "success",
            email: "h@example.com",
        },
        {
            id: uuidv4(),
            amount: 700,
            status: "pending",
            email: "i@example.com",
        },
        {
            id: uuidv4(),
            amount: 800,
            status: "failed",
            email: "j@example.com",
        },
    ];
}


export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const data = await getAppointmentData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}