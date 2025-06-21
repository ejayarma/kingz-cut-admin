"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { useMemo } from "react"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Appointment interface (matches your provided interface)
interface Appointment {
    id: string | null;
    no?: number;
    customerId: string;
    customerName?: string;
    staffId: string;
    staffName?: string;
    serviceIds: string[];
    startTime: string;
    endTime: string;
    date?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'noShow';
    totalPrice: number;
    totalTimeframe: number;
    bookingType: 'homeService' | 'walkInService';
    notes: string | null;
    reviewed: boolean;
    createdAt: string;
    updatedAt: string;
}

interface BookingTrendChartProps {
    appointments?: Appointment[];
    customers?: Array<{ id: string; createdAt: string; }>;
}

const chartConfig = {
    new_client: {
        label: "New Client",
        color: "#5C59FF",
    },
    returning_client: {
        label: "Returning Client",
        color: "#2C8DFF",
    },
} satisfies ChartConfig

export function BookingTrendChart({ appointments = [], customers = [] }: BookingTrendChartProps) {
    const chartData = useMemo(() => {
        // Get the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        // Create a map of customer creation dates for determining new vs returning clients
        const customerCreationMap = new Map<string, Date>();
        customers.forEach(customer => {
            customerCreationMap.set(customer.id, new Date(customer.createdAt));
        });

        // Process appointments for each day
        const dailyData = last7Days.map(date => {
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateString = date.toISOString().split('T')[0];

            // Filter appointments for this day
            const dayAppointments = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.startTime).toISOString().split('T')[0];
                return appointmentDate === dateString && 
                       ['confirmed', 'completed'].includes(appointment.status);
            });

            // Count new vs returning clients
            let newClientCount = 0;
            let returningClientCount = 0;

            // Group appointments by customer to avoid counting the same customer multiple times per day
            const uniqueCustomers = new Set<string>();
            dayAppointments.forEach(appointment => {
                uniqueCustomers.add(appointment.customerId);
            });

            uniqueCustomers.forEach(customerId => {
                const customerCreationDate = customerCreationMap.get(customerId);
                if (customerCreationDate) {
                    // Consider a client "new" if they were created within the last 30 days
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    
                    if (customerCreationDate >= thirtyDaysAgo) {
                        newClientCount++;
                    } else {
                        returningClientCount++;
                    }
                } else {
                    // If we don't have customer creation data, assume returning client
                    returningClientCount++;
                }
            });

            return {
                day: dayName,
                new_client: newClientCount,
                returning_client: returningClientCount,
                date: dateString
            };
        });

        return dailyData;
    }, [appointments, customers]);

    // Fallback data if no appointments are provided
    const fallbackData = [
        { day: "Mon", new_client: 0, returning_client: 0 },
        { day: "Tue", new_client: 0, returning_client: 0 },
        { day: "Wed", new_client: 0, returning_client: 0 },
        { day: "Thu", new_client: 0, returning_client: 0 },
        { day: "Fri", new_client: 0, returning_client: 0 },
        { day: "Sat", new_client: 0, returning_client: 0 },
        { day: "Sun", new_client: 0, returning_client: 0 },
    ];

    const dataToUse = appointments.length > 0 ? chartData : fallbackData;

    return (
        <ChartContainer config={chartConfig}>
            <BarChart 
                accessibilityLayer 
                data={dataToUse} 
                height={100}
                margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />

                <Legend verticalAlign="top" align="right" iconType="circle" />

                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar 
                    name="New Client" 
                    dataKey="new_client" 
                    fill="#5C59FF" 
                    radius={[4, 4, 0, 0]} 
                />
                <Bar 
                    name="Returning Client" 
                    dataKey="returning_client" 
                    fill="#2C8DFF" 
                    radius={[4, 4, 0, 0]} 
                />
            </BarChart>
        </ChartContainer>
    )
}