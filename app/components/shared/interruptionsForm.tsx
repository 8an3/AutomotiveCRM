import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect, } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate } from "@remix-run/react";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useEventSource } from "remix-utils";
import { emitter } from "~/services/emitter";
import { getSession } from '~/sessions/auth-session.server'
import { model } from "~/models";
import { toast } from "sonner";
import { useRootLoaderData } from '~/hooks/use-root-loader-data';
import { GetUser } from "~/utils/loader.server";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { Bell, BellRing, BookOpenCheck, Mail, Milestone, X } from 'lucide-react';
import { Button, Input, Label } from "~/components/ui";
import useSWR, { SWRConfig, mutate } from 'swr';
import EmailMessages from "./notifications/email";
import {
  CalendarIcon,
  CheckIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command"
import Handler from "../IFrameComp/newEmails";
import { cn } from "~/utils";
import { testInbox } from "~/components/microsoft/GraphService";
import {
  IoIosMailUnread,
  IoIosMail,
  IoMdAlert,
  IoIosArrowForward,
  IoIosArrowBack,
} from "react-icons/io";
import { prisma } from "~/libs/prisma.server";
import financeFormSchema from '~/overviewUtils/financeFormSchema';

export async function loader({ request, params }: LoaderAction) {
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  return json({ user });
};

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  return json({ user });
};

export default function InterruptionsForm(interruptionsData) {
  const { user } = useLoaderData()
  const submit = useSubmit();
  const location = useLocation();
  const pathname = location.pathname
  const fetcher = useFetcher()
  // action={pathname}
  /**onClick={() => {
                const formData = new FormData();
                formData.append("id", notification.id);
                formData.append("intent", 'updateInterruption');
                formData.append("pathname", pathname);
                formData.append("location", notification.location);
                submit(formData, { method: "post" });
              }} */
  return (
    <div>
      {interruptionsData ? (
        interruptionsData.interruptionsData.interruptionsData.map((notification) => (
          <fetcher.Form method='post' key={notification.id} >
            <Button type='submit' variant='ghost' className='text-left mb-2'          >
              <input type='hidden' name='id' value={notification.id} />
              <input type='hidden' name='intent' value='updateInterruption' />
              <input type='hidden' name='pathname' value={pathname} />
              <input type='hidden' name='location' value={notification.location} />
              <CommandItem value={notification.location} className="cursor-pointer hover:bg-[#232324] rounded-md"  >
                <ul className="grid gap-3 text-sm mt-2">
                  <li className="grid grid-cols-1 items-center ">
                    <span>{notification.location}</span>
                    <span className="text-[#909098] text-xs">
                      {notification.date}
                    </span>
                  </li>
                </ul>
              </CommandItem>
            </Button>
          </fetcher.Form>
        ))
      ) : (
        <CommandItem>No reminders to be remembered.</CommandItem>
      )}
    </div>
  )
}
