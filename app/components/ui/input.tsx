import * as React from "react";

import { cn } from "~/lib/utils";
import { Search, User } from "../icons";

// interface InputProps extends React.ComponentProps<"input"> {
//   variant?: "default" | "search";
// }

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full ">
      <Search className="absolute right-3 top-1/2 -translate-y-1/5 text-muted-foreground size-4" />
      <User className="absolute left-3 top-1/2 -translate-y-1/5 text-muted-foreground size-4" />
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground font-poppins dark:bg-input/30  border-input h-9 w-full min-w-0 rounded-md border-2 bg-transparent  px-10 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        placeholder="Placeholder"
        {...props}
      />
    </div>
  );
}

export { Input };
