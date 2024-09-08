import React, { useState, useEffect } from "react"
import { Link } from '@remix-run/react'
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
  Phone,
  Search,
  Settings,
  ShoppingCart,
  Truck, MessageCircle,
  Mail,
  Users2,
} from "lucide-react"

import { Badge } from "~/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination"
import { Progress } from "~/components/ui/progress"
import { Separator } from "~/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { DataFunctionArgs, LinksFunction } from "@remix-run/node"

const salesTeam = [
  {
    id: 1,
    name: 'skyler zanth',
    phone: 50,
    sms: 50,
    email: 50,
    newSales: 12,
    usedSales: 15,
    customersLate: 23,
    onGoingCust: 250,
    lost: 83,

  },
  {
    id: 2,
    name: 'Jessie',
    phone: 50,
    sms: 50,
    email: 50,
    newSales: 12,
    usedSales: 15,
    customersLate: 23,
    onGoingCust: 250,
    lost: 83,
  },
  {
    id: 3,
    name: 'Justin',
    phone: 50,
    sms: 50,
    email: 50,
    newSales: 12,
    usedSales: 15,
    customersLate: 23,
    onGoingCust: 250,
    lost: 83,
  },
  {
    id: 4,
    name: 'Corey',
    phone: 50,
    sms: 50,
    email: 50,
    newSales: 12,
    usedSales: 15,
    customersLate: 23,
    onGoingCust: 250,
    lost: 83,
  },
]

export async function loader({ params, request }: DataFunctionArgs) {
  return null
}
export default function Accessories() {
  return (
    <div>
      <Tabs defaultValue="Dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="To Order">The Numbers</TabsTrigger>
        </TabsList>
        <TabsContent value="Dashboard">
          <Card className=' w-full'>
            <CardHeader>
              <CardTitle>Overview of all sales being made in the last 7 days by who, when.</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="To Order">
          <Card className=''>
            <CardHeader>
              <CardTitle>Who's falling behing on quotes, whos excelling</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}




export const meta = () => {
  return [
    { title: "Sales Dept || ADMIN || Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};
