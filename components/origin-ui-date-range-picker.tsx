"use client"

import { CalendarIcon } from "lucide-react"
import {
  Button,
  DateRangePicker,
  Dialog,
  Group,
  Label,
  Popover,
  DateValue,
} from "react-aria-components"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { RangeCalendar } from "@/components/ui/calendar-rac"
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac"
import { CalendarDate } from "@internationalized/date"
import { useState, useEffect, useRef } from "react"

interface OriginUIDateRangePickerProps {
  date?: DateRange
  onDateChange?: (range: DateRange | undefined) => void
  className?: string
}

// Helper functions to convert between Date and CalendarDate
function dateToCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1, // CalendarDate months are 1-indexed
    date.getDate()
  )
}

function calendarDateToDate(calendarDate: CalendarDate): Date {
  return new Date(
    calendarDate.year,
    calendarDate.month - 1, // Date months are 0-indexed
    calendarDate.day
  )
}

export function OriginUIDateRangePicker({ 
  date, 
  onDateChange, 
  className 
}: OriginUIDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingRange, setPendingRange] = useState<{ start: DateValue; end: DateValue } | null>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Convert DateRange to DateRangePicker value format
  const value = date?.from && date?.to ? {
    start: dateToCalendarDate(date.from),
    end: dateToCalendarDate(date.to)
  } : null

  const handleChange = (newValue: { start: DateValue; end: DateValue } | null) => {
    if (!newValue || !onDateChange) return
    
    // Store the pending range
    setPendingRange(newValue)
    
    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    // If both dates are selected, debounce the update
    if (newValue.start && newValue.end) {
      debounceRef.current = setTimeout(() => {
        try {
          const fromDate = calendarDateToDate(newValue.start as CalendarDate)
          const toDate = calendarDateToDate(newValue.end as CalendarDate)
          
          onDateChange({
            from: fromDate,
            to: toDate
          })
        } catch (error) {
          console.error('Error converting date range:', error)
        }
      }, 500) // Wait 500ms after last change
    }
  }

  // Handle popover close - commit any pending range
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    
    if (!open && pendingRange && pendingRange.start && pendingRange.end && onDateChange) {
      // Clear debounce and immediately apply the change
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      
      try {
        const fromDate = calendarDateToDate(pendingRange.start as CalendarDate)
        const toDate = calendarDateToDate(pendingRange.end as CalendarDate)
        
        onDateChange({
          from: fromDate,
          to: toDate
        })
      } catch (error) {
        console.error('Error converting date range:', error)
      }
    }
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <DateRangePicker 
      className={cn("*:not-first:mt-2", className)}
      value={value}
      onChange={handleChange}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <div className="flex">
        <Group className={cn(dateInputStyle, "pe-9")}>
          <DateInput slot="start" unstyled />
          <span aria-hidden="true" className="text-muted-foreground/70 px-2">
            -
          </span>
          <DateInput slot="end" unstyled />
        </Group>
        <Button className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
          <CalendarIcon size={16} />
        </Button>
      </div>
      <Popover
        className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-md border shadow-lg outline-hidden"
        offset={4}
      >
        <Dialog className="max-h-[inherit] overflow-auto p-2">
          <RangeCalendar />
        </Dialog>
      </Popover>
    </DateRangePicker>
  )
}