import { json, redirect, } from "@remix-run/node";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/libs";


export async function loader({ params, request }: DataFunctionArgs) {
  const conversationsList = await prisma.staffChat.findMany({})

  return json({ conversationsList })
}
