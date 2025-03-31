import { BookingTrendChart } from "@/components/booking-trend-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, CalendarDays, UserRound } from "lucide-react";
import Image from "next/image";

export default function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {


    const topServices = [
        { id: 1, name: "Haircut", count: 55, image: '/haircut.png', bgColorClass: 'bg-blue-100' },
        { id: 2, name: "Beard Grooming", count: 32, image: '/beard.png', bgColorClass: 'bg-red-100' },
        { id: 3, name: "Hair Coloring", count: 20, image: '/coloring.png', bgColorClass: 'bg-amber-100' },
        { id: 4, name: "Wash & Styling", count: 17, image: '/styling.png', bgColorClass: 'bg-indigo-100' },
    ]

    const upcomingBookings = [
        {
            id: 1,
            customer: "Kojo Jnr.",
            staff: "John Doe",
            service: "Hair Cut",
            time: "10:00AM - 10:30AM"
        },
        {
            id: 2,
            customer: "Kojo Jnr.",
            staff: "John Doe",
            service: "Hair Cut",
            time: "10:00AM - 10:30AM"
        },
        {
            id: 3,
            customer: "Kojo Jnr.",
            staff: "John Doe",
            service: "Hair Cut",
            time: "10:00AM - 10:30AM"
        },
        {
            id: 4,
            customer: "Kojo Jnr.",
            staff: "John Doe",
            service: "Hair Cut",
            time: "10:00AM - 10:30AM"
        }
    ];


    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <Card className="border-0 shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 text-xl">
                            <CalendarDays />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total bookings</p>
                            <h3 className="text-2xl font-bold">120</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl">
                            <UserRound />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Customers</p>
                            <h3 className="text-2xl font-bold">1,600</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="size-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-xl">
                            <UserRound />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Staff</p>
                            <h3 className="text-2xl font-bold">460</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="size-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 text-xl">
                            <Banknote />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Income</p>
                            <h3 className="text-2xl font-bold">GHS 7,920</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Booking Trend</h3>
                    <Card className="border-0 shadow-none h-full flex flex-col">
                        <CardContent className="p-6 flex-1">
                            <BookingTrendChart />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Top Services Booked</h3>
                    <Card className="border-0 shadow-none h-full flex flex-col">
                        <CardContent className="p-6 flex-1">
                            <div className="space-y-4">
                                {topServices.map((service) => (
                                    <div key={service.id} className="flex items-center justify-between text-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-14 rounded-2xl flex items-center justify-center text-xl ${service.bgColorClass}`}>
                                                <Image src={service.image} width={30} height={30} alt={service.name} />
                                            </div>
                                            <span className="text-gray-400 font-medium">{service.name}</span>
                                        </div>
                                        <span className="text-blue-300 font-light">{service.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>


            <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-700">Upcoming Bookings</h3>
                    <Button variant="link" className="text-blue-600">View All</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="border-0 shadow-none p-0">
                            <CardContent className="p-0">
                                <div className="flex">
                                    <div className="px-5 bg-teal-700/20 text-teal-700 font-medium inline-flex items-center rounded-2xl">
                                        <p>Today</p>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <div className="flex justify-between gap-4">
                                            <span className="text-gray-500">Customer:</span>
                                            <span className="font-medium">{booking.customer}</span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-gray-500">Staff:</span>
                                            <span className="font-medium">{booking.staff}</span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-gray-500">Service:</span>
                                            <span className="font-medium">{booking.service}</span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-gray-500">Time</span>
                                            <span className="font-medium">{booking.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>);
}