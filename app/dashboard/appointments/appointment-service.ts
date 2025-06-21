// services/appointmentService.ts

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  DocumentData,
  QuerySnapshot,
  FirestoreError,
} from "firebase/firestore";
import {
  Appointment,
  Customer,
  Service,
  Staff,
  AppointmentTableRow,
} from "./types";
import { db } from "@/utils/firebase.browser";

export class AppointmentService {
  // Fetch all appointments with populated data
  static async getAppointmentsWithDetails(): Promise<AppointmentTableRow[]> {
    try {
      // Fetch all collections in parallel
      const [
        appointmentsSnapshot,
        customersSnapshot,
        servicesSnapshot,
        staffSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "appointments")),
        getDocs(collection(db, "customers")),
        getDocs(collection(db, "services")),
        getDocs(collection(db, "staff")),
      ]);

      // Create lookup maps for efficient data retrieval
      const customersMap = new Map<string, Customer>();
      const servicesMap = new Map<string, Service>();
      const staffMap = new Map<string, Staff>();

      // Populate customers map
      customersSnapshot.docs.forEach((doc) => {
        customersMap.set(doc.id, { id: doc.id, ...doc.data() } as Customer);
      });

      // Populate services map
      servicesSnapshot.docs.forEach((doc) => {
        servicesMap.set(doc.id, { id: doc.id, ...doc.data() } as Service);
      });

      // Populate staff map
      staffSnapshot.docs.forEach((doc) => {
        staffMap.set(doc.id, { id: doc.id, ...doc.data() } as Staff);
      });

      // Process appointments and populate with related data
      const appointments: AppointmentTableRow[] = appointmentsSnapshot.docs.map(
        (doc, index) => {
          const appointmentData = { id: doc.id, ...doc.data() } as Appointment;

          // Get customer data
          const customer = customersMap.get(appointmentData.customerId);

          // Get staff data
          const staff = staffMap.get(appointmentData.staffId);

          // Get services data
          const services = appointmentData.serviceIds
            .map((serviceId) => servicesMap.get(serviceId))
            .filter(Boolean) as Service[];

          // Calculate total price and timeframe if not already set
          const totalPrice =
            appointmentData.totalPrice ||
            services.reduce((sum, service) => sum + service.price, 0);

          const totalTimeframe =
            appointmentData.totalTimeframe ||
            services.reduce((sum, service) => sum + service.duration, 0);

          // Extract date from startTime
          const date = appointmentData.startTime.split("T")[0];

          return {
            ...appointmentData,
            no: index + 1,
            customerName: customer?.name || "Unknown Customer",
            staffName: staff?.name || "Unknown Staff",
            services,
            totalPrice,
            totalTimeframe,
            date,
          } as AppointmentTableRow;
        }
      );

      // Sort by startTime (most recent first)
      return appointments.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw new Error("Failed to fetch appointments data");
    }
  }

  // Fetch appointments by customer ID
  static async getAppointmentsByCustomer(
    customerId: string
  ): Promise<AppointmentTableRow[]> {
    try {
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("customerId", "==", customerId),
        orderBy("startTime", "desc")
      );

      const appointmentsSnapshot = await getDocs(appointmentsQuery);

      if (appointmentsSnapshot.empty) {
        return [];
      }

      // Get all unique service IDs and staff IDs from appointments
      const serviceIds = new Set<string>();
      const staffIds = new Set<string>();

      appointmentsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        data.serviceIds?.forEach((id: string) => serviceIds.add(id));
        if (data.staffId) staffIds.add(data.staffId);
      });

      // Fetch related data
      const [customer, services, staff] = await Promise.all([
        this.getCustomerById(customerId),
        this.getServicesByIds(Array.from(serviceIds)),
        this.getStaffByIds(Array.from(staffIds)),
      ]);

      const servicesMap = new Map(services.map((s) => [s.id, s]));
      const staffMap = new Map(staff.map((s) => [s.id, s]));

      return appointmentsSnapshot.docs.map((doc, index) => {
        const appointmentData = { id: doc.id, ...doc.data() } as Appointment;

        const appointmentServices = appointmentData.serviceIds
          .map((id) => servicesMap.get(id))
          .filter(Boolean) as Service[];

        const appointmentStaff = staffMap.get(appointmentData.staffId);

        const totalPrice =
          appointmentData.totalPrice ||
          appointmentServices.reduce((sum, service) => sum + service.price, 0);

        const totalTimeframe =
          appointmentData.totalTimeframe ||
          appointmentServices.reduce(
            (sum, service) => sum + service.duration,
            0
          );

        return {
          ...appointmentData,
          no: index + 1,
          customerName: customer?.name || "Unknown Customer",
          staffName: appointmentStaff?.name || "Unknown Staff",
          services: appointmentServices,
          totalPrice,
          totalTimeframe,
          date: appointmentData.startTime.split("T")[0],
        } as AppointmentTableRow;
      });
    } catch (error) {
      console.error("Error fetching appointments by customer:", error);
      throw new Error("Failed to fetch customer appointments");
    }
  }

  // Fetch appointments by status
  static async getAppointmentsByStatus(
    status: Appointment["status"]
  ): Promise<AppointmentTableRow[]> {
    try {
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("status", "==", status),
        orderBy("startTime", "desc")
      );

      const snapshot = await getDocs(appointmentsQuery);

      if (snapshot.empty) {
        return [];
      }

      // Use the main method to get full data
      const allAppointments = await this.getAppointmentsWithDetails();
      return allAppointments.filter(
        (appointment) => appointment.status === status
      );
    } catch (error) {
      console.error("Error fetching appointments by status:", error);
      throw new Error("Failed to fetch appointments by status");
    }
  }

  // Helper methods for fetching related data
  private static async getCustomerById(
    customerId: string
  ): Promise<Customer | null> {
    try {
      const customerDoc = await getDoc(doc(db, "customers", customerId));
      if (customerDoc.exists()) {
        return { id: customerDoc.id, ...customerDoc.data() } as Customer;
      }
      return null;
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  }

  private static async getServicesByIds(
    serviceIds: string[]
  ): Promise<Service[]> {
    if (serviceIds.length === 0) return [];

    try {
      const services = await Promise.all(
        serviceIds.map(async (id) => {
          const serviceDoc = await getDoc(doc(db, "services", id));
          if (serviceDoc.exists()) {
            return { id: serviceDoc.id, ...serviceDoc.data() } as Service;
          }
          return null;
        })
      );

      return services.filter(Boolean) as Service[];
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  }

  private static async getStaffByIds(staffIds: string[]): Promise<Staff[]> {
    if (staffIds.length === 0) return [];

    try {
      const staff = await Promise.all(
        staffIds.map(async (id) => {
          const staffDoc = await getDoc(doc(db, "staff", id));
          if (staffDoc.exists()) {
            return { id: staffDoc.id, ...staffDoc.data() } as Staff;
          }
          return null;
        })
      );

      return staff.filter(Boolean) as Staff[];
    } catch (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
  }

  // Fetch all customers for filtering
  static async getAllCustomers(): Promise<Customer[]> {
    try {
      const snapshot = await getDocs(collection(db, "customers"));
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Customer)
      );
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  }

  // Fetch all services for filtering
  static async getAllServices(): Promise<Service[]> {
    try {
      const snapshot = await getDocs(collection(db, "services"));
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Service)
      );
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  }

  // Fetch all staff for filtering
  static async getAllStaff(): Promise<Staff[]> {
    try {
      const snapshot = await getDocs(collection(db, "staff"));
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Staff)
      );
    } catch (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
  }
}
