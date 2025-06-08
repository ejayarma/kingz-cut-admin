'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TimePickerDemo } from '@/components/time-picker'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { db } from '@/utils/firebase.browser'

type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

interface DaySchedule {
    dayName: WeekDay
    shortName: string
    openingTime: string | null
    closingTime: string | null
    isActive: boolean
}

const defaultSchedule: DaySchedule[] = [
    { dayName: 'Monday', shortName: 'M', openingTime: null, closingTime: null, isActive: false },
    { dayName: 'Tuesday', shortName: 'T', openingTime: null, closingTime: null, isActive: false },
    { dayName: 'Wednesday', shortName: 'W', openingTime: null, closingTime: null, isActive: false },
    { dayName: 'Thursday', shortName: 'T', openingTime: null, closingTime: null, isActive: false },
    { dayName: 'Friday', shortName: 'F', openingTime: null, closingTime: null, isActive: false },
    { dayName: 'Saturday', shortName: 'S', openingTime: null, closingTime: null, isActive: false },
    { dayName: 'Sunday', shortName: 'S', openingTime: null, closingTime: null, isActive: false },
]

export default function WorkingHoursComponent() {
    const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Fetch working hours from Firebase
    const fetchWorkingHours = async () => {
        try {
            setLoading(true)
            const docRef = doc(db, 'about', 'business-info')
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data['working-hours']) {
                    setSchedule(data['working-hours'])
                } else {
                    // If working-hours field doesn't exist, use default and save it
                    await saveWorkingHours(defaultSchedule, false)
                }
            } else {
                // If document doesn't exist, create it with default working hours
                await createInitialDocument()
            }
        } catch (error) {
            console.error('Error fetching working hours:', error)
            toast.error('Failed to load working hours');
        } finally {
            setLoading(false)
        }
    }

    // Create initial document if it doesn't exist
    const createInitialDocument = async () => {
        try {
            const docRef = doc(db, 'about', 'business-info')
            await setDoc(docRef, {
                'working-hours': defaultSchedule,
                // Add other default fields if needed
                name: 'Kingz Cut Barbering Salon',
                location: 'Sowutuom, Ghana',
                website: '',
                whatsapp: '',
                facebook: '',
                x: '',
                instagram: '',
                youtube: '',
                phone: '',
                hours: '10AM-10PM, Mon-Sun'
            })
            setSchedule(defaultSchedule)
        } catch (error) {
            console.error('Error creating initial document:', error)
        }
    }

    // Save working hours to Firebase
    const saveWorkingHours = async (scheduleData: DaySchedule[], showToast: boolean = true) => {
        try {
            setSaving(true)
            const docRef = doc(db, 'about', 'business-info')

            // Update only the working-hours field
            await updateDoc(docRef, {
                'working-hours': scheduleData
            })

            if (showToast) {
                toast.success('Working hours updated successfully');

                console.log('Working hours saved successfully')
            }
        } catch (error) {
            console.error('Error saving working hours:', error)
            toast.error('Failed to save working hours');

            throw error
        } finally {
            setSaving(false)
        }
    }

    // Update a day's schedule
    const updateDaySchedule = (
        dayName: WeekDay,
        field: 'openingTime' | 'closingTime',
        value: string | null
    ) => {
        setSchedule(prevSchedule =>
            prevSchedule.map(day => {
                if (day.dayName === dayName) {
                    const updatedDay = { ...day, [field]: value }

                    // Set isActive to true only if both opening and closing times are set
                    const hasOpeningTime = updatedDay.openingTime !== null && updatedDay.openingTime !== ''
                    const hasClosingTime = updatedDay.closingTime !== null && updatedDay.closingTime !== ''
                    updatedDay.isActive = hasOpeningTime && hasClosingTime

                    return updatedDay
                }
                return day
            })
        )
    }

    // Handle save
    const handleSave = async () => {
        try {
            await saveWorkingHours(schedule)
        } catch (error) {
            // Error is already logged in saveWorkingHours
        }
    }

    // Generate formatted hours string for business profile
    const generateHoursString = (schedule: DaySchedule[]): string => {
        const activeDays = schedule.filter(day => day.isActive)
        if (activeDays.length === 0) return 'Hours not set'

        // Group consecutive days with same hours
        const grouped: { [key: string]: string[] } = {}
        activeDays.forEach(day => {
            const timeKey = `${day.openingTime}-${day.closingTime}`
            if (!grouped[timeKey]) {
                grouped[timeKey] = []
            }
            grouped[timeKey].push(day.shortName)
        })

        const hoursStrings = Object.entries(grouped).map(([time, days]) => {
            const dayString = days.length === 1 ? days[0] : `${days[0]}-${days[days.length - 1]}`
            return `${time}, ${dayString}`
        })

        return hoursStrings.join('; ')
    }

    // Update business hours string in the document when schedule changes
    useEffect(() => {
        if (!loading && schedule.some(day => day.isActive)) {
            const hoursString = generateHoursString(schedule)
            // Update the main hours field in the document
            const updateMainHours = async () => {
                try {
                    const docRef = doc(db, 'about', 'business-info')
                    await updateDoc(docRef, {
                        hours: hoursString
                    })
                } catch (error) {
                    console.error('Error updating main hours field:', error)
                }
            }
            updateMainHours()
        }
    }, [schedule, loading])

    // Load data on component mount
    useEffect(() => {
        fetchWorkingHours()
    }, [])

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-8">
                <div className="animate-pulse">
                    <div className="flex justify-center gap-2 mb-6">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="w-12 h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <Card>
                        <CardContent className="pt-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="grid grid-cols-3 items-center gap-4 mb-6">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex justify-center gap-2 mb-6">
                {schedule.map((day) => (
                    <Button
                        key={day.dayName}
                        variant={day.isActive ? "default" : "outline"}
                        className={cn(
                            "w-12 h-12",
                            day.isActive ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-100 text-gray-500",
                        )}
                        disabled={!day.isActive}
                    >
                        {day.shortName}
                    </Button>
                ))}
            </div>

            <Card>
                <CardContent className="pt-6">
                    {schedule.map((day) => (
                        <div key={day.dayName} className="grid grid-cols-3 items-center gap-4 mb-6">
                            <div className="font-medium">{day.dayName}</div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Opening time</p>
                                <TimePickerDemo
                                    value={day.openingTime}
                                    onChange={(value) => updateDaySchedule(day.dayName, 'openingTime', value)}
                                />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Closing Time</p>
                                <TimePickerDemo
                                    value={day.closingTime}
                                    onChange={(value) => updateDaySchedule(day.dayName, 'closingTime', value)}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end mt-4">
                        <Button
                            className="bg-teal-600 hover:bg-teal-700 w-40"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}