import { startOfMonth, endOfMonth, startOfWeek as startOfWeekFn, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { AppointmentService } from "../appointments/appointment-service";
import { Appointment } from '../appointments/types';

// AppointmentService extension for calendar-specific queries
export default class CalendarAppointmentService {
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