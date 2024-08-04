import React, { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Outlet,
  Link,
  useFetcher,
  useActionData,
  useSubmit,
} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();
  let result;
  // console.log(q, 'q')
  const getit = await prisma.clientfile.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      postal: true,
      province: true,
      dl: true,
      typeOfContact: true,
      timeToContact: true,
      conversationId: true,
      billingAddress: true,
      AccOrder: {
        select: {
          id: true,
          createdAt: true,
          status: true,
          updatedAt: true,
          userName: true,
          dept: true,
          userEmail: true,
          total: true,
          discount: true,
          discPer: true,
          sendToAccesories: true,
          sendToAccessories: true,
          clientfileId: true,
          AccessoriesOnOrders: {
            select: {
              id: true,
              quantity: true,
              accOrderId: true,
              accessoryId: true,
              status: true,
              orderNumber: true,
              accessory: {
                select: {
                  id: true,
                  accessoryNumber: true,
                  brand: true,
                  name: true,
                  price: true,
                  cost: true,
                  quantity: true,
                  description: true,
                  category: true,
                  subCategory: true,
                  onOrder: true,
                  distributer: true,
                  location: true,
                  note: true,
                },
              },
            },
          },
          Payments: {
            select: {
              id: true,
              accOrderId: true,
              paymentType: true,
              amountPaid: true,
              cardNum: true,
              receiptId: true,
            },
          },
        },
      },
    },
  });


  //console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(
    (result) =>
      result.firstName?.toLowerCase().includes(q) ||
      result.lastName?.toLowerCase().includes(q) ||
      result.AccOrder.id?.toLowerCase().includes(q) ||
      result.email?.toLowerCase().includes(q) ||
      result.phone?.includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}
