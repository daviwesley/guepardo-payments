"use client"

import { useState, useEffect } from "react"
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date"
import type { DateRange as ReactAriaDateRange } from "react-aria-components"
import { DateRange } from "react-day-picker"

import { RangeCalendar } from "@/components/ui/calendar-rac"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface SimpleDateRangePickerProps {
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

// Converter CalendarDate para Date
function calendarDateToDate(calendarDate: CalendarDate): Date {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day)
}

export function SimpleDateRangePicker({ 
  date, 
  onDateChange, 
  className 
}: SimpleDateRangePickerProps) {
  const [internalRange, setInternalRange] = useState<ReactAriaDateRange | null>(null)

  // Sincronizar com props iniciais
  useEffect(() => {
    if (date?.from && date?.to) {
      const start = dateToCalendarDate(date.from)
      const end = dateToCalendarDate(date.to)
      setInternalRange({ start, end })
    } else {
      // Valor padrão: últimos 7 dias
      const now = today(getLocalTimeZone())
      setInternalRange({
        start: now.subtract({ days: 7 }),
        end: now
      })
    }
  }, [])

  const handleRangeChange = (value: ReactAriaDateRange | null) => {
    setInternalRange(value)
    
    if (value?.start && value?.end) {
      // Garantir que start e end são CalendarDate
      const startDate = value.start instanceof CalendarDate ? value.start : new CalendarDate(value.start.year, value.start.month, value.start.day)
      const endDate = value.end instanceof CalendarDate ? value.end : new CalendarDate(value.end.year, value.end.month, value.end.day)
      
      const newRange: DateRange = {
        from: calendarDateToDate(startDate),
        to: calendarDateToDate(endDate)
      }
      onDateChange?.(newRange)
    } else {
      onDateChange?.(undefined)
    }
  }

  const formatDateRange = () => {
    if (date?.from && date?.to) {
      if (date.from.getTime() === date.to.getTime()) {
        return format(date.from, "dd/MM/yyyy", { locale: ptBR })
      }
      return `${format(date.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(date.to, "dd/MM/yyyy", { locale: ptBR })}`
    }
    return "Selecionar período"
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-[280px] justify-start text-left font-normal ${className}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <RangeCalendar
          className="rounded-md border p-2"
          value={internalRange}
          onChange={handleRangeChange}
        />
      </PopoverContent>
    </Popover>
  )
}