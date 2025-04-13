"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaffCard } from "./staff-card";
import { StaffModal } from "./staff-modal";
import { StaffMember } from "./types";

export default function StaffPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data for staff members
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
        {
            id: "1",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
        },
        {
            id: "2",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
        },
        {
            id: "3",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
        },
        {
            id: "4",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
        },
        {
            id: "5",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
        },
        {
            id: "6",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
        },
        {
            id: "7",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
        },
        {
            id: "8",
            name: "John Will",
            phone: "0244 4444 444",
            email: "johnwill@mail.com",
            services: ["Hair wash", "Haircuts"],
            image: "/images/avatar.jpg",
        },
    ]);

    // Available services options
    const serviceOptions = ["Hair wash", "Haircuts", "Coloring", "Styling", "Facial"];

    // Filter staff members based on search query
    const filteredStaff = staffMembers.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Open modal to add new staff
    const handleAddStaff = () => {
        setCurrentStaff(null);
        setIsModalOpen(true);
    };

    // Open modal to edit existing staff
    const handleEditStaff = (staff: StaffMember) => {
        setCurrentStaff(staff);
        setIsModalOpen(true);
    };

    // Handle staff deletion
    const handleDeleteStaff = (id: string) => {
        setStaffMembers(prevStaff => prevStaff.filter(staff => staff.id !== id));
    };

    // Handle form submission
    const handleSaveStaff = (staffData: Partial<StaffMember>) => {
        if (staffData.id) {
            // Update existing staff member
            setStaffMembers(prevStaff =>
                prevStaff.map(staff =>
                    staff.id === staffData.id
                        ? { ...staff, ...staffData }
                        : staff
                )
            );
        } else {
            // Add new staff member
            const newStaff: StaffMember = {
                id: Date.now().toString(),
                name: staffData.name || "",
                email: staffData.email || "",
                phone: staffData.phone || "",
                services: staffData.services || [],
                image: staffData.image,
            };
            setStaffMembers(prev => [...prev, newStaff]);
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header with search and add button */}
            <div className="flex justify-between items-center mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        className="pl-10 w-64 bg-gray-50 border-none"
                        placeholder="Search for staff"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleAddStaff}
                >
                    Add Staff
                </Button>
            </div>

            {/* Staff grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredStaff.map((staff) => (
                    <StaffCard
                        key={staff.id}
                        staff={staff}
                        onEdit={handleEditStaff}
                        onDelete={handleDeleteStaff}
                    />
                ))}
            </div>

            {/* Staff Modal */}
            <StaffModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                staffMember={currentStaff}
                onSave={handleSaveStaff}
                serviceOptions={serviceOptions}
            />
        </div>
    );
}