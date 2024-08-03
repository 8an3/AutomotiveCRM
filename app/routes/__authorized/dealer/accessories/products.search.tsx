import React, { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users2,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Outlet, Link, useFetcher, useActionData, useSubmit } from "@remix-run/react"
import { LoaderFunction } from "@remix-run/node"
import { prisma } from "~/libs"


export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();
  let result;
  // console.log(q, 'q')
  const getit = await prisma.accessories.findMany({});
  //console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(
    (result) =>
      result.brand?.toLowerCase().includes(q) ||
      result.name?.toLowerCase().includes(q) ||
      result.category?.toLowerCase().includes(q) ||
      result.location?.toLowerCase().includes(q) ||
      result.distributer?.toLowerCase().includes(q) ||
      result.subCategory?.toLowerCase().includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}
