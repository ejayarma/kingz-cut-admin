'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, startOfWeek as startOfWeekFn, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Appointment } from '../appointments/types';
import { StaffMember } from '../settings/staff/types';
import { Service } from '../settings/services/types';
import { AppointmentService } from '../appointments/appointment-service';
import { StaffService } from '../settings/staff/firebase-services';


// Date-fns localizer for the calendar
const locales = {
    'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarEvent extends Omit<Appointment, 'startTime' | 'endTime'> {
    title: string;
    start: Date;
    end: Date;
    resource: StaffMember | undefined;
    color: string;
}

interface EventComponentProps {
    event: CalendarEvent;
}

// AppointmentService extension for calendar-specific queries
class CalendarAppointmentService {
    // Replace this with your actual AppointmentService instance
    private appointmentService: AppointmentService; // Replace with your AppointmentService type

    constructor(appointmentService: AppointmentService) {
        this.appointmentService = appointmentService;
    }

    async getAppointmentsForTimeRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
        try {
            // Convert dates to ISO strings for Firebase query
            const startTime = startDate.toISOString();
            const endTime = endDate.toISOString();

            // You'll need to implement this query in your AppointmentService
            // This is a placeholder - replace with your actual Firebase query
            const appointments = await this.appointmentService.getAppointmentsByDateRange(startTime, endTime);
            return appointments;
        } catch (error) {
            console.error('Error fetching appointments for time range:', error);
            return [];
        }
    }

    async getAppointmentsForMonth(year: number, month: number): Promise<Appointment[]> {
        const startDate = startOfMonth(new Date(year, month));
        const endDate = endOfMonth(new Date(year, month));
        return this.getAppointmentsForTimeRange(startDate, endDate);
    }

    async getAppointmentsForWeek(date: Date): Promise<Appointment[]> {
        const startDate = startOfWeekFn(date);
        const endDate = endOfWeek(date);
        return this.getAppointmentsForTimeRange(startDate, endDate);
    }

    async getAppointmentsForDay(date: Date): Promise<Appointment[]> {
        const startDate = startOfDay(date);
        const endDate = endOfDay(date);
        return this.getAppointmentsForTimeRange(startDate, endDate);
    }
}

