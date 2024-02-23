import { useRootLoaderData } from "~/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useActionData,
  useNavigation,
  isRouteErrorResponse,
  useRouteError, useTransition,
  useParams,
  Form,
  useFormAction,
  useLocation,
  useFetcher,
} from "@remix-run/react";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Button, Input, Label } from "../ui";
import Sidebar from "../shared/sidebar";
//import { authenticator } from "~/services";
import financeFormSchema from "~/routes/overviewUtils/financeFormSchema";
import { searchQuotes } from "~/utils/finance/get.server";
import { model } from "~/models";
import { prisma } from "~/libs";


export async function dashboardLoader({ params, request, }) {
  const formPayload = Object.fromEntries(await request.formData());
  const searchTerm = formPayload.searchTerm
  const result = await searchQuotes(searchTerm)
  const flattenedData = result.map(record => ({
    ...record,
    ...record.dashboard,
    dashboard: undefined // remove the nested dashboard object
  }));

  return json({ result: flattenedData });

}



