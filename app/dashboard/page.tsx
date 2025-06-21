'use client';


import { BookingTrendChart } from "@/components/booking-trend-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, CalendarDays, UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Service } from "./settings/services/types";
import { Appointment } from "./appointments/types";
import { StaffMember } from "./settings/staff/types";
import { StaffService } from "./settings/staff/firebase-services";
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import CalendarAppointmentService from "./schedule/calendar-appointment-service";
import { AppointmentService } from "./appointments/appointment-service";
import { CustomerService } from "./customers/customer-firebase-services";


interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    userId?: string;
    image?: string | null;
}

// Types for your Firebase services (you'll need to implement these)
interface FirebaseServices {
    getServices: () => Promise<Service[]>;
    getAppointments: () => Promise<Appointment[]>;
    getStaffMembers: () => Promise<StaffMember[]>;
    getCustomers: () => Promise<Customer[]>;
}

// You'll need to import your actual Firebase services
// import { firebaseServices } from "@/lib/firebase-services";

export default function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // State for data
    const [services, setServices] = useState<Service[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const calendarAppointmentService = new CalendarAppointmentService(new AppointmentService());

    const loadAppointmentsForCurrentView = async (): Promise<Appointment[]> => {
        try {
            let appointmentsData: Appointment[] = [];

            // Replace with actual service calls
            if (view === Views.MONTH) {
                appointmentsData = await calendarAppointmentService.getAppointmentsForMonth(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
            } else if (view === Views.WEEK) {
                appointmentsData = await calendarAppointmentService.getAppointmentsForWeek(currentDate);
            } else if (view === Views.DAY) {
                appointmentsData = await calendarAppointmentService.getAppointmentsForDay(currentDate);
            } else if (view === Views.AGENDA) {
                // appointmentsData = await calendarAppointmentService.getAppointmentsForDay(currentDate);
                appointmentsData = await calendarAppointmentService.getAppointmentsForMonth(
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                );
            }

            // setAppointments(appointmentsData);
            return appointmentsData;
            // setAppointments(appointmentsData.length > 0 ? appointmentsData : mockAppointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
            return [];
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const staffService = new StaffService();
            const customersService = new CustomerService(); // Assuming you have a similar service for customers
            const [servicesData, appointmentsData, staffData, customersData] = await Promise.all([
                staffService.getAllServices(),
                loadAppointmentsForCurrentView(),
                staffService.getAllStaff(),
                customersService.getAllCustomers(),
            ]);

            setServices(servicesData);
            setAppointments(appointmentsData);
            setStaff(staffData);
            setCustomers(customersData);
        } catch (error) {
            setError('Failed to load data. Please try again.');
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {

        loadData();
    }, []);

    // Calculate statistics
    const totalBookings = appointments.length;
    const totalCustomers = customers.filter(c => c.active).length;
    const totalStaff = staff.filter(s => s.active).length;
    const totalIncome = appointments
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + a.totalPrice, 0);

    // Calculate top services
    const serviceBookingCounts = appointments.reduce((acc, appointment) => {
        appointment.serviceIds.forEach(serviceId => {
            acc[serviceId] = (acc[serviceId] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const topServices = services
        .map(service => ({
            id: service.id,
            name: service.name,
            count: serviceBookingCounts[service.id] || 0,
            image: service.imageUrl || '/default-service.png',
            bgColorClass: getBgColorClass(service.name),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    // Get upcoming bookings (today and future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBookings = appointments
        .filter(appointment => {
            const appointmentDate = new Date(appointment.startTime);
            return appointmentDate >= today && ['pending', 'confirmed'].includes(appointment.status);
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 4)
        .map(appointment => ({
            id: appointment.id || '',
            customer: customers.find(c => c.id === appointment.customerId)?.name || 'Unknown Customer',
            staff: staff.find(s => s.id === appointment.staffId)?.name || 'Unknown Staff',
            service: appointment.services?.[0]?.name ||
                services.find(s => s.id === appointment.serviceIds[0])?.name ||
                'Unknown Service',
            time: formatTimeRange(appointment.startTime, appointment.endTime),
            isToday: isToday(appointment.startTime),
        }));

    // Helper functions
    function getBgColorClass(serviceName: string): string {
        // const colors = ['bg-blue-100', 'bg-red-100', 'bg-amber-100', 'bg-indigo-100'];
        // return colors[Math.floor(Math.random() * colors.length)];

        const colorMap: Record<string, string> = {
            'Haircut': 'bg-blue-100',
            'Beard Grooming': 'bg-red-100',
            'Hair Coloring': 'bg-amber-100',
            'Wash & Styling': 'bg-indigo-100',
        };
        return colorMap[serviceName] || 'bg-gray-100';
    }

    function formatTimeRange(startTime: string, endTime: string): string {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const formatTime = (date: Date) =>
            date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        return `${formatTime(start)} - ${formatTime(end)}`;
    }

    function isToday(dateString: string): boolean {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
                        <Button onClick={loadData} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }


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
                            <h3 className="text-2xl font-bold">{totalBookings}</h3>
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
                            <h3 className="text-2xl font-bold">{totalCustomers.toLocaleString()}</h3>
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
                            <h3 className="text-2xl font-bold">{totalStaff}</h3>
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
                            <h3 className="text-2xl font-bold">GHS {totalIncome.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Booking Trend</h3>
                    <Card className="border-0 shadow-none h-full flex flex-col">
                        <CardContent className="p-6 flex-1">
                            {/* Pass appointments and customers data to your BookingTrendChart component */}
                            <BookingTrendChart appointments={appointments} customers={customers} />
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
                                            <div className={`size-14 rounded-2xl flex items-center justify-center text-xl`}>
                                                <Image src={service.image} className="rounded-full" width={50} height={50} alt={service.name} />
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

                    {/* // Link to view all bookings */}

                    <Button asChild variant="link" className="text-blue-600">
                        <a href="/dashboard/appointments">View All</a>
                    </Button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {upcomingBookings.length > 0 ? (
                        upcomingBookings.map((booking) => (
                            <Card key={booking.id} className="border-0 shadow-none p-0">
                                <CardContent className="p-0">
                                    <div className="flex">
                                        <div className="px-5 bg-teal-700/20 text-teal-700 font-medium inline-flex items-center rounded-2xl">
                                            <p>{booking.isToday ? 'Today' : 'Upcoming'}</p>
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
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            No upcoming bookings
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}