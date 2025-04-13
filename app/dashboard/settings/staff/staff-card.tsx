"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, Mail, MoreVertical } from "lucide-react";
import { StaffMember } from "./types";

interface StaffCardProps {
    staff: StaffMember;
    onEdit: (staff: StaffMember) => void;
    onDelete: (id: string) => void;
}

export function StaffCard({ staff, onEdit, onDelete }: StaffCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center relative">
            {/* Options menu */}
            <div className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(staff)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDelete(staff.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Avatar - only shown for staff with image */}
            {staff.image && (
                <div className="w-16 h-16 rounded-full mb-4 overflow-hidden">
                    <img
                        src={staff.image}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Staff name */}
            <h3 className="text-lg font-medium text-center mb-4">{staff.name}</h3>

            {/* Contact info */}
            <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-50 rounded-full p-2">
                        <Phone size={18} className="text-teal-600" />
                    </div>
                    <span className="text-gray-600">{staff.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-teal-50 rounded-full p-2">
                        <Mail size={18} className="text-teal-600" />
                    </div>
                    <span className="text-gray-600">{staff.email}</span>
                </div>
            </div>

            {/* Services */}
            <div className="w-full mt-4">
                <p className="text-gray-700">Services: {staff.services.join(", ")}</p>
            </div>
        </div>
    );
}