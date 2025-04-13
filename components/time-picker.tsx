'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimePickerProps {
    value: string | null
    onChange: (value: string | null) => void
}

export function TimePickerDemo({ value, onChange }: TimePickerProps) {
    const [open, setOpen] = React.useState(false)

    // Generate time options in 30 minute increments
    const timeOptions = React.useMemo(() => {
        const options = []
        for (let hour = 0; hour < 24; hour++) {
            for (let minute of [0, 15, 30, 45]) {
                const isPM = hour >= 12
                const displayHour = hour % 12 || 12
                const displayMinute = minute.toString().padStart(2, '0')
                const period = isPM ? 'PM' : 'AM'
                options.push(`${displayHour}:${displayMinute} ${period}`)
            }
        }
        return options
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    {value || '-select-'}
                    <Clock className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search time..." />
                    <CommandList>
                        <CommandEmpty>No time found.</CommandEmpty>
                        <CommandGroup>
                            {timeOptions.map((time) => (
                                <CommandItem
                                    key={time}
                                    value={time}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {time}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}