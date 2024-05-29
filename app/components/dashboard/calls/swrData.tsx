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

export default function swrData() {
  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const data = useSWR('http://localhost:3000/dealer/dashboard/calls/loader', dataFetcher, {})
  return data
}
