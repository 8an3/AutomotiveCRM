import { type LoaderArgs, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { json, redirect, } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate } from "@remix-run/react";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { getSession } from '~/sessions/auth-session.server'
import { GetUser } from "~/utils/loader.server";
import { Button, Input, Label } from "~/components/ui";
import { CommandItem, } from "~/components/ui/command"
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';

export default function NewLeadForm() {
  const [lead, setLead] = useState([])

  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const { data, error, isLoading, isValidating } = useSWR('http://localhost:3000/dealer/notifications/newLead', dataFetcher, { refreshInterval: 15000 })
  useEffect(() => {
    if (data) {
      setLead(data);
    }
  }, [data]);

  const fetcher = useFetcher()
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  console.log(lead, 'lead')

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return (
    <div>
      {lead && lead.map((notification) => (
        <fetcher.Form method='post' key={notification.id}>
          <Button type='submit' variant='ghost' className='text-left mb-4'>
            <input type='hidden' name='id' value={notification.id} />
            <input type='hidden' name='intent' value='updateNewLead' />
            <input type='hidden' name='financeId' value={notification.financeId} />
            <input type='hidden' name='clientfileId' value={notification.clientfileId} />
            <CommandItem className="cursor-pointer hover:bg-muted/50 rounded-md">
              <ul className="grid gap-3 text-sm mt-2">
                <li className="grid grid-cols-1 items-center">
                  <span>{notification.title}</span>
                  <span className="text-muted-foreground text-xs">{notification.content}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', options)}
                  </span>
                </li>
              </ul>
            </CommandItem>
            {isValidating ? <div className="spinner" /> : null}
          </Button>
        </fetcher.Form>
      ))
      }
    </div>
  )
}
