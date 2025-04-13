"use client";

import { JSX, useState } from "react";
import { Search, MoreVertical, Plus, Scissors, Diamond, Palette, Droplet, Clock, DollarSign } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Define TypeScript interfaces
interface Service {
    id: number;
    name: string;
    timeframe: number;
    price: number;
    icon: string;
    color: string;
}

type IconName = "scissors" | "diamond" | "palette" | "spray-can";
type ColorName = "blue" | "red" | "orange" | "blue-600";

export default function ServicesPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [services, setServices] = useState<Service[]>([
        {
            id: 1,
            name: "Hair Cut",
            timeframe: 20,
            price: 15.00,
            icon: "scissors",
            color: "blue",
        },
        {
            id: 2,
            name: "Beard Grooming",
            timeframe: 20,
            price: 15.00,
            icon: "diamond",
            color: "red",
        },
        {
            id: 3,
            name: "Hair Coloring",
            timeframe: 20,
            price: 15.00,
            icon: "palette",
            color: "orange",
        },
        {
            id: 4,
            name: "Wash & Styling",
            timeframe: 20,
            price: 15.00,
            icon: "spray-can",
            color: "blue-600",
        },
    ]);

    const handleOpenModal = (service: Service | null = null) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentService(null);
        setIsModalOpen(false);
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newService: Service = {
            id: currentService ? currentService.id : Date.now(),
            name: formData.get("serviceName") as string,
            timeframe: parseInt(formData.get("timeframe") as string),
            price: parseFloat(formData.get("price") as string),
            icon: formData.get("icon") as string,
            color: formData.get("color") as string,
        };

        if (currentService) {
            // Edit existing service
            setServices(
                services.map((service) =>
                    service.id === currentService.id ? newService : service
                )
            );
        } else {
            // Add new service
            setServices([...services, newService]);
        }

        handleCloseModal();
    };

    const handleDelete = (serviceId: number) => {
        setServices(services.filter((service) => service.id !== serviceId));
    };

    // Function to get icon color class
    const getIconColorClass = (color: string): string => {
        const colorMap: Record<ColorName, string> = {
            "blue": "bg-blue-500",
            "red": "bg-red-500",
            "orange": "bg-orange-400",
            "blue-600": "bg-blue-600",
        };
        return colorMap[color as ColorName] || "bg-gray-500";
    };

    // Function to render the appropriate icon
    const renderIcon = (iconName: string, size = 24) => {
        const icons: Record<IconName, JSX.Element> = {
            "scissors": <Scissors size={size} />,
            "diamond": <Diamond size={size} />,
            "palette": <Palette size={size} />,
            "spray-can": <Droplet size={size} />
        };

        return icons[iconName as IconName] || <Scissors size={size} />;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        className="pl-10 pr-4 py-2 rounded-lg"
                        placeholder="Search for service"
                    />
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                    <Plus size={20} className="mr-2" /> Add Service
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-lg shadow-sm p-6 relative border border-gray-100">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <MoreVertical size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenModal(service)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-red-600">
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex flex-col items-center mb-4">
                            <div className={`w-14 h-14 ${getIconColorClass(service.color)} rounded-full flex items-center justify-center text-white mb-3`}>
                                {renderIcon(service.icon)}
                            </div>
                            <h3 className="text-lg font-semibold text-center">{service.name}</h3>
                        </div>

                        <div className="flex items-center mb-2">
                            <div className="bg-gray-100 rounded-full p-2 mr-3">
                                <Clock size={18} className="text-gray-600" />
                            </div>
                            <span>{service.timeframe} minutes</span>
                        </div>

                        <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full p-2 mr-3">
                                <DollarSign size={18} className="text-gray-600" />
                            </div>
                            <span>GHS {service.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">{currentService ? "Edit Service" : "Add Service"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
                                Service Name
                            </label>
                            <Input
                                id="serviceName"
                                name="serviceName"
                                placeholder="Enter service name here..."
                                defaultValue={currentService?.name || ""}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                                Timeframe (in minutes)
                            </label>
                            <Input
                                id="timeframe"
                                name="timeframe"
                                type="number"
                                placeholder="Enter timeframe here..."
                                defaultValue={currentService?.timeframe || ""}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price (in GHS)
                            </label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                placeholder="Enter price amount here..."
                                defaultValue={currentService?.price || ""}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                                Icon representation
                            </label>
                            <Select
                                name="icon"
                                defaultValue={currentService?.icon || ""}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="--select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scissors">Scissors</SelectItem>
                                    <SelectItem value="diamond">Diamond</SelectItem>
                                    <SelectItem value="palette">Palette</SelectItem>
                                    <SelectItem value="spray-can">Spray Can</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                                Colour representation
                            </label>
                            <Select
                                name="color"
                                defaultValue={currentService?.color || ""}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="--select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                    <SelectItem value="blue-600">Dark Blue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}