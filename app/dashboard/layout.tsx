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
import { auth, db } from "@/utils/firebase.browser"
import { collection, query, where, getDocs } from 'firebase/firestore'
import { StaffMember } from "./settings/staff/types"



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [staffMember, setStaffMember] = useState<StaffMember | null>(null)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState<string | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser)

                try {
                    // Check if user has a staff record with admin role
                    const staffQuery = query(
                        collection(db, 'staff'),
                        where('userId', '==', currentUser.uid),
                        where('active', '==', true)
                    )

                    const staffSnapshot = await getDocs(staffQuery)

                    if (!staffSnapshot.empty) {
                        const staffData = staffSnapshot.docs[0].data() as Omit<StaffMember, 'id'>
                        const staffMemberData: StaffMember = {
                            id: staffSnapshot.docs[0].id,
                            ...staffData
                        }

                        setStaffMember(staffMemberData)

                        // Check if user has admin role
                        if (staffMemberData.role !== 'admin') {
                            setAuthError('Access denied. Admin privileges required.')
                            setLoading(false)
                            return
                        }

                        setLoading(false)
                    } else {
                        // No staff record found
                        setAuthError('Access denied. No staff record found.')
                        setLoading(false)
                    }
                } catch (error) {
                    console.error('Error checking staff record:', error)
                    setAuthError('Error verifying access permissions.')
                    setLoading(false)
                }
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
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Checking access permissions...</p>
                </div>
            </div>
        )
    }

    // Show access denied error
    if (authError) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">{authError}</p>
                    <Button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        )
    }

    // If no user or staff member, the useEffect will handle redirects
    if (!user || !staffMember) {
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

    // Use staff member data for display, fallback to user data
    const displayName = staffMember.name || user.displayName || 'Admin'
    const displayEmail = staffMember.email || user.email || ''
    const displayImage = staffMember.image || user.photoURL

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
                                    <AvatarImage src={displayImage || undefined} />
                                    <AvatarFallback className="bg-orange-200">
                                        {getInitials(displayName)}
                                    </AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-50 overflow-hidden rounded-lg p-4 shadow-lg bg-white"
                                sideOffset={5}
                                align="end"
                            >
                                <p className="font-bold">
                                    {displayName}
                                </p>
                                <p className="font-light text-sm text-gray-600">
                                    {displayEmail}
                                </p>
                                <p className="text-xs text-green-600 font-medium mt-1">
                                    {staffMember.role.toUpperCase()}
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