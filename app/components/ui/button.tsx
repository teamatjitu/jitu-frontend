import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "border-2 border-[#808080] hover:border-gray-300 disabled:border-gray-100 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 text-gray-0 disabled:text-gray-50",
        blue: "border-2 border-blue-50 hover:border-[#BDD9FF] disabled:border-[#D0E4FF] bg-blue-500 hover:bg-blue-100 disabled:bg-blue-50 text-gray-0 disabled:text-gray-50",
        yellow: "border-2 border-[#FFDE81] hover:border-[#FFE8A7] disabled:border-[#FFEBB4] bg-yellow-500 hover:bg-yellow-100 disabled:bg-yellow-50 text-gray-0 disabled:text-gray-50",
        transparentWhite: "border-2 border-[#DCDCDC] disabled:border-[#CECECE] text-gray-0 hover:text-gray-300 disabled:text-gray-500",
        transparentBlack: "border-2 border-gray-700 hover:border-gray-500 disabled:border-gray-100 text-gray-700 hover:text-gray-500 disabled:text-gray-100",

        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
