"use client";

import { JSX, useState, useEffect } from "react";
import {
    Search,
    MoreVertical,
    Plus,
    Scissors,
    Diamond,
    Palette,
    Droplet,
    Clock,
    DollarSign,
    Loader2,
    Image as ImageIcon,
    Tag,
    Settings
} from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Import types and services
import { Service, ServiceCategory, IconName, ColorName } from './types';
import {
    addService,
    updateService,
    deleteService,
    subscribeToServices,
    addServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    subscribeToServiceCategories,
} from './firebase-service';

export default function ServicesPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [currentCategory, setCurrentCategory] = useState<ServiceCategory | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

    // Random fallback icons and colors
    const fallbackIcons: IconName[] = ["scissors", "diamond", "palette", "spray-can"];
    const fallbackColors: ColorName[] = ["blue", "red", "orange", "purple", "green", "pink"];

    // Get random fallback icon and color
    const getRandomFallback = () => {
        const randomIcon = fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)];
        const randomColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
        return { icon: randomIcon, color: randomColor };
    };

    // Real-time listeners
    useEffect(() => {
        const unsubscribeServices = subscribeToServices(
            (servicesData) => {
                setServices(servicesData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching services:', error);
                setLoading(false);
                toast.error("Failed to load services. Please try again.");
            }
        );

        const unsubscribeCategories = subscribeToServiceCategories(
            (categoriesData) => {
                setCategories(categoriesData);
                setCategoriesLoading(false);
            },
            (error) => {
                console.error('Error fetching categories:', error);
                setCategoriesLoading(false);
                toast.error("Failed to load categories. Please try again.");
            }
        );

        return () => {
            unsubscribeServices();
            unsubscribeCategories();
        };
    }, []);

    const handleOpenModal = (service: Service | null = null) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentService(null);
        setIsModalOpen(false);
    };

    const handleOpenCategoryModal = (category: ServiceCategory | null = null) => {
        setCurrentCategory(category);
        setIsCategoryModalOpen(true);
    };

    const handleCloseCategoryModal = () => {
        setCurrentCategory(null);
        setIsCategoryModalOpen(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const imageUrl = formData.get("imageUrl") as string;
        const categoryId = formData.get("categoryId") as string;

        const serviceData = {
            name: formData.get("serviceName") as string,
            timeframe: parseInt(formData.get("timeframe") as string),
            price: parseFloat(formData.get("price") as string),
            imageUrl: imageUrl.trim() || undefined,
            categoryId: categoryId || undefined,
        };

        try {
            if (currentService) {
                await updateService(currentService.id, serviceData);
                toast.success('Service updated successfully.');
            } else {
                await addService(serviceData);
                toast.success('Service added successfully.');
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Failed to save service. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const categoryData = {
            name: formData.get("categoryName") as string,
        };

        try {
            if (currentCategory) {
                await updateServiceCategory(currentCategory.id, categoryData);
                toast.success('Category updated successfully.');
            } else {
                await addServiceCategory(categoryData);
                toast.success('Category added successfully.');
            }
            handleCloseCategoryModal();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            await deleteService(serviceId);
            toast.success('Service deleted successfully.');
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service. Please try again.');
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category? Services using this category will have their category removed.')) {
            return;
        }

        try {
            await deleteServiceCategory(categoryId);
            toast.success('Category deleted successfully.');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category. Please try again.');
        }
    };

    // Function to get fallback icon color class
    const getIconColorClass = (color: ColorName): string => {
        const colorMap: Record<ColorName, string> = {
            "blue": "bg-blue-500",
            "red": "bg-red-500",
            "orange": "bg-orange-400",
            "purple": "bg-purple-500",
            "green": "bg-green-500",
            "pink": "bg-pink-500",
        };
        return colorMap[color] || "bg-gray-500";
    };

    // Function to render the appropriate fallback icon
    const renderFallbackIcon = (iconName: IconName, size = 24) => {
        const icons: Record<IconName, JSX.Element> = {
            "scissors": <Scissors size={size} />,
            "diamond": <Diamond size={size} />,
            "palette": <Palette size={size} />,
            "spray-can": <Droplet size={size} />
        };

        return icons[iconName] || <Scissors size={size} />;
    };

    // Function to render service image or fallback
    const renderServiceImage = (service: Service) => {
        if (service.imageUrl) {
            return (
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center mb-3 bg-gray-100">
                    <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = getRandomFallback();
                            const parent = target.parentElement;
                            if (parent) {
                                parent.className = `w-14 h-14 ${getIconColorClass(fallback.color)} rounded-full flex items-center justify-center text-white mb-3`;
                                parent.innerHTML = '';
                                const iconContainer = document.createElement('div');
                                parent.appendChild(iconContainer);
                            }
                        }}
                    />
                </div>
            );
        } else {
            const fallback = getRandomFallback();
            return (
                <div className={`w-14 h-14 ${getIconColorClass(fallback.color)} rounded-full flex items-center justify-center text-white mb-3`}>
                    {renderFallbackIcon(fallback.icon)}
                </div>
            );
        }
    };

    // Get category name by ID
    const getCategoryName = (categoryId?: string) => {
        if (!categoryId) return "Uncategorized";
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || "Unknown Category";
    };

    // Filter services based on search term and category
    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategoryFilter === "all" ||
            (selectedCategoryFilter === "uncategorized" && !service.categoryId) ||
            service.categoryId === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading || categoriesLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading services...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 items-center">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            className="pl-10 pr-4 py-2 rounded-lg"
                            placeholder="Search for service"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="uncategorized">Uncategorized</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleOpenCategoryModal()}
                        variant="outline"
                        className="border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                        <Settings size={20} className="mr-2" /> Categories
                    </Button>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                        <Plus size={20} className="mr-2" /> Add Service
                    </Button>
                </div>
            </div>

            {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {searchTerm || selectedCategoryFilter !== "all"
                            ? 'No services found matching your criteria.'
                            : 'No services available. Add your first service!'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredServices.map((service) => (
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
                                {renderServiceImage(service)}
                                <h3 className="text-lg font-semibold text-center">{service.name}</h3>
                                {service.categoryId && (
                                    <div className="flex items-center mt-2">
                                        <Tag size={14} className="text-gray-500 mr-1" />
                                        <span className="text-sm text-gray-600">{getCategoryName(service.categoryId)}</span>
                                    </div>
                                )}
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
            )}

            {/* Service Modal */}
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {currentService ? "Edit Service" : "Add Service"}
                        </DialogTitle>
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
                                disabled={saving}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                Category (optional)
                            </label>
                            <Select name="categoryId" defaultValue={currentService?.categoryId || ''}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="no-category">No Category</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                                Timeframe (in minutes)
                            </label>
                            <Input
                                id="timeframe"
                                name="timeframe"
                                type="number"
                                min="1"
                                placeholder="Enter timeframe here..."
                                defaultValue={currentService?.timeframe || ""}
                                disabled={saving}
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
                                min="0"
                                placeholder="Enter price amount here..."
                                defaultValue={currentService?.price || ""}
                                disabled={saving}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL (optional)
                            </label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    defaultValue={currentService?.imageUrl || ""}
                                    disabled={saving}
                                    className="pl-10"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty to use a random icon and color
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseModal}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Category Management Modal */}
            <Dialog open={isCategoryModalOpen} onOpenChange={handleCloseCategoryModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Manage Categories
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <form onSubmit={handleSaveCategory} className="space-y-4">
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                                    {currentCategory ? "Edit Category" : "Add New Category"}
                                </label>
                                <Input
                                    id="categoryName"
                                    name="categoryName"
                                    placeholder="Enter category name..."
                                    defaultValue={currentCategory?.name || ""}
                                    disabled={saving}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentCategory(null)}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        currentCategory ? 'Update' : 'Add'
                                    )}
                                </Button>
                            </div>
                        </form>

                        {categories.length > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Existing Categories</h4>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span>{category.name}</span>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setCurrentCategory(category)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}