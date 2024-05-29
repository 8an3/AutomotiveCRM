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

export default function InterruptionsForm(interruptionsData, data) {
  const { user } = useLoaderData()
  const submit = useSubmit();

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

    </div>
  )
}
