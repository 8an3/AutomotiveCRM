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
      createdAt: true,
      updatedAt: true,
      financeId: true,
      userId: true,
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
      dob: true,
      AccOrder: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          userEmail: true,
          userName: true,
          dept: true,
          sellingDept: true,
          total: true,
          discount: true,
          discPer: true,
          paid: true,
          paidDate: true,
          status: true,
          workOrderId: true,
          note: true,
          financeId: true,
          clientfileId: true,
          AccessoriesOnOrders: {
            select: {
              id: true,
              quantity: true,
              accOrderId: true,
              accessoryId: true,
              status: true,
              orderNumber: true,
              OrderInvId: true,
              service: true,
              hour: true,
              accessory: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  partNumber: true,
                  brand: true,
                  name: true,
                  price: true,
                  cost: true,
                  quantity: true,
                  minQuantity: true,
                  description: true,
                  category: true,
                  subCategory: true,
                  onOrder: true,
                  distributer: true,
                  location: true,
                  note: true,
                  workOrderSuggestion: true,
                },
              },
            },
          },
          Payments: {
            select: {
              id: true,
              createdAt: true,
              paymentType: true,
              cardType: true,
              amountPaid: true,
              cardNum: true,
              receiptId: true,
              financeId: true,
              userEmail: true,
              accOrderId: true,
              workOrderId: true,
            },
          },
          AccHandoff: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              sendTo: true,
              handOffTime: true,
              status: true,
              sendToCompleted: true,
              completedTime: true,
              notes: true,
              handOffDept: true,
                AccOrderId: true,
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
