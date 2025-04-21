"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react"
import { capitalize } from "lodash-es"
import { format, parse } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { StaffReviewsModal } from "./staff-reviews-modal"

export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export type Staff = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    rating: number;
    sales: number;
    availability: "Available" | "Unavailable";
};


export type Service = {
    id: string;
    name: string;
    price: number;
};

export const columns: ColumnDef<Staff>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NO" />
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Staff Name" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "phoneNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
    },
    {
        accessorKey: "rating",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rating" />
        ),
    },
    {
        accessorKey: "sales",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sales" />
        ),
        cell: ({ row }) => {
            const sales = parseFloat(row.getValue("sales"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "GHS",
            }).format(sales)

            return <div className="font-medium">{formatted}</div>
        },
    },

    {
        accessorKey: "availability",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Availability" />
        ),
        cell: ({ row }) => {
            const availability = row.getValue("availability") as string;

            const availColors: Record<string, string> = {
                Available: "bg-green-100 text-green-700",
                Unavailable: "bg-red-100 text-red-700",
            };

            return (
                <div className={`px-2 py-1 rounded w-1/2 text-xs text-center font-semibold ${availColors[availability]}`}>
                    {capitalize(availability)}
                </div>
            );
        },
    },

    {
        accessorKey: "Actions",
        id: "actions",
        cell: ({ row }) => {

            return (
                <Dialog >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                                <DropdownMenuItem>
                                    View Reviews
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem>
                                Mark as unavailable
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>


                    <DialogContent className="sm:max-w-3xl md:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="font-bold text-center">Customer reviews</DialogTitle>
                        </DialogHeader>
                        <StaffReviewsModal staffId={row.original.id} />

                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )
        },
    },
]
