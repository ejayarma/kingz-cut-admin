"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState } from "react";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    location: z.string().min(2, { message: "Location is required." }),
    website: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
    whatsapp: z.string().url({ message: "Please enter a valid WhatsApp URL" }).or(z.literal("")),
    facebook: z.string().url({ message: "Please enter a valid Facebook URL" }).or(z.literal("")),
    x: z.string().url({ message: "Please enter a valid X URL" }).or(z.literal("")),
    instagram: z.string().url({ message: "Please enter a valid Instagram URL" }).or(z.literal("")),
    youtube: z.string().url({ message: "Please enter a valid YouTube URL" }).or(z.literal("")),
    phone: z.string().min(1, { message: "Phone number is required." }),
    hours: z.string().optional(),
});

interface BusinessData {
    name: string;
    location: string;
    website: string;
    whatsapp: string;
    facebook: string;
    x: string;
    instagram: string;
    // youtube: string;
    phone: string;
    hours?: string;
}

interface BusinessDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessData: BusinessData;
    onUpdate: (data: BusinessData) => Promise<void>;
}

export default function BusinessDetailsModal({
    isOpen,
    onClose,
    businessData,
    onUpdate
}: BusinessDetailsModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: businessData,
    });

    // Update form when businessData changes
    React.useEffect(() => {
        form.reset(businessData);
    }, [businessData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            await onUpdate(values as BusinessData);
            // Modal will be closed by the parent component
        } catch (error) {
            console.error("Error updating business data:", error);
            // You might want to show a toast notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-center">Update Business Details</DialogTitle>
                    <DialogDescription className="text-center">
                        Fill in details about your salon
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <ScrollArea className="h-96 w-full">
                            <div className="p-4 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter business name here" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your location here" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your phone number" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Hours</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 10AM-10PM, Mon-Sun" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://yourwebsite.com" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="whatsapp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>WhatsApp</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://wa.me/your-number" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="facebook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facebook</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://facebook.com/yourpage" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="instagram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instagram</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://instagram.com/yourprofile" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />

                                {/* <FormField
                                    control={form.control}
                                    name="youtube"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>YouTube</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://youtube.com/yourchannel" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                /> */}

                                <FormField
                                    control={form.control}
                                    name="x"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>X (Formerly Twitter)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://x.com/yourprofile" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-left" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-teal-600 hover:bg-teal-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}