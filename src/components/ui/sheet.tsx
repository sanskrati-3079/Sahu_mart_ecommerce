import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetTitle = DialogPrimitive.Title
export const SheetDescription = DialogPrimitive.Description

type Side = 'right' | 'left' | 'bottom'

const sideClasses: Record<Side, string> = {
  right:
    'inset-y-0 right-0 h-full w-full max-w-[440px] data-[state=open]:animate-[sheet-in-right_280ms_cubic-bezier(.2,.8,.2,1)] data-[state=closed]:animate-[sheet-out-right_200ms_ease-in]',
  left: 'inset-y-0 left-0 h-full w-[88vw] max-w-[380px] data-[state=open]:animate-[sheet-in-left_280ms_cubic-bezier(.2,.8,.2,1)] data-[state=closed]:animate-[sheet-out-left_200ms_ease-in]',
  bottom:
    'inset-x-0 bottom-0 max-h-[88vh] rounded-t-lg data-[state=open]:animate-[sheet-in-bottom_280ms_cubic-bezier(.2,.8,.2,1)] data-[state=closed]:animate-[sheet-out-bottom_200ms_ease-in]',
}

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: Side
  hideClose?: boolean
}

export const SheetContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ side = 'right', className, children, hideClose, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-charcoal/40 data-[state=closed]:animate-[fade-out_200ms] data-[state=open]:animate-[fade-in_200ms]" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn('fixed z-50 flex flex-col bg-ivory shadow-lift focus:outline-none', sideClasses[side], className)}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-charcoal transition-colors hover:bg-sage"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
)
SheetContent.displayName = 'SheetContent'
