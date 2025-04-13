'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
// import { TimePickerDemo } from './time-picker'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TimePickerDemo } from '@/components/time-picker'

type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

interface DaySchedule {
    dayName: WeekDay
    shortName: string
    openingTime: string | null
    closingTime: string | null
    isActive: boolean
}

export default function WorkingHoursComponent() {
    const [schedule, setSchedule] = useState<DaySchedule[]>([
        { dayName: 'Monday', shortName: 'M', openingTime: '10:00 AM', closingTime: '10:00 AM', isActive: true },
        { dayName: 'Tuesday', shortName: 'T', openingTime: null, closingTime: null, isActive: false },
        { dayName: 'Wednesday', shortName: 'W', openingTime: null, closingTime: null, isActive: false },
        { dayName: 'Thursday', shortName: 'T', openingTime: null, closingTime: null, isActive: false },
        { dayName: 'Friday', shortName: 'F', openingTime: null, closingTime: null, isActive: false },
        { dayName: 'Saturday', shortName: 'S', openingTime: null, closingTime: null, isActive: false },
        { dayName: 'Sunday', shortName: 'S', openingTime: null, closingTime: null, isActive: false },
    ])

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
                    const hasOpeningTime = updatedDay.openingTime !== null
                    const hasClosingTime = updatedDay.closingTime !== null
                    updatedDay.isActive = hasOpeningTime && hasClosingTime

                    return updatedDay
                }
                return day
            })
        )
    }

    // Handle save
    const handleSave = () => {
        console.log('Saving schedule:', schedule)
        // Here you would typically send the data to your backend
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
                    {schedule.slice(0, 5).map((day) => (
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
                        >
                            Save
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}