import * as React from 'react'
import { useSpinDelay } from 'spin-delay'
import { cn } from './utils'
import { Button, type ButtonProps } from '~/components/ui/button'
//import Icon from '~/routes/logos/hd.png'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

export const StatusButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    status: 'pending' | 'success' | 'error' | 'idle'
    message?: string | null
    spinDelay?: Parameters<typeof useSpinDelay>[1]
  }
>(({ message, status, className, children, spinDelay, ...props }, ref) => {
  const delayedPending = useSpinDelay(status === 'pending', {
    delay: 400,
    minDuration: 300,
    ...spinDelay,
  })
  const companion = {
    pending: delayedPending ? (
      <div className="inline-flex h-6 w-6 items-center justify-center">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.10876 14L9.46582 1H10.8178L5.46074 14H4.10876Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
      </div>
    ) : null,
    success: (
      <div className="inline-flex h-6 w-6 items-center justify-center">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.10876 14L9.46582 1H10.8178L5.46074 14H4.10876Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
      </div>
    ),
    error: (
      <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.10876 14L9.46582 1H10.8178L5.46074 14H4.10876Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
      </div>
    ),
    idle: null,
  }[status]

  return (
    <Button
      ref={ref}
      className={cn('flex justify-center gap-4', className)}
      {...props}
    >
      <div>{children}</div>
      {message ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{companion}</TooltipTrigger>
            <TooltipContent>{message}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        companion
      )}
    </Button>
  )
})
StatusButton.displayName = 'Button'
