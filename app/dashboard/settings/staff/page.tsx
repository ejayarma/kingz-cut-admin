"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Users, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StaffCard } from "./staff-card";
import { StaffModal } from "./staff-modal";
import { StaffMember } from "./types";
import { StaffService } from "./firebase-services";
import { Service } from "../services/types";

export default function StaffPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const staffService = new StaffService();

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [staffData, servicesData] = await Promise.all([
                staffService.getAllStaff(),
                staffService.getAllServices()
            ]);

            setStaffMembers(staffData);
            setServices(servicesData);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter staff members based on search query
    const filteredStaff = staffMembers.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone.includes(searchQuery) ||
        staff.services.some(service =>
            service.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Calculate statistics
    const totalStaff = staffMembers.length;
    const activeStaff = staffMembers.filter(staff => staff.active).length;
    const inactiveStaff = totalStaff - activeStaff;
    const adminCount = staffMembers.filter(staff => staff.role === 'admin').length;

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
    const handleDeleteStaff = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this staff member? This will also delete their user account.')) {
            try {
                await staffService.deleteStaff(id);
                setStaffMembers(prevStaff => prevStaff.filter(staff => staff.id !== id));
            } catch (error) {
                console.error('Error deleting staff:', error);
                alert('Failed to delete staff member. Please try again.');
            }
        }
    };

    // Handle form submission
    const handleSaveStaff = async (staffData: Partial<StaffMember> & { password?: string }) => {
        try {
            if (staffData.id) {
                // Update existing staff member
                console.log('UPDATING STAFF');

                await staffService.updateStaff(staffData.id, staffData);
                setStaffMembers(prevStaff =>
                    prevStaff.map(staff =>
                        staff.id === staffData.id
                            ? { ...staff, ...staffData, updatedAt: new Date().toISOString() }
                            : staff
                    )
                );
            } else {
                // Add new staff member
                console.log('CREATING STAFF STAFF');
                const newStaff = await staffService.createStaff({
                    name: staffData.name || "",
                    email: staffData.email || "",
                    phone: staffData.phone || "",
                    services: staffData.services || [],
                    image: staffData.image,
                    active: staffData.active ?? true,
                    role: staffData.role || "staff",
                    password: staffData.password || ""
                });
                setStaffMembers(prev => [newStaff, ...prev]);
            }
        } catch (error) {
            console.error('Error saving staff:', error);
            alert('Failed to save staff member. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading staff data...</p>
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
        <div className="container mx-auto p-6">
            {/* Header with statistics */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Staff Management</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                                <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center">
                            <UserCheck className="h-8 w-8 text-green-600" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-gray-900">{activeStaff}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center">
                            <UserX className="h-8 w-8 text-red-600" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Inactive</p>
                                <p className="text-2xl font-bold text-gray-900">{inactiveStaff}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Admins</p>
                                <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        className="pl-10 w-64 bg-gray-50 border-none"
                        placeholder="Search staff by name, email, phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    {searchQuery && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {filteredStaff.length} of {totalStaff} staff
                        </Badge>
                    )}
                    <Button
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={handleAddStaff}
                    >
                        <Plus size={18} className="mr-2" />
                        Add Staff
                    </Button>
                </div>
            </div>

            {/* Staff grid */}
            {filteredStaff.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {searchQuery ? 'No staff found' : 'No staff members'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'Get started by adding your first staff member.'
                        }
                    </p>
                    {!searchQuery && (
                        <div className="mt-6">
                            <Button
                                className="bg-teal-600 hover:bg-teal-700"
                                onClick={handleAddStaff}
                            >
                                <Plus size={18} className="mr-2" />
                                Add Staff
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStaff.map((staff) => (
                        <StaffCard
                            key={staff.id}
                            staff={staff}
                            services={services}
                            onEdit={handleEditStaff}
                            onDelete={handleDeleteStaff}
                        />
                    ))}
                </div>
            )}

            {/* Staff Modal */}
            <StaffModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                staffMember={currentStaff}
                onSave={handleSaveStaff}
                services={services}
            />
        </div>
    );
}