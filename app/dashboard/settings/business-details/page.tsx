"use client"
// import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, LocateIcon, MapPin, Pen, Pencil } from "lucide-react";
import { z } from "zod"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    location: z.string().min(2, { message: "Location is required." }),
    website: z.string().url(),
    whatsapp: z.string().url(),
    facebook: z.string().url(),
    x: z.string().url(),
    instagram: z.string().url(),
})

function BusinessDetailsForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Kingz Cut Barbering Salon",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                <ScrollArea className="h-72 w-full">
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
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your website here" {...field} />
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
                                    <FormLabel>Whatsapp</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your whatsapp here" {...field} />
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
                                        <Input placeholder="Enter your facebook here" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-left" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="x"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>X (Formerly Twitter)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your x here" {...field} />
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
                                        <Input placeholder="Enter your instagram here" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-left" />
                                </FormItem>
                            )}
                        />
                    </div>
                </ScrollArea>

                <Button size={'lg'} className="float-right rounded-lg bg-teal-600 hover:bg-teal-700" type="submit">Save</Button>


            </form>
        </Form>
    )
}


export default function BusinessDetails() {
    return (
        <div>
            <h1 className="font-bold text-2xl">Business Profile</h1>

            <div className="mt-4 bg-gray-400 h-56 rounded-2xl w-full bg-cover" style={{ backgroundImage: "url('/salon-chair-coffee.png')" }}></div>

            <div className="flex justify-between items-start mt-6 ">
                <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">Kingz Cut Barbering Salon</h3>
                    <div className="mb-2 flex gap-4">
                        <MapPin className="fill-black stroke-white" />
                        <span className="text-gray-500 font-light">Sowutuom, Ghana</span>
                    </div>
                    <div className="flex gap-4">
                        <Clock className="fill-black stroke-white" />
                        <span className="text-gray-500 font-light">10AM-10PM, Mon -Sun</span>
                    </div>
                </div>

                <Dialog >
                    <DialogTrigger>
                        <div className="inline-grid place-items-center bg-teal-600 hover:bg-teal-700 size-9 hover:text-white text-white rounded-full">
                            <Pencil size={16} />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                        <DialogHeader>
                            <DialogTitle className="text-center">Update Business Details</DialogTitle>
                            <DialogDescription className="text-center">
                                Fill in details about your salon
                            </DialogDescription>
                            <BusinessDetailsForm />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>




            </div>

        </div>
    )
}