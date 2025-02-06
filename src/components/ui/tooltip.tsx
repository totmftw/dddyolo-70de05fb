// Tooltip component provides a customizable tooltip UI element using Radix UI.
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

// The TooltipProvider component wraps the tooltip elements and provides context for the tooltip.
const TooltipProvider = TooltipPrimitive.Provider;

// The Tooltip component is the root element of the tooltip and manages its state.
const Tooltip = TooltipPrimitive.Root;

// The TooltipTrigger component is used to trigger the display of the tooltip.
const TooltipTrigger = TooltipPrimitive.Trigger;

// TooltipContent component displays the tooltip content with customizable styles.
// It accepts a className prop to apply custom styles and a sideOffset prop to adjust the tooltip's position.
// The component also accepts any additional props that can be passed to the underlying Radix UI Content component.
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));

// Set the display name of the TooltipContent component to match the underlying Radix UI Content component.
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Export the tooltip components for use in other parts of the application.
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
