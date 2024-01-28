import React from "react";

// components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import type { PartialMessageProps } from "schema/Message";
import { Card } from "@components/ui/card";
import { Separator } from "@components/ui/separator";

export default function ViewMessageComponents({
  children,
  message,
}: {
  children: React.ReactNode;
  message: PartialMessageProps;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[770px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="mr-4 text-primary">Message:</span>
            <span className="capitalize text-primary">{message?.subject}</span>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Card className=" w-full max-h-[990px] p-4 mx-auto  ">
          <div className="px-4 py-2 h-fit">
            <div className="px-1 mb-2 border-gray-800 dark:border-gray-300">
              <p className="mb-2 text-xl font-bold  dark:text-gray-300">
                <span className="mr-4 ">Name:</span>
                <span>{message?.name}</span>
              </p>
            </div>
            <Separator className="my-4" />
            <div className="px-1 mb-2 border-gray-800 dark:border-gray-300">
              <p className="mb-2 text-xl font-bold dark:text-gray-300">
                <span className="mr-4 ">Email:</span>
                <span>{message?.email}</span>
              </p>
            </div>
            <Separator className="my-4" />
            <div className="px-1 mb-2 border-gray-800 dark:border-gray-300">
              <p className="mb-2 text-xl font-bold  dark:text-gray-300">
                <span className="mr-4 ">Subject:</span>
                <span>{message?.subject}</span>
              </p>
            </div>
            <Separator className="my-4" />
            <div className="px-1 py-4 ">
              <p className="mb-2 text-xl font-bold  dark:text-gray-300">
                <span>{message?.message}</span>
              </p>
            </div>
          </div>
        </Card>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
