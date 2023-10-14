"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Trash } from "lucide-react";

// lib
import { cn } from "@lib/utils";

interface HandleDeleteModalProps {
  id: string;
  className?: string;
  deleteHandler: (id: string) => void;
}

export default function HandleDeleteModal({
  id,
  className,
  deleteHandler,
}: HandleDeleteModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          `w-full flex items-center justify-start border-gray-900 px-4 py-2 dark:border-gray-200`,
          className,
        )}
      >
        <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteHandler(id )}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
