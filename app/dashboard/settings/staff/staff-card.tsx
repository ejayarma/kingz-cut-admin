"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, Mail, MoreVertical, User, ExternalLink } from "lucide-react";
import { StaffMember } from "./types";
import { Service } from "../services/types";

interface StaffCardProps {
    services: Service[];
    staff: StaffMember;
    onEdit: (staff: StaffMember) => void;
    onDelete: (id: string) => void;
}

export function StaffCard({ services, staff, onEdit, onDelete }: StaffCardProps) {

    return (
        <div className={`bg-white rounded-lg shadow-sm p-6 flex flex-col items-center relative border-l-4 ${staff.active
            ? staff.role === 'admin'
                ? 'border-l-purple-500'
                : 'border-l-teal-500'
            : 'border-l-gray-300'
            }`}>
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

            {/* Status badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
                <Badge
                    variant={staff.active ? "default" : "secondary"}
                    className={`text-xs ${staff.active
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {staff.active ? "Active" : "Inactive"}
                </Badge>
                <Badge
                    variant="outline"
                    className={`text-xs ${staff.role === 'admin'
                        ? "border-purple-300 text-purple-700"
                        : "border-teal-300 text-teal-700"
                        }`}
                >
                    {staff.role === 'admin' ? 'Admin' : 'Staff'}
                </Badge>
            </div>

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full mb-4 overflow-hidden bg-gray-100 flex items-center justify-center mt-8">
                {staff.image ? (
                    <img
                        src={staff.image}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User size={24} className="text-gray-400" />
                )}
            </div>

            {/* Staff name */}
            <h3 className="text-lg font-medium text-center mb-4">{staff.name}</h3>

            {/* Contact info */}
            <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${staff.role === 'admin' ? 'bg-purple-50' : 'bg-teal-50'
                        }`}>
                        <Phone size={18} className={
                            staff.role === 'admin' ? 'text-purple-600' : 'text-teal-600'
                        } />
                    </div>
                    <span className="text-gray-600 text-sm">{staff.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${staff.role === 'admin' ? 'bg-purple-50' : 'bg-teal-50'
                        }`}>
                        <Mail size={18} className={
                            staff.role === 'admin' ? 'text-purple-600' : 'text-teal-600'
                        } />
                    </div>
                    <span className="text-gray-600 text-sm truncate">{staff.email}</span>
                </div>
            </div>

            {/* Services */}
            <div className="w-full mt-4">
                <p className="text-gray-700 text-sm mb-2">Services:</p>
                <div className="flex flex-wrap gap-1">
                    {staff.services.length > 0 ? (
                        services
                            .filter(service => staff.services.includes(service.id))
                            .map((service, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs bg-gray-100 text-gray-700"
                                >
                                    {service.name}
                                </Badge>
                            ))
                    ) : (
                        <span className="text-gray-400 text-xs">No services assigned</span>
                    )}
                </div>
            </div>

            {/* Created/Updated dates */}
            <div className="w-full mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400 space-y-1">
                    <div>Created: {new Date(staff.createdAt).toLocaleDateString()}</div>
                    <div>Updated: {new Date(staff.updatedAt).toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    );
}