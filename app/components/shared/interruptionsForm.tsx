import { type LoaderArgs, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { json, redirect, } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate } from "@remix-run/react";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { getSession } from '~/sessions/auth-session.server'
import { GetUser } from "~/utils/loader.server";
import { Button, Input, Label } from "~/components/ui";
import { CommandItem, } from "~/components/ui/command"
import financeFormSchema from '~/overviewUtils/financeFormSchema';

export async function loader({ request, params }: LoaderFunction) {
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
                    <span>{notification.title}</span>
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
