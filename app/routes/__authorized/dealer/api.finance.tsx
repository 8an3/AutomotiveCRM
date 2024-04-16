import { json, type LoaderFunction, type LoaderFunctionArgs } from '@remix-run/node';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { Form, Link, Outlet, useFetcher, useLoaderData, useParams, useSubmit } from "@remix-run/react";
import PaymentsCalc from './finance.blocked';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
  const Locked = await prisma.lockFinanceTerminals.findUnique({ where: { id: 1 } })
  const lockedData = Locked.locked
  const financeId = Locked.financeId
  const finance = await prisma.finance.findUnique({ where: { id: financeId } })
  // const finance = Locked.financeId

  const data = { lockedData, ...finance }
  //console.log(lockedData, finance, 'data', data)

  return data//json({ lockedData, finance })
}
