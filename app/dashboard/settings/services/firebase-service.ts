import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/utils/firebase.browser';
import { Service, ServiceCategory } from './types';

// Collection references
export const servicesRef = collection(db, 'services');
export const serviceCategoriesRef = collection(db, 'serviceCategories');

// Service operations
export const addService = async (serviceData: Omit<Service, 'id'>) => {
  return await addDoc(servicesRef, {
    ...serviceData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const updateService = async (serviceId: string, serviceData: Partial<Service>) => {
  const serviceDoc = doc(db, 'services', serviceId);
  return await updateDoc(serviceDoc, {
    ...serviceData,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteService = async (serviceId: string) => {
  const serviceDoc = doc(db, 'services', serviceId);
  return await deleteDoc(serviceDoc);
};

export const subscribeToServices = (
  callback: (services: Service[]) => void,
  errorCallback: (error: Error) => void
): Unsubscribe => {
  const q = query(servicesRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const servicesData: Service[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      servicesData.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Service);
    });
    callback(servicesData);
  }, errorCallback);
};

// Service Category operations
export const addServiceCategory = async (categoryData: Omit<ServiceCategory, 'id'>) => {
  return await addDoc(serviceCategoriesRef, {
    ...categoryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const updateServiceCategory = async (categoryId: string, categoryData: Partial<ServiceCategory>) => {
  const categoryDoc = doc(db, 'serviceCategories', categoryId);
  return await updateDoc(categoryDoc, {
    ...categoryData,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteServiceCategory = async (categoryId: string) => {
  const categoryDoc = doc(db, 'serviceCategories', categoryId);
  return await deleteDoc(categoryDoc);
};

export const subscribeToServiceCategories = (
  callback: (categories: ServiceCategory[]) => void,
  errorCallback: (error: Error) => void
): Unsubscribe => {
  const q = query(serviceCategoriesRef, orderBy('name', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const categoriesData: ServiceCategory[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      categoriesData.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as ServiceCategory);
    });
    callback(categoriesData);
  }, errorCallback);
};