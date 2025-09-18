"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(date)
  const [isOpen, setIsOpen] = React.useState(false)
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(date)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  // Sincronizar estado interno com a prop date
  React.useEffect(() => {
    setRange(date)
    setPendingRange(date)
  }, [date])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleDateChange = (newDate: DateRange | undefined) => {
    setRange(newDate)
    setPendingRange(newDate)
    
    // Clear existing timeout - nunca chamar onDateChange aqui
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // NÃO chamar onDateChange aqui - só atualizar estado visual
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    
    // Só quando o popover fecha E a range está completa
    if (!open && pendingRange?.from && pendingRange?.to) {
      // Clear any pending timeout and apply immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      onDateChange?.(pendingRange)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !range && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(range.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(range.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}