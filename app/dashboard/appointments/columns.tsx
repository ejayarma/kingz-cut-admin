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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { formatDateStr } from "@/lib/utils"

export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export type Appointment = {
    no: number;
    customerName: string;
    date: string;
    startTime: string;
    endTime: string;
    amount: number;
    services: { name: string; price: number }[];
    status: "cancelled" | "absent" | "done" | "booked";
};
export type Service = {
    id: string;
    name: string;
    price: number;
};
export type ServicesList = {
    [key: string]: Service;
};
export const servicesList: ServicesList = {
    "1": { id: "1", name: "Service 1", price: 100 },
    "2": { id: "2", name: "Service 2", price: 200 },
    "3": { id: "3", name: "Service 3", price: 300 },
    "4": { id: "4", name: "Service 4", price: 400 },
    "5": { id: "5", name: "Service 5", price: 500 },
    "6": { id: "6", name: "Service 6", price: 600 },
    "7": { id: "7", name: "Service 7", price: 700 },
    "8": { id: "8", name: "Service 8", price: 800 },
    "9": { id: "9", name: "Service 9", price: 900 },
    "10": { id: "10", name: "Service 10", price: 1000 },
    "11": { id: "11", name: "Service 11", price: 1100 },
    "12": { id: "12", name: "Service 12", price: 1200 },
    "13": { id: "13", name: "Service 13", price: 1300 },
    "14": { id: "14", name: "Service 14", price: 1400 },
    "15": { id: "15", name: "Service 15", price: 1500 },
    "16": { id: "16", name: "Service 16", price: 1600 },
    "17": { id: "17", name: "Service 17", price: 1700 },
    "18": { id: "18", name: "Service 18", price: 1800 },
    "19": { id: "19", name: "Service 19", price: 1900 },
    "20": { id: "20", name: "Service 20", price: 2000 },
    "21": { id: "21", name: "Service 21", price: 2100 },
    "22": { id: "22", name: "Service 22", price: 2200 },
    "23": { id: "23", name: "Service 23", price: 2300 },
    "24": { id: "24", name: "Service 24", price: 2400 },
    "25": { id: "25", name: "Service 25", price: 2500 },
    "26": { id: "26", name: "Service 26", price: 2600 },
}

export const columns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "no",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NO" />
        ),
    },
    {
        accessorKey: "customerName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer Name" />
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
            return <div className="">{formatDateStr(row.getValue('date'))}</div>
        },
    },
    {
        accessorKey: "startTime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Start Time" />
        ),
        cell: ({ row }) => {
            return <div className="">{formatDateStr(row.getValue('startTime'), 'h:m a')}</div>
        },
    },
    {
        accessorKey: "endTime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="End Time" />
        ),
        cell: ({ row }) => {
            return <div className="">{formatDateStr(row.getValue('endTime'), 'h:m a')}</div>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            // Define different styles for each status
            const statusColors: Record<string, string> = {
                booked: "bg-blue-100 text-blue-700",
                done: "bg-teal-100 text-teal-700",
                cancelled: "bg-red-100 text-red-700",
                absent: "bg-yellow-100 text-yellow-700",
            };

            return (
                <div className={`px-2 py-1 rounded w-full text-xs text-center font-semibold ${statusColors[status]}`}>
                    {capitalize(status)}
                </div>
            );
        },
    },

    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "GHS",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },

    },

    {
        accessorKey: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

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
                            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                            <DialogTrigger asChild>
                                <DropdownMenuItem>
                                    View Receipt
                                </DropdownMenuItem>
                            </DialogTrigger>
                            {/* <DropdownMenuSeparator /> */}
                            {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
                            {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>


                    <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                        <DialogHeader>
                            <DialogTitle className="font-bold text-center">Appointment Receipt</DialogTitle>
                            {/* <DialogDescription>
                                Anyone who has this link will be able to view this.
                            </DialogDescription> */}
                        </DialogHeader>
                        <div className="">
                            <div className="flex justify-between mb-4">
                                <Image src="/receipt-qr.png" width={100} height={100} alt="qr code" />
                                <p className="inline-flex  gap-4">
                                    <span className="text-sm font-semibold">Receipt ID</span>
                                    <span className="text-sm font-medium text-gray-500">#{payment.no}</span>
                                </p>
                            </div>
                            <div className="border rounded divide-y">
                                <div className="flex items-center justify-between px-4 py-2">
                                    <span className="text-sm font-semibold">Salon</span>
                                    <span className="text-sm font-medium text-gray-500">Kingz Cut Barbering Salon</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 ">
                                    <span className="text-sm font-semibold">Location</span>
                                    <span className="text-sm font-medium text-gray-500">Sowutuom, Ghana</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2">
                                    <span className="text-sm font-semibold">Customer Name</span>
                                    <span className="text-sm font-medium text-gray-500">{payment.customerName}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 ">
                                    <span className="text-sm font-semibold">Customer Phone</span>
                                    <span className="text-sm font-medium text-gray-500">0244 444 444</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 ">
                                    <span className="text-sm font-semibold">Booking Date</span>
                                    <span className="text-sm font-medium text-gray-500">{formatDateStr(payment.date, 'eeee • do MMM, yyyy')}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 ">
                                    <span className="text-sm font-semibold">Booking Time</span>
                                    <span className="text-sm font-medium text-gray-500">{formatDateStr(payment.startTime, 'h:m a')}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 ">
                                    <span className="text-sm font-semibold">Stylist</span>
                                    <span className="text-sm font-medium text-gray-500">Jeremy Paul</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 ">
                                    <span className="text-sm font-semibold">Services</span>
                                    <span className="text-sm font-medium text-gray-500">{payment.services.map(e => e.name).join(', ')}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
                                    <span className="text-sm font-bold">Total</span>
                                    <span className="text-sm font-bold">GHS 15.00</span>
                                </div>
                            </div>
                        </div>
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
