"use client"

import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PoliciesAndRewardsPage() {
    // State for form values
    const [cancelPolicy, setCancelPolicy] = useState<string>("")
    const [minimumNotice, setMinimumNotice] = useState<string>("")
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [numberOfWinners, setNumberOfWinners] = useState<string>("")
    const [rewardType, setRewardType] = useState<string>("")
    const [announcementDate, setAnnouncementDate] = useState<string>("")
    const [customMessage, setCustomMessage] = useState<string>("")

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Construct data object to send to API
        const formData = {
            cancelPolicy,
            minimumNotice,
            rewards: {
                startDate,
                endDate,
                numberOfWinners,
                rewardType,
                announcementDate,
                customMessage
            }
        }

        console.log("Form data:", formData)
        // Here you would typically send the data to your API
        // Example: await fetch('/api/policies', { method: 'POST', body: JSON.stringify(formData) })
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Cancellation Policy */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cancellation Policy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Period during which a customer can cancel an appointment
                            </p>
                            <Select value={cancelPolicy} onValueChange={setCancelPolicy}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="~select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24h">Up to 24 hours before</SelectItem>
                                    <SelectItem value="48h">Up to 48 hours before</SelectItem>
                                    <SelectItem value="72h">Up to 72 hours before</SelectItem>
                                    <SelectItem value="7d">Up to 7 days before</SelectItem>
                                    <SelectItem value="anytime">Anytime</SelectItem>
                                    <SelectItem value="none">No cancellations allowed</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Minimum Notice Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Minimum Notice Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Period before an available slot can be booked online
                            </p>
                            <Select value={minimumNotice} onValueChange={setMinimumNotice}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="~select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0h">No minimum notice</SelectItem>
                                    <SelectItem value="1h">1 hour before</SelectItem>
                                    <SelectItem value="2h">2 hours before</SelectItem>
                                    <SelectItem value="4h">4 hours before</SelectItem>
                                    <SelectItem value="12h">12 hours before</SelectItem>
                                    <SelectItem value="24h">24 hours before</SelectItem>
                                    <SelectItem value="48h">48 hours before</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Rewards */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Rewards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Create earning actions that allow customers to engage happily on the application
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Start Date */}
                                <div className="space-y-2">
                                    <p className="text-sm">Start Date</p>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : "~select..."}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* End Date */}
                                <div className="space-y-2">
                                    <p className="text-sm">End Date</p>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : "~select..."}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Number of Winners */}
                            <div className="mb-4">
                                <p className="text-sm mb-2">Number of Winners</p>
                                <Select value={numberOfWinners} onValueChange={setNumberOfWinners}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="~select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reward Type */}
                            <div className="mb-4">
                                <p className="text-sm mb-2">Reward type</p>
                                <Select value={rewardType} onValueChange={setRewardType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="~select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="discount">Discount</SelectItem>
                                        <SelectItem value="freeService">Free Service</SelectItem>
                                        <SelectItem value="giftCard">Gift Card</SelectItem>
                                        <SelectItem value="merchandise">Merchandise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Announcement Date */}
                            <div className="mb-4">
                                <p className="text-sm mb-2">Announcement Date</p>
                                <Select value={announcementDate} onValueChange={setAnnouncementDate}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="~select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="endDate">On End Date</SelectItem>
                                        <SelectItem value="1day">1 Day After End Date</SelectItem>
                                        <SelectItem value="1week">1 Week After End Date</SelectItem>
                                        <SelectItem value="custom">Custom Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Custom Message */}
                            <div>
                                <p className="text-sm mb-2">Custom Message</p>
                                <Textarea
                                    placeholder="Kindly enter your personalized congratulatory note for winners here..."
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    className="resize-none min-h-24"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}