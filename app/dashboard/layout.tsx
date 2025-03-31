
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { Bell, Search, Settings } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Popover } from "@/components/ui/popover"
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const handleSettingsClick = () => {
        router.push("/dashboard/settings")
    }
    return (

        <section className="min-h-screen bg-gray-100">

            <header className="shadow-lg border ">
                <div className="flex items-center justify-between px-6 pt-3">
                    <div className="flex items-center gap-3">
                        <img src="/kinzcut.png" width={50} alt="" />
                        <h2 className="text-xl font-medium text-teal-700">Kingz Cut Barbering Salon</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                className="pl-10 w-60 bg-slate-200 border-0 rounded-full shadow-none"
                                placeholder="Search for something"
                            />
                        </div>
                        <Button title="Settings" onClick={handleSettingsClick} variant="ghost" size="icon" className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
                            <Settings className="size-5 stroke-slate-400" />
                        </Button>

                        <Popover >
                            <PopoverTrigger>
                                <div className="relative">
                                    <div className="span size-4.5 p-0.5 rounded-full absolute bg-red-500 right-0 -top-1 animate-ping"></div>
                                    <div className="span size-4.5 p-0.5 rounded-full absolute bg-red-500 right-0 -top-1 text-[10px] text-white">9+</div>
                                    <div title="Notifications" className="flex size-9 items-center justify-center text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
                                        <Bell className="size-5 stroke-red-400" />
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-56 overflow-hidden rounded-lg p-4 shadow-lg bg-white"
                                sideOffset={5}
                                align="end"
                            >
                                <p className="font-bold">Notifications</p>

                                <Button className="w-full mt-4">View All</Button>

                            </PopoverContent>
                        </Popover>

                        <Popover >
                            <PopoverTrigger>
                                <Avatar className="size-12 hover:border-white hover:border-2">
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback className="bg-orange-200">JD</AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-50 overflow-hidden rounded-lg p-4 shadow-lg bg-white"
                                sideOffset={5}
                                align="end"
                            >
                                <p className="font-bold">Admin</p>
                                <p className="font-light">admin@admin.com</p>
                                <Button variant="outline" className="float-end mt-4">Logout</Button>

                            </PopoverContent>
                        </Popover>

                    </div>
                </div>

                <Navbar />

            </header>

            {children}

        </section>
    )
}