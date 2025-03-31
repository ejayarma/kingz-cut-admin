"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,

} from "@/components/ui/chart"
const chartData = [
    { day: "Mon", new_client: 186, returning_client: 80 },
    { day: "Tue", new_client: 305, returning_client: 200 },
    { day: "Wed", new_client: 237, returning_client: 120 },
    { day: "Thur", new_client: 73, returning_client: 190 },
    { day: "Fri", new_client: 209, returning_client: 130 },
    { day: "Sat", new_client: 214, returning_client: 140 },
]

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

export function BookingTrendChart() {
    return (
        <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData} height={100}
                margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                }}>
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
                <Bar name={"New Client"} dataKey="new_client" fill="#5C59FF" radius={[4, 4, 0, 0]} />
                <Bar name={"Returning Client"} dataKey="returning_client" fill="#2C8DFF" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    )
}
