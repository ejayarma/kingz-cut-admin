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
import { AppointmentTableRow } from "./types"
import { Badge } from "@/components/ui/badge"
// import { DialogTrigger } from "@/components/ui/dialog"

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        case 'confirmed':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        case 'completed':
            return 'bg-green-100 text-green-800 hover:bg-green-200'
        case 'cancelled':
            return 'bg-red-100 text-red-800 hover:bg-red-200'
        case 'noShow':
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
}

const getBookingTypeColor = (type: string) => {
    switch (type) {
        case 'homeService':
            return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        case 'walkInService':
            return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
}

export const columns: ColumnDef<AppointmentTableRow>[] = [
    {
        accessorKey: "no",
        header: "No.",
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
        // cell: ({ row }) => <div className="font-medium">{row.getValue("no")}</div>,
    },
    {
        accessorKey: "customerName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("customerName")}</div>,
    },
    {
        accessorKey: "staffName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Staff
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("staffName")}</div>,
    },
    {
        accessorKey: "services",
        header: "Services",
        cell: ({ row }) => {
            const services = row.getValue("services") as any[]
            return (
                <div className="flex flex-wrap gap-1">
                    {services?.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {service.name}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        accessorKey: "startTime",
        header: "Time",
        cell: ({ row }) => {
            const startTime = new Date(row.getValue("startTime"))
            const endTime = new Date(row.original.endTime)
            return (
                <div className="text-sm">
                    {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )
        },
    },
    {
        accessorKey: "totalTimeframe",
        header: "Duration",
        cell: ({ row }) => {
            const minutes = row.getValue("totalTimeframe") as number
            const hours = Math.floor(minutes / 60)
            const remainingMinutes = minutes % 60

            if (hours > 0) {
                return <div>{hours}h {remainingMinutes}m</div>
            }
            return <div>{minutes}m</div>
        },
    },
    {
        accessorKey: "totalPrice",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalPrice"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge className={getStatusColor(status)}>
                    {status === 'noShow' ? 'No Show' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            )
        },
    },
    {
        accessorKey: "bookingType",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("bookingType") as string
            return (
                <Badge className={getBookingTypeColor(type)}>
                    {type === 'homeService' ? 'Home Service' : 'Walk-in Service'}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
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
                                    <span className="text-sm font-medium text-gray-500">{formatDateStr(payment.startTime, 'eeee • do MMM, yyyy')}</span>
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
