"use client";

import * as React from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";

import { cn, composeEventHandlers } from "@lib/utils";
import {
  Button,
  buttonVariants,
} from "@components/ui/button";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: "create" | "update" | "delete";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, variant, size, action, ...props }, ref) => {
    const { pending } = useFormStatus();
    const [buttonAction, setButtonAction] = React.useState<
      "update" | "delete" | "create"
    >("create");

    return (
      <Button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={pending}
        {...props}
        onClick={composeEventHandlers(props.onClick, () => {
          if (!props.disabled) {
            setButtonAction(action);
          }
        })}
      >
        {buttonAction === action && pending && (
          <ReloadIcon className="mr-2 animate-spin size-4" aria-hidden="true" />
        )}

        {children}
      </Button>
    );
  },
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
