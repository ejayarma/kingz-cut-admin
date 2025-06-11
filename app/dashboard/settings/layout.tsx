"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Map URL paths to original tab values
const pathToTabValue = {
  "business-details": "businessDetails",
  "working-hours": "workingHours",
  "staff": "Staff",
  "services": "Services",
  "policies-and-rewards": "policiesAndRewards",
  "payment": "payment"
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const urlSegment = pathname.split("/").pop() || "business-details";
  // Convert URL path to original tab value
  const currentTab = pathToTabValue[urlSegment as keyof typeof pathToTabValue] || "businessDetails";

  return (
    <Tabs value={currentTab} className="w-full">
      <div className="container mx-auto py-10">
        <div className="grid place-items-center">
          <TabsList className="w-full border">
            <Link href="/dashboard/settings/business-details" className="w-full" passHref>
              <TabsTrigger className="w-full" value="businessDetails">Business Details</TabsTrigger>
            </Link>
            <Link href="/dashboard/settings/working-hours" className="w-full" passHref>
              <TabsTrigger className="w-full" value="workingHours">Working Hours</TabsTrigger>
            </Link>
            <Link href="/dashboard/settings/staff" className="w-full" passHref>
              <TabsTrigger className="w-full" value="Staff">Staff</TabsTrigger>
            </Link>
            <Link href="/dashboard/settings/services" className="w-full" passHref>
              <TabsTrigger className="w-full" value="Services">Services</TabsTrigger>
            </Link>
            <Link href="/dashboard/settings/policies-and-rewards" className="w-full" passHref>
              <TabsTrigger className="w-full" value="policiesAndRewards">Policies & Rewards</TabsTrigger>
            </Link>
            {/* <Link href="/dashboard/settings/payment" className="w-full" passHref>
              <TabsTrigger className="w-full" value="payment">Payment</TabsTrigger>
            </Link> */}
          </TabsList>
        </div>
      </div>
      <div className="mt-4 container mx-auto">
        <TabsContent value={currentTab}>{children}</TabsContent>
      </div>
    </Tabs>
  );
}