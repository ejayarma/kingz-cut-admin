// firebase-services.ts
import { 
    collection, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    addDoc, 
    getDoc,
    query,
    orderBy,
    where,
    Timestamp 
} from 'firebase/firestore';
import { Customer } from './types';
import { db } from '@/utils/firebase.browser';

export class CustomerService {
    private collectionName = 'customers';

    async getAllCustomers(): Promise<Customer[]> {
        try {
            const customersRef = collection(db, this.collectionName);
            const q = query(customersRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const customers: Customer[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                customers.push({
                    id: doc.id,
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    active: data.active ?? true,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || '',
                    userId: data.userId || '',
                    image: data.image || null,
                });
            });
            
            return customers;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw new Error('Failed to fetch customers');
        }
    }

    async getCustomerById(id: string): Promise<Customer | null> {
        try {
            const customerRef = doc(db, this.collectionName, id);
            const customerSnap = await getDoc(customerRef);
            
            if (customerSnap.exists()) {
                const data = customerSnap.data();
                return {
                    id: customerSnap.id,
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    active: data.active ?? true,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || '',
                    userId: data.userId || '',
                    image: data.image || null,
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw new Error('Failed to fetch customer');
        }
    }

    async updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
        try {
            const customerRef = doc(db, this.collectionName, id);
            const updateData = {
                ...data,
                updatedAt: Timestamp.now(),
            };
            
            await updateDoc(customerRef, updateData);
        } catch (error) {
            console.error('Error updating customer:', error);
            throw new Error('Failed to update customer');
        }
    }

    async updateCustomerActiveStatus(id: string, active: boolean): Promise<void> {
        try {
            const customerRef = doc(db, this.collectionName, id);
            await updateDoc(customerRef, {
                active,
                updatedAt: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error updating customer active status:', error);
            throw new Error('Failed to update customer status');
        }
    }

    async deleteCustomer(id: string): Promise<void> {
        try {
            const customerRef = doc(db, this.collectionName, id);
            await deleteDoc(customerRef);
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw new Error('Failed to delete customer');
        }
    }

    async getActiveCustomers(): Promise<Customer[]> {
        try {
            const customersRef = collection(db, this.collectionName);
            const q = query(
                customersRef, 
                where('active', '==', true),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            const customers: Customer[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                customers.push({
                    id: doc.id,
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    active: data.active ?? true,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || '',
                    userId: data.userId || '',
                    image: data.image || null,
                });
            });
            
            return customers;
        } catch (error) {
            console.error('Error fetching active customers:', error);
            throw new Error('Failed to fetch active customers');
        }
    }
}