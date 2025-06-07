"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { Bell, Search, Settings, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Popover } from "@/components/ui/popover"
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from "@/utils/firebase.browser";



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                setLoading(false)
            } else {
                // User is not authenticated, redirect to login
                router.push('/login')
            }
        })

        // Cleanup subscription on unmount
        return () => unsubscribe()
    }, [router])

    const handleSettingsClick = () => {
        router.push("/dashboard/settings")
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    // If no user, the useEffect will redirect, but we return null as fallback
    if (!user) {
        return null
    }

    // Extract user initials for avatar fallback
    const getInitials = (name: string | null) => {
        if (!name) return 'U'
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
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
                        <Button
                            title="Settings"
                            onClick={handleSettingsClick}
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300"
                        >
                            <Settings className="size-5 stroke-slate-400" />
                        </Button>

                        <Popover>
                            <PopoverTrigger>
                                <div className="relative">
                                    <div className="span size-4.5 p-0.5 rounded-full absolute bg-red-500 right-0 -top-1 animate-ping"></div>
                                    <div className="span size-4.5 p-0.5 rounded-full absolute bg-red-500 right-0 -top-1 text-[10px] text-white">9+</div>
                                    <div
                                        title="Notifications"
                                        className="flex size-9 items-center justify-center text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300"
                                    >
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

                        <Popover>
                            <PopoverTrigger>
                                <Avatar className="size-12 hover:border-white hover:border-2">
                                    <AvatarImage src={user.photoURL || undefined} />
                                    <AvatarFallback className="bg-orange-200">
                                        {getInitials(user.displayName)}
                                    </AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-50 overflow-hidden rounded-lg p-4 shadow-lg bg-white"
                                sideOffset={5}
                                align="end"
                            >
                                <p className="font-bold">
                                    {user.displayName || 'User'}
                                </p>
                                <p className="font-light">
                                    {user.email}
                                </p>
                                <Button
                                    variant="outline"
                                    className="float-end mt-4"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
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