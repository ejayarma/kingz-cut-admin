
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { Bell, Search, Settings } from "lucide-react"



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
                        <Button variant="ghost" size="icon" className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
                            <Settings className="size-5 stroke-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
                            <Bell className="size-5 stroke-red-400" />
                        </Button>
                        <Avatar className="size-12">
                            <AvatarImage src="/avatar.png" />
                            <AvatarFallback className="bg-orange-200">JD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <Navbar />

            </header>

            {children}

        </section>
    )
}