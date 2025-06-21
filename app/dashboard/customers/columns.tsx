"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { capitalize } from "lodash-es";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Customer } from "./types";

interface ColumnsProps {
    onUpdateCustomer: (customer: Customer) => void;
}

export const createCustomerColumns = ({ onUpdateCustomer }: ColumnsProps): ColumnDef<Customer>[] => [
    {
        id: "row-number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NO" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer Name" />
        ),
        cell: ({ row }) => {
            const name = row.getValue("name") as string;
            return <div className="font-medium">{name || "N/A"}</div>;
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            return <div className="lowercase">{email || "N/A"}</div>;
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string;
            return <div>{phone || "Not provided"}</div>;
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Joined Date" />
        ),
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as string;
            try {
                const date = new Date(createdAt);
                return <div>{format(date, "MMM dd, yyyy")}</div>;
            } catch {
                return <div>Invalid date</div>;
            }
        },
    },
    {
        accessorKey: "active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const active = row.getValue("active") as boolean;
            const status = active ? 'Active' : 'Inactive';

            const statusColors: Record<string, string> = {
                Active: "bg-green-100 text-green-700",
                Inactive: "bg-red-100 text-red-700",
            };

            return (
                <div className={`px-2 py-1 rounded-full w-fit text-xs font-semibold ${statusColors[status]}`}>
                    {status}
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const active = row.getValue(id) as boolean;
            if (value === "active") return active;
            if (value === "inactive") return !active;
            return true;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const customer = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUpdateCustomer(customer)}>
                            {customer.active ? (
                                <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate Customer
                                </>
                            ) : (
                                <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate Customer
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];