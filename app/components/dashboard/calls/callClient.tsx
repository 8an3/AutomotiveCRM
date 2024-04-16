import * as Dialog from "@radix-ui/react-dialog";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import { response } from "express";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import React, { useEffect, useRef, useState } from 'react';
import * as Toast from "@radix-ui/react-toast";

export let loader = dashboardLoader;



export default function CallClient() {
  const today = new Date();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Make first request
    const promise2 = fetch('/dashboard/calls', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    // Make second request
    const promise1 = fetch('/emails/send/payments', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    Promise.all([promise1, promise2])
      .then((responses) => {
        for (const response of responses) {
          console.log(`${response}: ${response}`);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
  }


  return (
    <>
      <Form method='post'>
        <button className="bg-transparent cursor-pointer">
          <input type="hidden" value='+17073834342' name='to' />
          <input type="hidden" value='+16138980992' name='from' />
          <input type='hidden' value='callClient' name='intent' />

          <PhoneOutcome />
        </button >
      </Form>
    </>
  );
}
