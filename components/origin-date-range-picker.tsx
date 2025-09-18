"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import {
  Button,
  DateRangePicker,
  Dialog,
  Group,
  Label,
  Popover,
} from "react-aria-components"
import { DateRange } from "react-day-picker"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"
import type { DateRange as ReactAriaDateRange, DateValue } from "react-aria-components"

import { cn } from "@/lib/utils"
import { RangeCalendar } from "@/components/ui/calendar-rac"
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac"

interface OriginDateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
}

// Converter Date para CalendarDate
function dateToCalendarDate(date: Date): CalendarDate {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return new CalendarDate(year, month, day)
}

// Converter DateValue para Date
function dateValueToDate(dateValue: DateValue): Date {
  if ('year' in dateValue && 'month' in dateValue && 'day' in dateValue) {
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
  }
  return new Date()
}

export function OriginDateRangePicker({ 
  date, 
  onDateChange, 
  className 
}: OriginDateRangePickerProps) {
  const [internalRange, setInternalRange] = useState<ReactAriaDateRange | null>(null)

  // Sincronizar com props
  useEffect(() => {
    if (date?.from && date?.to) {
      setInternalRange({
        start: dateToCalendarDate(date.from),
        end: dateToCalendarDate(date.to)
      })
    } else {
      // Valor padrão: hoje até hoje + 7 dias
      const now = today(getLocalTimeZone())
      setInternalRange({
        start: now,
        end: now.add({ days: 7 })
      })
    }
  }, [date])

  const handleRangeChange = (value: ReactAriaDateRange | null) => {
    setInternalRange(value)
    
    if (value?.start && value?.end) {
      const newRange: DateRange = {
        from: dateValueToDate(value.start),
        to: dateValueToDate(value.end)
      }
      onDateChange?.(newRange)
    } else {
      onDateChange?.(undefined)
    }
  }

  return (
    <DateRangePicker 
      className={cn("*:not-first:mt-2", className)}
      value={internalRange}
      onChange={handleRangeChange}
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
          <RangeCalendar 
            value={internalRange}
            onChange={handleRangeChange}
          />
        </Dialog>
      </Popover>
    </DateRangePicker>
  )
}