export default function StaffWorkSchedule() {
    // Current date state - defaults to current date
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [view, setView] = useState<View>(Views.WEEK);

    // Data states
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Year selector
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    // Services for calendar appointments extension
    const calendarAppointmentService = new CalendarAppointmentService(new AppointmentService());

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    // Load appointments when view or date changes
    useEffect(() => {
        if (staffList.length > 0) {
            loadAppointmentsForCurrentView();
        }
    }, [view, currentDate, staffList]);

    // Update selected service types when services are loaded
    useEffect(() => {
        if (services.length > 0) {
            setSelectedServiceTypes(services.map(s => s.id));
        }
    }, [services]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Replace these with your actual service calls
            const staffService = new StaffService();
            const [staffData, servicesData] = await Promise.all([
                staffService.getAllStaff(),
                staffService.getAllServices()
            ]);


            setStaffList(staffData);
            setServices(servicesData);
            setSelectedStaff(staffData.map(s => s.id));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAppointmentsForCurrentView = async () => {
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


            setAppointments(appointmentsData);
            // setAppointments(appointmentsData.length > 0 ? appointmentsData : mockAppointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    };

    // Filter staff based on search term
    const filteredStaffList = useMemo(() => {
        if (!searchTerm) return staffList;
        return staffList.filter(staff =>
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [staffList, searchTerm]);

    // Filter appointments based on selected services and staff
    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            const hasSelectedService = app.serviceIds.some(serviceId =>
                selectedServiceTypes.includes(serviceId)
            );
            const hasSelectedStaff = selectAll || selectedStaff.includes(app.staffId);
            return hasSelectedService && hasSelectedStaff;
        }).map(app => {
            const service = services.find(s => app.serviceIds.includes(s.id));
            const staff = staffList.find(s => s.id === app.staffId);

            // Color mapping for service types
            const getServiceColor = (serviceId: string): string => {
                const service = services.find(s => s.id === serviceId);
                if (!service) return 'bg-gray-500';

                const colors = ['bg-blue-600', 'bg-red-500', 'bg-amber-400', 'bg-purple-500'];

                return colors[services.findIndex(s => s.id === serviceId) % colors.length];
            };

            return {
                ...app,
                title: `${app.customerName} - ${service?.name || 'Service'}`,
                start: new Date(app.startTime),
                end: new Date(app.endTime),
                resource: staff,
                color: getServiceColor(app.serviceIds[0])
            } as CalendarEvent;
        });
    }, [appointments, selectedServiceTypes, selectedStaff, selectAll, services, staffList]);

    // Toggle select all staff
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectAll(false);
            setSelectedStaff([]);
        } else {
            setSelectAll(true);
            setSelectedStaff(staffList.map(s => s.id));
        }
    };

    // Toggle individual staff selection
    const toggleStaffSelection = (staffId: string) => {
        if (selectedStaff.includes(staffId)) {
            const newSelected = selectedStaff.filter(id => id !== staffId);
            setSelectedStaff(newSelected);
            setSelectAll(false);
        } else {
            const newSelected = [...selectedStaff, staffId];
            setSelectedStaff(newSelected);
            if (newSelected.length === staffList.length) {
                setSelectAll(true);
            }
        }
    };

    // Toggle service type filter
    const toggleServiceType = (serviceId: string) => {
        if (selectedServiceTypes.includes(serviceId)) {
            setSelectedServiceTypes(selectedServiceTypes.filter(id => id !== serviceId));
        } else {
            setSelectedServiceTypes([...selectedServiceTypes, serviceId]);
        }
    };

    // Color mapping for service types
    const getServiceTypeColor = (serviceId: string): string => {
        const colors = ['bg-blue-500', 'bg-red-500', 'bg-amber-400', 'bg-purple-500'];
        return colors[services.findIndex(s => s.id === serviceId) % colors.length];
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Navigate to previous/next period
    const navigatePrevious = () => {
        const newDate = new Date(currentDate);
        if (view === Views.MONTH) {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (view === Views.WEEK) {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(currentDate);
        if (view === Views.MONTH) {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (view === Views.WEEK) {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
    };

    // Year navigation
    const navigateToYear = (year: number) => {
        setSelectedYear(year);
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
    };

    // Custom event component for the calendar
    const EventComponent = ({ event }: EventComponentProps) => {
        return (
            <div
                className={`${event.color} text-white p-1 rounded text-xs overflow-hidden`}
                style={{ height: '100%' }}
            >
                <div className="font-semibold">{event.customerName}</div>
                <div>{format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}</div>
                <div>{services.find(s => event.serviceIds.includes(s.id))?.name}</div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-7xl">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading schedule...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Staff Work Schedule</h1>

                {/* Year selector */}
                <div className="flex items-center gap-4 mb-4">
                    <select
                        value={selectedYear}
                        onChange={(e) => navigateToYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold">
                        {currentDate.getDate()} {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={navigatePrevious}
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={navigateNext}
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Month tabs */}
                <div className="flex border rounded-md overflow-hidden mb-6">
                    {months.map((month, index) => (
                        <button
                            key={month}
                            onClick={() => {
                                const newDate = new Date(selectedYear, index, 1);
                                setCurrentDate(newDate);
                            }}
                            className={`flex-1 py-2 px-1 text-sm ${currentDate.getMonth() === index && currentDate.getFullYear() === selectedYear ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            {month}
                        </button>
                    ))}
                </div>

                {/* Filter by service type */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {services.map(service => (
                        <button
                            key={service.id}
                            onClick={() => toggleServiceType(service.id)}
                            className={`flex items-center gap-2 py-1 px-3 rounded-full border ${selectedServiceTypes.includes(service.id) ? 'border-gray-400' : 'border-gray-200 text-gray-400'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${selectedServiceTypes.includes(service.id) ? getServiceTypeColor(service.id) : 'bg-gray-300'
                                }`}></span>
                            {service.name}
                            {selectedServiceTypes.includes(service.id) && (
                                <X size={16} className="text-gray-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* View mode selector */}
                <div className="flex justify-end mb-4">
                    <div className="flex border rounded-md overflow-hidden">
                        <button
                            onClick={() => setView(Views.MONTH)}
                            className={`px-6 py-2 ${view === Views.MONTH ? 'bg-teal-500 text-white' : 'bg-white'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView(Views.WEEK)}
                            className={`px-6 py-2 ${view === Views.WEEK ? 'bg-teal-500 text-white' : 'bg-white'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setView(Views.DAY)}
                            className={`px-6 py-2 ${view === Views.DAY ? 'bg-teal-500 text-white' : 'bg-white'}`}
                        >
                            Day
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[250px_1fr] gap-4">
                {/* Staff selection panel */}
                <div className="border rounded-lg p-4">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                className="pl-10 w-full bg-slate-200 border-0 rounded-lg shadow-none"
                                placeholder="Search staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-2 flex items-center">
                        <span className="font-semibold mr-2">Staff Name</span>
                        <span className="text-gray-400 text-sm">{filteredStaffList.length}</span>
                    </div>

                    <div className="mb-3 flex items-center">
                        <input
                            type="checkbox"
                            className="h-4 w-4 mr-2 accent-teal-500"
                            checked={selectAll}
                            onChange={handleSelectAll}
                        />
                        <span>Select all</span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-auto">
                        {filteredStaffList.map(staff => (
                            <div key={staff.id} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-teal-500"
                                    checked={selectAll || selectedStaff.includes(staff.id)}
                                    onChange={() => toggleStaffSelection(staff.id)}
                                />
                                <Avatar className="size-10 hover:border-white hover:border-2">
                                    <AvatarImage src={staff.image || "/avatar.png"} />
                                    <AvatarFallback className="bg-orange-200">
                                        {staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{staff.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar component */}
                <div className="border rounded-lg p-4">
                    <Calendar
                        localizer={localizer}
                        events={filteredAppointments}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        view={view}
                        onView={(newView: View) => setView(newView)}
                        date={currentDate}
                        onNavigate={(date: Date) => setCurrentDate(date)}
                        components={{
                            event: EventComponent,
                        }}
                        formats={{
                            dayFormat: 'ddd',
                            timeGutterFormat: (hour: Date) => format(hour, 'h:mm a'),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}