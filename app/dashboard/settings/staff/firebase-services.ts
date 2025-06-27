import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { StaffMember } from "./types";
import { auth, db } from "@/utils/firebase.browser";
import { Service } from "../services/types";
import { AppointmentService } from "../../appointments/appointment-service";

export class StaffService {
  private staffCollection = collection(db, "staff");
  private servicesCollection = collection(db, "services");
  private usersCollection = collection(db, "users");

  // Create a new staff member with user account
  async createStaff(
    staffData: Omit<StaffMember, "id" | "createdAt" | "updatedAt"> & {
      password: string;
    }
  ): Promise<StaffMember> {
    const now = new Date().toISOString();

    try {
      // 1️⃣ Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        staffData.email,
        staffData.password
      );

      // 2️⃣ Update user profile in Auth (displayName, photoURL)
      await updateProfile(userCredential.user, {
        displayName: staffData.name,
        photoURL: staffData.image,
      });

      // 3️⃣ Create staff document in Firestore
      const staffDocData = {
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        services: staffData.services,
        image: staffData.image,
        userId: userCredential.user.uid,
        active: staffData.active,
        role: staffData.role,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(this.staffCollection, staffDocData);

      return {
        id: docRef.id,
        ...staffDocData,
      };
    } catch (error) {
      console.error("Error creating staff:", error);
      throw error;
    }
  }

  // Update staff member and call API for Admin update
  async updateStaff(
    id: string,
    staffData: Partial<StaffMember>
  ): Promise<void> {
    const now = new Date().toISOString();

    try {
      // 1️⃣ Fetch staff document
      const staffDoc = await getDoc(doc(this.staffCollection, id));
      if (!staffDoc.exists()) {
        throw new Error("Staff member not found");
      }

      const currentStaff = staffDoc.data() as StaffMember;

      // 2️⃣ Update Firestore staff document
      const updateData = {
        ...staffData,
        updatedAt: now,
      };

      await updateDoc(doc(this.staffCollection, id), updateData);

      // 3️⃣ Call API route to update Firebase Auth user
      if (currentStaff.userId) {
        await fetch(`/api/staff/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentStaff.userId,
            updateData: {
              displayName: staffData.name,
              email: staffData.email,
              photoURL: staffData.image,
              phoneNumber: staffData.phone,
            },
          }),
        });
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  }

  // Delete staff member and associated user account
  async deleteStaff(id: string): Promise<void> {
    try {
      // Get staff data first
      const staffDoc = await getDoc(doc(this.staffCollection, id));
      if (!staffDoc.exists()) {
        throw new Error("Staff member not found");
      }

      const staffData = staffDoc.data() as StaffMember;

      // Delete staff document
      await deleteDoc(doc(this.staffCollection, id));

      // Delete user document from users collection
      if (staffData.userId) {
        const userQuery = query(
          this.usersCollection,
          where("uid", "==", staffData.userId)
        );
        const userDocs = await getDocs(userQuery);

        if (!userDocs.empty) {
          await deleteDoc(userDocs.docs[0].ref);
        }

        // Note: Deleting Firebase Auth user requires admin SDK or Cloud Functions
        // This should be handled on the backend for security reasons
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  }

  // Get all staff members
  async getAllStaff(): Promise<StaffMember[]> {
    try {
      const q = query(this.staffCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const appointments = await AppointmentService.getAppointments();

      return querySnapshot.docs.map((doc) => {
        const totalSales = appointments
          .filter(
            (appointment) =>
              appointment.staffId === doc.id &&
              appointment.status == "completed"
          )
          .reduce((sum, appointment) => sum + appointment.totalPrice, 0);

        return {
          ...doc.data(),
          id: doc.id,
          totalSales: totalSales,
        } as StaffMember;
      });
    } catch (error) {
      console.error("Error getting staff:", error);
      throw error;
    }
  }

  // Get staff member by ID
  async getStaffById(id: string): Promise<StaffMember | null> {
    try {
      const docSnap = await getDoc(doc(this.staffCollection, id));

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as StaffMember;
      }

      return null;
    } catch (error) {
      console.error("Error getting staff by ID:", error);
      throw error;
    }
  }

  // Get all services
  async getAllServices(): Promise<Service[]> {
    try {
      const q = query(
        this.servicesCollection,
        // where("active", "==", true),
        orderBy("name", "asc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Service)
      );
    } catch (error) {
      console.error("Error getting services:", error);
      throw error;
    }
  }
}
