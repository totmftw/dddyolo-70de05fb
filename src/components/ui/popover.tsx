// Popover component provides a customizable popover UI element using Radix UI.
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
// Import the cn utility function for conditional class names.
import { cn } from "@/lib/utils";

// Define the Popover component as an alias for PopoverPrimitive.Root.
const Popover = PopoverPrimitive.Root;

// Define the PopoverTrigger component as an alias for PopoverPrimitive.Trigger.
const PopoverTrigger = PopoverPrimitive.Trigger;

// PopoverContent component displays the popover content with customizable styles.
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  // Use the PopoverPrimitive.Portal component to render the popover content in a portal.
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      // Set the ref for the PopoverPrimitive.Content component.
      ref={ref}
      // Set the alignment of the popover content (default: "center").
      align={align}
      // Set the side offset of the popover content (default: 4).
      sideOffset={sideOffset}
      // Set the class name for the popover content using the cn utility function.
      className={cn(
        // Default styles for the popover content.
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // Allow for custom class names to be added.
        className
      )}
      // Spread any additional props to the PopoverPrimitive.Content component.
      {...props}
    />
  </PopoverPrimitive.Portal>
));
// Set the display name for the PopoverContent component.
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Export the Popover, PopoverTrigger, and PopoverContent components.
export { Popover, PopoverTrigger, PopoverContent }
