"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StaffMember } from "./types";
import { cn } from "@/lib/utils"; // optional utility for conditional classes

interface Service {
    id: string;
    name: string;
}

interface StaffModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    staffMember: StaffMember | null;
    onSave: (staffData: Partial<StaffMember> & { password?: string }) => void;
    services: Service[];
}

// 1️⃣ Zod schema for validation
const staffSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    services: z.array(z.string()).optional(),
    image: z.string().url("Invalid URL").optional().or(z.literal("")),
    active: z.boolean(),
    role: z.enum(["staff", "admin"]),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
});

export function StaffModal({
    isOpen,
    onOpenChange,
    staffMember,
    onSave,
    services,
}: StaffModalProps) {
    const [formData, setFormData] = useState<Partial<StaffMember> & { password?: string }>({
        name: "",
        email: "",
        phone: "",
        services: [],
        image: "",
        active: true,
        role: "staff",
        password: "",
    });

    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (staffMember) {
            setFormData({
                id: staffMember.id,
                name: staffMember.name,
                email: staffMember.email,
                phone: staffMember.phone,
                services: staffMember.services,
                image: staffMember.image || "",
                active: staffMember.active,
                role: staffMember.role,
            });
            setSelectedServices(staffMember.services || []);
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                services: [],
                image: "",
                active: true,
                role: "staff",
                password: "",
            });
            setSelectedServices([]);
        }
        setErrors({});
    }, [staffMember]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" })); // clear error on change
    };

    const handleServiceToggle = (serviceId: string) => {
        const updatedServices = selectedServices.includes(serviceId)
            ? selectedServices.filter((s) => s !== serviceId)
            : [...selectedServices, serviceId];

        setSelectedServices(updatedServices);
        setFormData((prev) => ({ ...prev, services: updatedServices }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = { ...formData, services: selectedServices };

        if (staffMember) {
            // Edit mode: ensure ID is included
            submitData.id = staffMember.id;
            // Remove password if empty or unchanged
            if (!submitData.password) {
                delete submitData.password;
            }
        } else {
            // New staff: ensure ID is not included
            delete submitData.id;
        }

        const result = staffSchema.safeParse(submitData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path.length > 0) {
                    fieldErrors[err.path[0]] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        onSave({ id: submitData.id, ...result.data });
        onOpenChange(false);
        console.log("SUBMIT DATA", result.data);
    };


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{staffMember ? "Edit Staff" : "Add Staff"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Staff Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Staff Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Enter staff name here..."
                            required
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Enter staff e-mail address here..."
                            required
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Enter staff phone number here..."
                            required
                        />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    {/* Password - Only show for new staff */}
                    {!staffMember && (
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="Enter password for user account..."
                                required
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>
                    )}

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input
                            id="image"
                            value={formData.image}
                            onChange={(e) => handleChange("image", e.target.value)}
                            placeholder="Enter image URL..."
                        />
                        {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: "staff" | "admin") => handleChange("role", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={formData.active}
                            onCheckedChange={(checked) => handleChange("active", checked)}
                        />
                        <Label htmlFor="active">Active (Set staff availability)</Label>
                    </div>

                    {/* Services - Multi-select */}
                    <div className="space-y-2">
                        <Label>Services</Label>
                        <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                            {services.length === 0 ? (
                                <p className="text-sm text-gray-500">No services available</p>
                            ) : (
                                <div className="space-y-2">
                                    {services.map((service) => (
                                        <div key={service.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={service.id}
                                                checked={selectedServices.includes(service.id)}
                                                onCheckedChange={() => handleServiceToggle(service.id)}
                                            />
                                            <Label
                                                htmlFor={service.id}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {service.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.services && (
                            <p className="text-xs text-red-500">{errors.services}</p>
                        )}
                        {selectedServices.length > 0 && (
                            <p className="text-xs text-gray-600">
                                Selected:{" "}
                                {services
                                    .filter((service) => selectedServices.includes(service.id))
                                    .map((service) => service.name)
                                    .join(", ")}
                            </p>
                        )}
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
