"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StaffMember } from "./types";

interface StaffModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    staffMember: StaffMember | null;
    onSave: (staffData: Partial<StaffMember>) => void;
    serviceOptions: string[];
}

export function StaffModal({
    isOpen,
    onOpenChange,
    staffMember,
    onSave,
    serviceOptions,
}: StaffModalProps) {
    const [formData, setFormData] = useState<Partial<StaffMember>>({
        name: "",
        email: "",
        phone: "",
        services: [],
    });

    // Update form data when staffMember changes
    useEffect(() => {
        if (staffMember) {
            setFormData({
                id: staffMember.id,
                name: staffMember.name,
                email: staffMember.email,
                phone: staffMember.phone,
                services: staffMember.services,
                image: staffMember.image,
            });
        } else {
            // Reset form when adding new staff
            setFormData({
                name: "",
                email: "",
                phone: "",
                services: [],
            });
        }
    }, [staffMember]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleServiceChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            services: [value] // For now, only supporting one service at a time as shown in the UI
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{staffMember ? "Edit Staff" : "Add Staff"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Staff Name
                        </label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Enter staff name here..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            E-mail
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Enter staff e-mail address here..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                            Phone Number
                        </label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Enter staff phone number here..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="services" className="text-sm font-medium">
                            Services
                        </label>
                        <Select
                            value={formData.services?.[0]}
                            onValueChange={handleServiceChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="-select" />
                            </SelectTrigger>
                            <SelectContent>
                                {serviceOptions.map((service) => (
                                    <SelectItem key={service} value={service}>
                                        {service}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}