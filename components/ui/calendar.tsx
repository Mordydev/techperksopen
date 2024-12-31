'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, DropdownProps } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center h-10',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: cn(
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          'h-9 flex items-center justify-center'
        ),
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
          'h-9 w-9 flex items-center justify-center',
          '[&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
          'hover:bg-accent hover:text-accent-foreground rounded-md',
          'focus:bg-accent focus:text-accent-foreground',
          'aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary/90',
          'disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed'
        ),
        day_today: cn(
          'bg-accent/50 text-accent-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground'
        ),
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_selected: 'bg-primary text-primary-foreground hover:bg-primary focus:bg-primary',
        day_hidden: 'invisible',
        day_range_end: 'rounded-r-md',
        day_range_start: 'rounded-l-md',
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
