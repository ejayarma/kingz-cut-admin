"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CustomerService } from "./customer-firebase-services";
import { Customer } from "./types";
import { createCustomerColumns } from "./columns";
import { CustomerDataTable } from "./data-table";
import { CustomerUpdateModal } from "./customer-update-modal";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

export default function CustomersPage() {
    const [data, setData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const params = useParams();
    const searchParams = useSearchParams();

    const customerService = new CustomerService();

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const fetchCustomerData = async () => {
        try {
            const customerData = await customerService.getAllCustomers();
            setData(customerData);
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setError("Failed to load customers.");
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsUpdateModalOpen(true);
    };

    const handleCustomerUpdate = (updatedCustomer: Customer) => {
        setData(prevData =>
            prevData.map(customer =>
                customer.id === updatedCustomer.id ? updatedCustomer : customer
            )
        );
    };

    const handleCloseModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedCustomer(null);
    };

    const columns = createCustomerColumns({ onUpdateCustomer: handleUpdateCustomer });

    // Calculate statistics
    const totalCustomers = data.length;
    const activeCustomers = data.filter(customer => customer.active).length;
    const inactiveCustomers = totalCustomers - activeCustomers;
    const activePercentage = totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0;

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-lg">Loading customers...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <p className="text-red-500 text-lg">{error}</p>
                        <button
                            onClick={fetchCustomerData}
                            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
                <p className="text-gray-600">Manage your customer base and track customer activity</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">
                            All registered customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently active customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Customers</CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{inactiveCustomers}</div>
                        <p className="text-xs text-muted-foreground">
                            Deactivated customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{activePercentage}%</div>
                        <p className="text-xs text-muted-foreground">
                            Customer retention rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Directory</CardTitle>
                    <CardDescription>
                        A comprehensive list of all customers with filtering and management options
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CustomerDataTable columns={columns} data={data} />
                </CardContent>
            </Card>

            {/* Update Modal */}
            {selectedCustomer && (
                <CustomerUpdateModal
                    customer={selectedCustomer}
                    isOpen={isUpdateModalOpen}
                    onClose={handleCloseModal}
                    onUpdate={handleCustomerUpdate}
                />
            )}
        </div>
    );
}