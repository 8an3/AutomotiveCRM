import React, { useEffect, useRef, useState } from "react"
import { Outlet, Link, useFetcher, useActionData, useSubmit, Form } from "@remix-run/react"
import { LoaderFunction, redirect } from "@remix-run/node"
import { prisma } from "~/libs"
import { getSession } from "~/sessions/auth-session.server"
import { GetUser } from "~/utils/loader.server"


export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  //q = q.toLowerCase();
  let result;
  // console.log(q, 'q')
  const getit = await prisma.workOrder.findMany({});
  //console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(
    (result) =>
      result.unit?.toLowerCase().includes(q) ||
      result.vin?.includes(q) ||
      result.tag?.toLowerCase().includes(q) ||
      result.writer?.toLowerCase().includes(q) ||
      result.location?.toLowerCase().includes(q) ||
      result.motor?.toLowerCase().includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}
