"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessDetails } from "./business-details";
import { WorkingHours } from "./working-hours";
import { Staff } from "./staff";
import { Services } from "./services";
import { PoliciesAndRewards } from "./policies-and-rewards";
import { Payment } from "./payment";

export default function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <Tabs defaultValue="businessDetails">
            <div className="container mx-auto py-10">
                <div className="grid place-items-center">
                    <TabsList className="w-full border">
                        <TabsTrigger value="businessDetails">Business Details</TabsTrigger>
                        <TabsTrigger value="workingHours">Working Hours</TabsTrigger>
                        <TabsTrigger value="Staff">Staff</TabsTrigger>
                        <TabsTrigger value="Services">Services</TabsTrigger>
                        <TabsTrigger value="policiesAndRewards">Policies & Rewards</TabsTrigger>
                        <TabsTrigger value="payment">Payment</TabsTrigger>
                    </TabsList>
                </div>
            </div>
            <div className="mt-4 container mx-auto">
                <TabsContent value="businessDetails">
                    <BusinessDetails />
                </TabsContent>
                <TabsContent value="workingHours">
                    <WorkingHours />

                </TabsContent>
                <TabsContent value="Staff">
                    <Staff />

                </TabsContent>
                <TabsContent value="Services">
                    <Services />

                </TabsContent>
                <TabsContent value="policiesAndRewards">
                    <PoliciesAndRewards />

                </TabsContent>
                <TabsContent value="payment">
                    <Payment />
                </TabsContent>
            </div>
        </Tabs>
    );
}
