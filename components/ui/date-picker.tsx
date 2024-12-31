import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type DateRange } from "react-day-picker"

interface BaseDatePickerProps {
  placeholder?: string
  className?: string
  disabled?: boolean | ((date: Date) => boolean)
  showWeekNumber?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  defaultMonth?: Date
  numberOfMonths?: number
  fromDate?: Date
  toDate?: Date
  captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years"
  fixedWeeks?: boolean
  showOutsideDays?: boolean
  ISOWeek?: boolean
  required?: boolean
}

interface SingleDatePickerProps extends BaseDatePickerProps {
  mode: "single"
  date?: Date
  onSelect?: (date: Date | undefined) => void
  selected?: Date
}

interface RangeDatePickerProps extends BaseDatePickerProps {
  mode: "range"
  date?: never
  onSelect?: (date: DateRange | undefined) => void
  selected?: DateRange
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps

export function DatePicker(props: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = React.useCallback(
    (value: Date | DateRange | undefined) => {
      props.onSelect?.(value as any)
      setIsOpen(false)
    },
    [props.onSelect]
  )

  const displayDate = props.mode === "single" ? props.date : undefined
  const displayText = React.useMemo(() => {
    if (props.mode === "single" && props.date) {
      return format(new Date(props.date), "PPP")
    }
    if (props.mode === "range" && props.selected) {
      const { from, to } = props.selected
      if (from && to) {
        return `${format(new Date(from), "PP")} - ${format(new Date(to), "PP")}`
      }
    }
    return props.placeholder || "Pick a date"
  }, [props.mode, props.date, props.selected, props.placeholder])

  const calendarProps = {
    disabled: props.disabled,
    initialFocus: true,
    showWeekNumber: props.showWeekNumber,
    weekStartsOn: props.weekStartsOn || 1,
    defaultMonth: props.defaultMonth,
    numberOfMonths: props.numberOfMonths || 1,
    fromDate: props.fromDate,
    toDate: props.toDate,
    captionLayout: props.captionLayout || "dropdown",
    fixedWeeks: props.fixedWeeks,
    showOutsideDays: props.showOutsideDays ?? true,
    ISOWeek: props.ISOWeek,
    className: cn(
      "rounded-md border shadow-sm bg-popover p-3",
      props.mode === "range" && "min-w-[550px]"
    ),
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayDate && "text-muted-foreground",
            props.className
          )}
          disabled={props.disabled === true}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {displayText}
          {props.required && !displayDate && <span className="text-destructive ml-1">*</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-auto p-0",
          props.mode === "range" && "min-w-[550px]"
        )} 
        align="start"
      >
        {props.mode === "single" ? (
          <Calendar
            mode="single"
            selected={props.date}
            onSelect={handleSelect}
            {...calendarProps}
          />
        ) : (
          <Calendar
            mode="range"
            selected={props.selected}
            onSelect={handleSelect}
            {...calendarProps}
          />
        )}
      </PopoverContent>
    </Popover>
  )
} 