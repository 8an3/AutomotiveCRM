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
import { json, LoaderFunction } from "@remix-run/node"
import { prisma } from "~/libs"


export async function loader({ request, params }: LoaderFunction) {
  return await prisma.accessories.findMany();
}
