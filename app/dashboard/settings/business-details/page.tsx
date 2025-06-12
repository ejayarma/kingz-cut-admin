"use client"

import { Button } from "@/components/ui/button";
import { Clock, MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/utils/firebase.browser";
import BusinessDetailsModal from "./business-modal";
import { BusinessData } from "./types";

const defaultBusinessData: BusinessData = {
    name: "Kingz Cut Barbering Salon",
    description: "",
    location: "Sowutuom, Ghana",
    website: "",
    tiktok: "",
    email: "",
    whatsapp: "",
    facebook: "",
    x: "",
    instagram: "",
    youtube: "",
    phone: "",
    hours: "10AM-10PM, Mon -Sun"
};

export default function BusinessDetails() {
    const [businessData, setBusinessData] = useState<BusinessData>(defaultBusinessData);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Fetch business data from Firebase
    const fetchBusinessData = async () => {
        try {
            setLoading(true);

            // Get the first (and only) document from the about collection
            const aboutQuery = query(collection(db, "about"), limit(1));
            const querySnapshot = await getDocs(aboutQuery);

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data() as BusinessData;
                setBusinessData({ ...defaultBusinessData, ...docData });
            } else {
                // If no document exists, create one with default data
                await createInitialDocument();
            }
        } catch (error) {
            console.error("Error fetching business data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Create initial document if none exists
    const createInitialDocument = async () => {
        try {
            const docRef = doc(db, "about", "business-info");
            await setDoc(docRef, defaultBusinessData);
            setBusinessData(defaultBusinessData);
        } catch (error) {
            console.error("Error creating initial document:", error);
        }
    };

    // Update business data
    const updateBusinessData = async (data: BusinessData) => {
        try {
            const docRef = doc(db, "about", "business-info");
            await setDoc(docRef, data, { merge: true });
            setBusinessData(data);
            setModalOpen(false);
        } catch (error) {
            console.error("Error updating business data:", error);
            throw error; // Re-throw to handle in the modal
        }
    };

    useEffect(() => {
        fetchBusinessData();
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-56 bg-gray-200 rounded-2xl w-full mb-6"></div>
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="font-bold text-2xl">Business Profile</h1>

            <div
                className="mt-4 bg-gray-400 h-56 rounded-2xl w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/salon-chair-coffee.png')" }}
            ></div>

            <div className="flex justify-between items-start mt-6">
                <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">
                        {businessData.name}
                    </h3>
                    <div className="mb-2 flex gap-4">
                        <MapPin className="fill-black stroke-white" />
                        <span className="text-gray-500 font-light">
                            {businessData.location}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Clock className="fill-black stroke-white" />
                        <span className="text-gray-500 font-light">
                            {businessData.hours}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="inline-grid place-items-center bg-teal-600 hover:bg-teal-700 size-9 hover:text-white text-white rounded-full transition-colors"
                >
                    <Pencil size={16} />
                </button>
            </div>

            <BusinessDetailsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                businessData={businessData}
                onUpdate={updateBusinessData}
            />
        </div>
    );
}