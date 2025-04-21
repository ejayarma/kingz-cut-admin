'use client';

import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

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

// Define types for our data
interface Staff {
    id: number;
    name: string;
    avatar: string;
}

type AppointmentType = 'Haircut' | 'Beard Grooming' | 'Hair Coloring' | 'Wash & Styling';

interface Appointment {
    id: number;
    staffId: number;
    clientName: string;
    type: AppointmentType;
    start: Date;
    end: Date;
    color: string;
}

interface CalendarEvent extends Appointment {
    title: string;
    resource: Staff | undefined;
}

interface EventComponentProps {
    event: CalendarEvent;
}

export default function StaffWorkSchedule() {
    // Current date state
    const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 3, 4)); // April 4, 2025
    const [view, setView] = useState<View>(Views.WEEK);

    // UI States
    const [selectedAppointmentTypes, setSelectedAppointmentTypes] = useState<AppointmentType[]>([
        'Haircut', 'Beard Grooming', 'Hair Coloring', 'Wash & Styling'
    ]);
    const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(true);

    // Mock data for staff
    const staffList: Staff[] = [
        { id: 1, name: 'Ashley Brown', avatar: '/placeholder/40/40' },
        { id: 2, name: 'Javier Holloway', avatar: '/placeholder/40/40' },
        { id: 3, name: 'Stephen Harris', avatar: '/placeholder/40/40' },
        { id: 4, name: 'Richard Walters', avatar: '/placeholder/40/40' },
        { id: 5, name: 'Michael Simon', avatar: '/placeholder/40/40' },
        { id: 6, name: 'Melissa Bradley', avatar: '/placeholder/40/40' },
        { id: 7, name: 'Victoria Griffin', avatar: '/placeholder/40/40' },
        { id: 8, name: 'Derek Larson', avatar: '/placeholder/40/40' },
        { id: 9, name: 'Robert Anderson', avatar: '/placeholder/40/40' },
    ];

    // Helper to create date for appointment
    const createAppointmentDate = (dayOfWeek: number, timeStr: string): Date => {
        const date = new Date(2025, 3, dayOfWeek); // April 2025, with day of week
        const [hour, minutePart] = timeStr.split(':');
        const [minute, period] = minutePart.split(' ');
        let hourNum = parseInt(hour);

        if (period.toUpperCase() === 'PM' && hourNum < 12) {
            hourNum += 12;
        } else if (period.toUpperCase() === 'AM' && hourNum === 12) {
            hourNum = 0;
        }

        date.setHours(hourNum, parseInt(minute || '0'), 0);
        return date;
    };

    // Mock data for appointments
    const appointmentsData: Appointment[] = [
        {
            id: 1,
            staffId: 1,
            clientName: 'Andy Potter',
            type: 'Wash & Styling',
            start: createAppointmentDate(2, '08:00 AM'),
            end: createAppointmentDate(2, '08:30 AM'),
            color: 'bg-blue-500'
        },
        {
            id: 2,
            staffId: 1,
            clientName: 'Jessica May',
            type: 'Hair Coloring',
            start: createAppointmentDate(5, '08:00 AM'),
            end: createAppointmentDate(5, '08:30 AM'),
            color: 'bg-amber-400'
        },
        {
            id: 3,
            staffId: 2,
            clientName: 'Shawn Tine',
            type: 'Haircut',
            start: createAppointmentDate(4, '07:00 AM'),
            end: createAppointmentDate(4, '07:30 AM'),
            color: 'bg-blue-600'
        },
        {
            id: 4,
            staffId: 5,
            clientName: 'James Touma',
            type: 'Haircut',
            start: createAppointmentDate(2, '09:00 AM'),
            end: createAppointmentDate(2, '09:30 AM'),
            color: 'bg-blue-600'
        },
        {
            id: 5,
            staffId: 7,
            clientName: 'Pete Smith',
            type: 'Hair Coloring',
            start: createAppointmentDate(2, '10:00 AM'),
            end: createAppointmentDate(2, '10:30 AM'),
            color: 'bg-amber-400'
        },
        {
            id: 6,
            staffId: 7,
            clientName: 'Norman Bates',
            type: 'Wash & Styling',
            start: createAppointmentDate(4, '10:00 AM'),
            end: createAppointmentDate(4, '10:30 AM'),
            color: 'bg-red-500'
        },
        {
            id: 7,
            staffId: 9,
            clientName: 'Andrew Bennett',
            type: 'Haircut',
            start: createAppointmentDate(4, '11:00 AM'),
            end: createAppointmentDate(4, '11:30 AM'),
            color: 'bg-blue-600'
        },
    ];

    // Filter appointments based on selected types and staff
    const filteredAppointments = useMemo(() => {
        return appointmentsData.filter(app =>
            selectedAppointmentTypes.includes(app.type) &&
            (selectAll || selectedStaff.includes(app.staffId))
        ).map(app => ({
            ...app,
            title: `${app.clientName} - ${app.type}`,
            resource: staffList.find(s => s.id === app.staffId)
        }));
    }, [selectedAppointmentTypes, selectedStaff, selectAll]);

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
    const toggleStaffSelection = (staffId: number) => {
        if (selectedStaff.includes(staffId)) {
            setSelectedStaff(selectedStaff.filter(id => id !== staffId));
            setSelectAll(false);
        } else {
            const newSelected = [...selectedStaff, staffId];
            setSelectedStaff(newSelected);
            if (newSelected.length === staffList.length) {
                setSelectAll(true);
            }
        }
    };

    // Toggle appointment type filter
    const toggleAppointmentType = (type: AppointmentType) => {
        if (selectedAppointmentTypes.includes(type)) {
            setSelectedAppointmentTypes(selectedAppointmentTypes.filter(t => t !== type));
        } else {
            setSelectedAppointmentTypes([...selectedAppointmentTypes, type]);
        }
    };

    // Color mapping for appointment types
    const typeColors: Record<AppointmentType, string> = {
        'Haircut': 'bg-blue-500',
        'Beard Grooming': 'bg-red-500',
        'Hair Coloring': 'bg-amber-400',
        'Wash & Styling': 'bg-purple-500'
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

    // Custom event component for the calendar
    const EventComponent = ({ event }: EventComponentProps) => {
        const appointmentType = event.type as AppointmentType;
        return (
            <div
                className={`${typeColors[appointmentType]} text-white p-1 rounded text-xs overflow-hidden`}
                style={{ height: '100%' }}
            >
                <div className="font-semibold">{event.clientName}</div>
                <div>{format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}</div>
                <div>{appointmentType}</div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Staff Work Schedule</h1>

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
                                const newDate = new Date(currentDate);
                                newDate.setMonth(index);
                                setCurrentDate(newDate);
                            }}
                            className={`flex-1 py-2 px-1 text-sm ${currentDate.getMonth() === index ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            {month}
                        </button>
                    ))}
                </div>

                {/* Filter by appointment type */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {(Object.keys(typeColors) as AppointmentType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => toggleAppointmentType(type)}
                            className={`flex items-center gap-2 py-1 px-3 rounded-full border ${selectedAppointmentTypes.includes(type) ? 'border-gray-400' : 'border-gray-200 text-gray-400'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${selectedAppointmentTypes.includes(type) ? typeColors[type] : 'bg-gray-300'
                                }`}></span>
                            {type}
                            <X size={16} className="text-gray-500" />
                        </button>
                    ))}
                </div>

                {/* View mode selector */}
                {/* <div className="flex justify-end mb-4">
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
                </div> */}
            </div>

            <div className="grid grid-cols-[250px_1fr] gap-4">
                {/* Staff selection panel */}
                <div className="border rounded-lg p-4">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                className="pl-10 w-full bg-slate-200 border-0 rounded-lg shadow-none"
                                placeholder="Search for something"
                            />
                        </div>
                    </div>

                    <div className="mb-2 flex items-center">
                        <span className="font-semibold mr-2">Staff Name</span>
                        <span className="text-gray-400 text-sm">{staffList.length}</span>
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
                        {staffList.map(staff => (
                            <div key={staff.id} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-teal-500"
                                    checked={selectAll || selectedStaff.includes(staff.id)}
                                    onChange={() => toggleStaffSelection(staff.id)}
                                />
                                <Avatar className="size-10 hover:border-white hover:border-2">
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback className="bg-orange-200">JD</AvatarFallback>
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