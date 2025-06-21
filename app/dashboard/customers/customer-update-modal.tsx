"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CustomerService } from "./customer-firebase-services";
import { Customer } from "./types";
import { toast } from "sonner"; // Assuming you're using sonner for toast notifications

interface CustomerUpdateModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCustomer: Customer) => void;
}

export function CustomerUpdateModal({
  customer,
  isOpen,
  onClose,
  onUpdate,
}: CustomerUpdateModalProps) {
  const [active, setActive] = useState(customer.active);
  const [loading, setLoading] = useState(false);

  const customerService = new CustomerService();

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await customerService.updateCustomerActiveStatus(customer.id, active);

      const updatedCustomer = {
        ...customer,
        active,
        updatedAt: new Date().toISOString(),
      };

      onUpdate(updatedCustomer);
      toast.success(
        `Customer ${active ? "activated" : "deactivated"} successfully`
      );
      onClose();
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast.error("Failed to update customer status");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActive(customer.active); // Reset to original value
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Customer Status</DialogTitle>
          <DialogDescription>
            Change the active status for {customer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Switch
            id="customer-active"
            checked={active}
            onCheckedChange={setActive}
            disabled={loading}
          />
          <Label htmlFor="customer-active">
            Customer is {active ? "Active" : "Inactive"}
          </Label>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Name:</strong> {customer.name}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone || "Not provided"}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleUpdateStatus} disabled={loading}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );






}
