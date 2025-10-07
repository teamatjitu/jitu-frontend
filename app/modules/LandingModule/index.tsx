import React, { useEffect } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const LandingModule = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col">
        <p>Landing Page</p>
        <Accordion type="single" className="max-w-64" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Product Information</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Meong ipsum dolor sit amet, consectetur adipiscing elit. Meong
                felis sit amet felis pulvinar, tincidunt felis meong. Purrr
                meong curabitur tristique felis vel felis posuere, ac vulputate
                meong felis vehicula. Sed do meong eiusmod tempor incididunt ut
                labore et dolore meong magna aliqua.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Product Information</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Meong ipsum dolor sit amet, consectetur adipiscing elit. Meong
                felis sit amet felis pulvinar, tincidunt felis meong. Purrr
                meong curabitur tristique felis vel felis posuere, ac vulputate
                meong felis vehicula. Sed do meong eiusmod tempor incididunt ut
                labore et dolore meong magna aliqua.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Input className="mt-3" />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>PlaceHolder</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* {user ? (
        <Form method="post">
          <button type="submit">Sign Out</button>
        </Form>
      ) : (
        ""
      )} */}
    </main>
  );
};
