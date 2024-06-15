
/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useNavigation, useParams, useNavigate } from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { ClientResultFunction, ClientStateFunction, } from "~/components/lists/clientResultList";
import { type DataFunctionArgs, type ActionFunction, json, type LinksFunction, redirect } from '@remix-run/node'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getDataKawasaki, getFinanceWithDashboard, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou, getFinance, getClientFileByEmail, getClientFileById } from "~/utils/finance/get.server";
import { getAllFinanceNotes } from '~/utils/financeNote/get.server';
import { getAllFinanceApts, getAllFinanceApts2 } from "~/utils/financeAppts/get.server";
import { getDocsbyUserId } from "~/utils/docTemplates/get.server";
import { getAppointmentsForFinance } from "~/utils/client/getClientAptsForFile.server";
import { Topsection } from "~/components/dashboardCustId/topSection";
import { ClientTab } from "~/components/dashboardCustId/clientTab";
import { PartsTab } from "~/components/dashboardCustId/partsTab";
import { SalesTab } from "~/components/dashboardCustId/salesTab";
import { SalesComms } from "~/components/dashboardCustId/salesComs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { updateClientFileRecord, updateFinanceWithDashboard } from "~/utils/finance/update.server";
import SaveFinanceNote from "~/components/dashboard/calls/actions/createFinanceNote";
import DeleteCustomer from "~/components/dashboard/calls/actions/DeleteCustomer";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import { updateFinanceNote } from "~/utils/financeNote/update.server";
import UpdateAppt from "~/components/dashboard/calls/actions/updateAppt";
import { getMergedFinance, getMergedFinanceOnFinance, getClientListMerged } from "~/utils/dashloader/dashloader.server";
import { getComsOverview } from "~/utils/communications/communications.server";
import { prisma } from "~/libs";
import { commitSession as commitIds, getSession as getIds, SetClient66 } from '~/utils/misc.user.server';
import { getSession } from "~/sessions/auth-session.server";
import { UpdateLeadBasic, UpdateLeadApiOnly, UpdateClientFromActivix, UpdateLeadEchangeVeh, UpdateLeadPhone, UpdateLeadWantedVeh, UpdateLeademail, CreateNote, UpdateNoteCreateTask, CompleteTask, UpdateTask, ListAllTasks, UpdateNote } from "~/routes/__authorized/dealer/api/activix";
import axios from "axios";
import { GetUser } from "~/utils/loader.server";
import base from "~/styles/base.css";
import { Cross2Icon, CaretSortIcon, CalendarIcon, ClockIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { Calendar } from '~/components/ui/calendar';
import { format } from "date-fns"
import { cn } from "~/components/ui/utils"
import harleyDavidson from '~/logos/hd.png'
import clsx from 'clsx'
import { isDate } from 'date-fns';
import { FaCheck } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
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
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
//import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, } from "~/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination"
import { Progress } from "~/components/ui/progress"
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
  Tabs, Badge,
  TabsContent,
  TabsList,
  TabsTrigger, Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, Card,
  CardContent,
  CardDescription,
  CardFooter,
  Alert,
  Debug,
  InputPassword,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
  CardHeader,
  CardTitle, Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider, Avatar,
  AvatarFallback,
  AvatarImage,
  Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup,
  RemixNavLink, Input, Separator, Button, TextArea, Label, PopoverTrigger, PopoverContent, Popover,
} from "~/components"
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { ButtonLoading } from "~/components/ui/button-loading";
import { toast } from "sonner"
import { FaMotorcycle } from "react-icons/fa";
import { ScrollArea } from "~/components/ui/scroll-area";
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"


import { ImageSelectNav } from '~/overviewUtils/imageselect'
import canamIndex from '~/logos/canamIndex.png'
import manitouIndex from '~/logos/manitouIndex.png'
import Harley from '~/components/dashboardCustId/hdIcon.png'
import second from '~/styles/second.css'
import CustomerGen from "../document/customerGen";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"

import { overviewLoader, overviewAction, financeIdLoader } from '~/components/actions/overviewActions'
import EmailSheet from '~/overviewUtils/Emails'
import FeaturePop from '~/overviewUtils/FeaturePop'
import BMWOptions from '~/overviewUtils/bmwOptions'
import ManitouOptions from '~/overviewUtils/manitouOptions'
import DisplayModel from '~/overviewUtils/modelDisplay'
import DealerFeesDisplay from '~/overviewUtils/dealerFeesDisplay'
import ContactInfoDisplay from '~/overviewUtils/contactInfoDisplay'
import ClientProfile from '~/components/dashboard/calls/actions/clientProfile'
// <Sidebar />
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { PrintSpec } from "~/overviewUtils/printSpec";
import { CiEdit } from "react-icons/ci";
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { FaSave } from "react-icons/fa";
import UnitPicker from "~/components/dashboard/unitPicker/unitPicker";

import { FaDesktop } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";

export default function Dashboard() {
  const { finance, user, clientFile, sliderWidth, aptFinance3, Coms, getTemplates, merged, clientUnit, mergedFinanceList, financeNotes, userList } = useLoaderData();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-0 hidden w-14 flex-col border-r bg-transparent sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            to="/dealer/service/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <FaDesktop className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>F
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/service/tech"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <GrUserWorker className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Orders</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Orders</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Package className="h-5 w-5" />
                <span className="sr-only">Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Customers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Customers</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbItem asChild>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-6">
              <Card className="sm:col-span-2 bg-background text-foreground" x-chunk="dashboard-05-chunk-0"  >
                <CardHeader className="flex flex-row items-start bg-muted-background rounded-md">
                  <div className="grid">
                    <CardTitle className="group flex items-center text-sm">
                      Customer Info
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm mt-2">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        First Name
                      </span>
                      <span>{finance[0].firstName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Last Name
                      </span>
                      <span> {finance[0].lastName}</span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          Phone
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance[0].phone)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance[0].phone && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance[0].phone}  </span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          Email
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance[0].email)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance[0].email && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance[0].email}  </span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          Address
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance[0].address)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance[0].address && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance[0].address}  </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        City
                      </span>
                      <span>{finance[0].city}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Postal
                      </span>
                      <span>{finance[0].postal}</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="grid grid-cols-2 justify-between items-center border-t border-border bg-muted-background px-6 py-3">
                  <div>
                    <Badge >{finance[0].customerState}</Badge>
                  </div>
                  <Dialog  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8 gap-1 ml-auto">
                        <CiEdit className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Edit Customer Info
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                      <Form method='post'>
                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>Edit Customer Profile Info</DialogTitle>
                        </DialogHeader>
                        <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
                        <div className="grid gap-3 mx-3 mb-3">
                          <div className="grid gap-3">
                            <Label htmlFor="name"> First Name</Label>
                            <Input
                              defaultValue={clientFile.firstName} name='firstName'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name"> Last Name</Label>
                            <Input
                              defaultValue={clientFile.lastName} name='lastName'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name">Phone</Label>
                            <Input
                              defaultValue={clientFile.phone} name='phone'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name">Email</Label>
                            <Input
                              defaultValue={clientFile.email} name='email'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name">Address</Label>
                            <Input
                              defaultValue={clientFile.address} name='address'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name">City</Label>
                            <Input
                              defaultValue={clientFile.city} name='city'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name">Postal Code</Label>
                            <Input
                              defaultValue={clientFile.postal} name='postal'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name">Driver's Lic.</Label>
                            <Input
                              defaultValue={clientFile.dl} name='dl'
                              type="text"
                              className="w-full bg-background border-border "
                            />
                          </div>

                        </div>
                        <input type='hidden' name='phone' defaultValue={finance[0].phone} />
                        <input type='hidden' name='email' defaultValue={finance[0].email} />
                        <input type='hidden' name='lastName' defaultValue={finance[0].lastName} />
                        <input type='hidden' name='firstName' defaultValue={finance[0].firstName} />
                        <input type='hidden' name='brand' defaultValue={finance[0].brand} />
                        <input type='hidden' name='unit' defaultValue={finance[0].model} />
                        <input type='hidden' name='brand' defaultValue={finance[0].brand} />
                        <input type='hidden' name='financeId' defaultValue={finance[0].id} />
                        <input type='hidden' name='userId' defaultValue={user.id} />
                        <input type='hidden' name='apptType' defaultValue='sales' />
                        <input type='hidden' name='min' defaultValue={minForm} />
                        <input type='hidden' name='hour' defaultValue={hourForm} />
                        <input type='hidden' name="dashboardId" defaultValue={finance[0].dashboardId} />
                        <input type='hidden' name="clientId" defaultValue={finance[0].id} />
                        <input type='hidden' name="clientfileId" defaultValue={clientFile.id} />

                        <DialogFooter className=" border-t border-border p-4  ">
                          <div className='flex justify-center' >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size='sm'
                                  className=' bg-primary'
                                >
                                  Save changes
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently change the customers profile information.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                                  <ButtonLoading
                                    size="sm"
                                    value="updateClientInfoFinance"
                                    className="w-auto cursor-pointer ml-auto mt-5 bg-primary"
                                    name="intent"
                                    type="submit"
                                    isSubmitting={isSubmitting}
                                    onClick={() => toast.success(`${finance[0].firstName}'s customer file is updated...`)}
                                    loadingText={`${data.firstName}'s customer file is updated...`}
                                  >
                                    <AlertDialogAction>Continue
                                      <PaperPlaneIcon className="h-4 w-4 ml-2" />

                                    </AlertDialogAction>
                                  </ButtonLoading>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                          </div>
                        </DialogFooter>
                      </Form>

                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1 " className="bg-background text-foreground sm:col-span-2">
                <CardHeader className="flex flex-row items-start bg-muted-background rounded-md">
                  <div className="grid ">
                    <CardTitle className="group flex items-center text-sm">
                      Current Vehichle
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='text-sm'>
                  <ul className="grid gap-3 mt-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Year
                      </span>
                      <span>{finance[0].year}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Brand
                      </span>
                      <span>{finance[0].brand}</span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          Model
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance[0].model)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance[0].model && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance[0].model}  </span>
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Color
                      </span>
                      <span>{finance[0].color}</span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          VIN
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance[0].vin)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance[0].vin && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance[0].vin}  </span>
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Current Mileage
                      </span>
                      <span>{finance[0].mileage}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Location
                      </span>
                      <span>{finance[0].location}</span>
                    </li>
                  </ul>

                </CardContent>
                <CardFooter>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="bg-background text-foreground sm:col-span-2 rounded-md flex flex-col h-full">
                <CardHeader className="flex flex-row items-start bg-muted-background">
                  <div className="grid">
                    <CardTitle className="group flex items-center text-sm">
                      Work Orders
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow !grow overflow-y-scroll overflow-x-clip mt-3">
                  <div className="max-h-[20vh] h-auto">
                    {editProgress === true && (
                      <Form method="post">
                        {items

                          .map((item) => {
                            const isChecked =
                              item.value === 'on' ||
                              new Date(item.value) > new Date('2022-01-01');
                            return (
                              <div key={item.name} className="flex justify-between items-center mt-1 mr-1">
                                <label htmlFor={item.name}>{item.label}</label>
                                <IndeterminateCheckbox
                                  name={item.name}
                                  indeterminate={checkedItems[item.name] === undefined && isChecked}
                                  checked={checkedItems[item.name] ?? isChecked}
                                  onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
                                  className="border-[#c72323]"
                                />
                              </div>
                            );
                          })}
                        <input type="hidden" defaultValue={finance[0].id} name="financeId" />

                        <ButtonLoading
                          size="sm"
                          value="dealProgress"
                          className="w-auto cursor-pointer ml-auto mt-5 mb-5 bg-primary"
                          name="intent"
                          type="submit"
                          isSubmitting={isSubmitting}
                          onClick={() => toast.success(`${finance[0].firstName}'s customer file is updated...`)}
                          loadingText={`${data.firstName}'s customer file is updated...`}
                        >
                          Save
                          <FaSave className="h-4 w-4 ml-2" />
                        </ButtonLoading>
                      </Form>
                    )}
                    {editProgress === false && (
                      items
                        .filter((item) => {
                          const isChecked =
                            item.value === 'on' ||
                            (isDate(new Date(item.value)) && new Date(item.value) > new Date('2022-01-01'));
                          return checkedItems[item.name] ?? isChecked;
                        })
                        .map((item) => {
                          const isChecked =
                            item.value === 'on' ||
                            (isDate(new Date(item.value)) && new Date(item.value) > new Date('2022-01-01'));
                          return (
                            <div key={item.name} className="flex justify-between items-center mt-1 mr-1">
                              <label htmlFor={item.name}>{item.label}</label>
                              <IndeterminateCheckbox
                                name={item.name}
                                indeterminate={checkedItems[item.name] === undefined && isChecked}
                                checked={checkedItems[item.name] ?? isChecked}
                                onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
                                className="border-[#c72323]"
                              />
                            </div>
                          );
                        })
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-self-end flex-row items-center border-t border-border bg-muted-background px-6 py-3">
                  <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => handleProgressUnits()}>
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Edit Progress
                    </span>
                  </Button>
                </CardFooter>
              </Card>

            </div>
            <Tabs defaultValue="Workorder">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="Workorder">Workorder</TabsTrigger>
                  <TabsTrigger value="Parts">Parts</TabsTrigger>
                  <TabsTrigger value="Warranty">Warranty</TabsTrigger>
                  <TabsTrigger value="Tech">Tech</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Declined
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Refunded
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="Workorder">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Workorder</CardTitle>
                    <CardDescription>
                      Current workorder. Where you add jobs for techinician to complete
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2'>
                      <div className="relative hidden flex-col items-start gap-8 md:flex">
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                          <legend className="-ml-1 px-1 text-sm font-medium">Add Jobs To Workorder</legend>
                          <div className="grid gap-3">
                            <Label htmlFor="content">Search By Job Code</Label>
                            <Input name='jobCode' />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="content">Search By Job Code Name</Label>
                            <Input name='jobCode' />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="content">Custom Entry</Label>
                            <TextArea
                              id="content"
                              placeholder="Type job here..."
                              className="min-h-[9.5rem]"
                            />
                          </div>
                        </fieldset>
                      </div>

                      <div className="relative hidden flex-col items-start gap-8 md:flex">
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                          <legend className="-ml-1 px-1 text-sm font-medium">Job Cods</legend>
                          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                          <div className="font-semibold flex-grow !grow overflow-y-scroll overflow-x-clip">Fees</div>
                          <ul className="grid gap-3  max-h-[20vh] h-auto">
                            <li className="flex items-center justify-between">
                              <div className='flex-col items-start'>
                                <span className="text-[#f4f4f4]">49052</span>
                                <span className="text-[#9797a0] text-sm">Change Rear Tire</span>
                              </div>
                              <span>$</span>
                            </li>
                          </ul>
                        </fieldset>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="Parts">
                <Card>
                  <CardHeader className="px-7">
                    <CardTitle>OPartsrders</CardTitle>
                    <CardDescription>Recent orders from your store.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table className='overflow-x-scroll w-[650px]'>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Part # </TableHead>
                          <TableHead className="hidden sm:table-cell">Brand</TableHead>
                          <TableHead className="hidden sm:table-cell">Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Description</TableHead>
                          <TableHead className="hidden md:table-cell">Price</TableHead>
                          <TableHead className="hidden md:table-cell">In Stock</TableHead>
                          <TableHead className="hidden md:table-cell">On Order</TableHead>
                          <TableHead className="hidden md:table-cell">Distributor</TableHead>
                          <TableHead className="hidden md:table-cell">Category</TableHead>
                          <TableHead className="text-right">SubCategory</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-accent">
                          <TableCell>
                            <div className="font-medium">
                              BMW Motorrad
                            </div>

                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Hex Bolt
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Bolt to screw things
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            $42.53
                          </TableCell>
                          <TableCell className="text-right">
                            22
                          </TableCell>
                          <TableCell className="text-right">
                            12
                          </TableCell>
                          <TableCell className="text-right">
                            BMW Motorrad
                          </TableCell>
                          <TableCell className="text-right">
                            Hardware
                          </TableCell>
                          <TableCell className="text-right">
                            Hardware
                          </TableCell>
                        </TableRow>

                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="Warranty">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Workorder</CardTitle>
                    <CardDescription>
                      Current workorder. Where you add jobs for techinician to complete
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2'>
                      <div className="relative hidden flex-col items-start gap-8 md:flex">
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                          <legend className="-ml-1 px-1 text-sm font-medium">Add Jobs To Workorder</legend>
                          <div className="grid gap-3">
                            <Label htmlFor="content">Search By Job Code</Label>
                            <Input name='jobCode' />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="content">Search By Job Code Name</Label>
                            <Input name='jobCode' />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="content">Custom Entry</Label>
                            <TextArea
                              id="content"
                              placeholder="Type job here..."
                              className="min-h-[9.5rem]"
                            />
                          </div>
                        </fieldset>
                      </div>

                      <div className="relative hidden flex-col items-start gap-8 md:flex">
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                          <legend className="-ml-1 px-1 text-sm font-medium">Job Cods</legend>
                          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                          <div className="font-semibold flex-grow !grow overflow-y-scroll overflow-x-clip">Fees</div>
                          <ul className="grid gap-3  max-h-[20vh] h-auto">
                            <li className="flex items-center justify-between">
                              <div className='flex-col items-start'>
                                <span className="text-[#f4f4f4]">49052</span>
                                <span className="text-[#9797a0] text-sm">Change Rear Tire</span>
                              </div>
                              <span>$</span>
                            </li>
                          </ul>
                        </fieldset>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Workorder bill
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Print Bill
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Glimmer Lamps x <span>2</span>
                      </span>
                      <span>$250.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Aqua Filters x <span>1</span>
                      </span>
                      <span>$49.00</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>$299.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>$5.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$25.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>$329.00</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Shipping Information</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">Billing Information</div>
                    <div className="text-muted-foreground">
                      Same as shipping address
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>Liam Johnson</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">liam@acme.com</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">+1 234 567 890</a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Payment Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Visa
                      </dt>
                      <dd>**** **** **** 4532</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </main >
      </div >
    </div >
  )
}

export async function loader({ params, request }: DataFunctionArgs) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }

  const userId = user?.id
  const deFees = await getDealerFeesbyEmail(user.email)
  let clientfileId = undefined
  let { clientId, financeId } = params;
  if (clientfileId === undefined) { clientfileId = clientId }
  let sliderWidth = 50

  const aptFinance3 = await getAppointmentsForFinance(financeId)
  let finance
  /*
  if (user?.activixActivated === 'yes') {
    finance = await GetMergedWithActivix(financeId)
    await UpdateClientFromActivix(finance)
  } else {
    finance = await getMergedFinanceOnFinance(financeId)
  }*/
  //const dashboardIdCookie = await prisma.finance.findUnique({ where: { id: financeId } })
  //const SetClient66Cookie = await SetClient66(userId, clientId, financeId, dashboardIdCookie.dashboardId, request)

  const brand = finance?.brand
  const financeNotes = await getAllFinanceNotes(financeId)
  const docTemplates = await getDocsbyUserId(userId)
  const clientFile = await getClientFileById(clientfileId)
  const Coms = await getComsOverview(financeId)
  const dealerFees = await prisma.dealer.findUnique({ where: { userEmail: user?.email } })
  const dealerInfo = await prisma.dealerInfo.findFirst()
  // ------------------ nav
  const financeEmail = await prisma.finance.findFirst({ where: { id: financeId }, });
  const financeList = await prisma.finance.findMany({ where: { email: financeEmail?.email }, });
  const financeIds = financeList.map(financeRecord => financeRecord.id);
  const mergedFinanceList = await getClientListMerged(financeIds);
  // ------------------------
  let merged
  if (user?.activixActivated === 'yes') {
    merged = {


      tradeMileage: finance[0].tradeMileage,
      userName: user?.username,
      year: finance[0].year === null ? ' ' : finance[0].year,
      tradeYear: finance[0].tradeYear === null ? ' ' : finance[0].tradeYear,
      vin: finance[0].vin === null ? ' ' : finance[0].vin,
      tradeVin: finance[0].tradeVin === null ? ' ' : finance[0].tradeVin,
      stockNum: finance[0].stockNum === null ? ' ' : finance[0].stockNum,
      namextwar: finance[0].userExtWarr === null ? ' ' : 'Extended Warranty',
      asdasd: finance[0].userOther === null ? ' ' : 'Other',
      nameloan: finance[0].userLoanProt === null ? ' ' : 'Loan Protection',
      namegap: finance[0].userGap === null ? ' ' : 'Gap Insurance',
      nameTireandRim: finance[0].userTireandRim === null ? ' ' : 'Warranty',
      namevinE: finance[0].vinE === null ? ' ' : 'Vin Etching',
      namerust: finance[0].rustProofing === null ? ' asdasdsa' : 'Rust Proofing',
      namelife: finance[0].lifeDisability === null ? ' ' : 'Life and Disability Ins.',
      nameservice: finance[0].userServicespkg === null ? ' ' : 'Service Package',
      namedelivery: finance[0].deliveryCharge === null ? ' ' : 'Delivery Charge',
      userGovern: Number(dealerFees?.userGovern) < 0 ? ' ' : dealerFees?.userGovern,
      nameGovern: Number(dealerFees?.userGovern) < 0 ? ' ' : 'Government Fees',
      userAirTax: Number(dealerFees?.userAirTax) < 0 ? ' ' : dealerFees?.userAirTax,
      nameAirTax: Number(dealerFees?.userAirTax) < 0 ? ' ' : 'Air Tax',
      userTireTax: Number(dealerFees?.userTireTax) < 0 ? ' ' : dealerFees?.userTireTax,
      nameTireTax: Number(dealerFees?.userTireTax) < 0 ? ' ' : 'Tire Tax',
      userFinance: Number(dealerFees?.userFinance) < 0 ? ' ' : dealerFees?.userFinance,
      nameFinance: Number(dealerFees?.userFinance) < 0 ? ' ' : 'Finance Fee',
      destinationCharge: Number(dealerFees?.destinationCharge) < 0 ? ' ' : dealerFees?.destinationCharge,
      namedestinationCharge: Number(dealerFees?.destinationCharge) < 0 ? ' ' : 'Destination Charge',
      userMarketAdj: Number(dealerFees?.userMarketAdj) < 0 ? ' ' : dealerFees?.userMarketAdj,
      nameMarketAdj: Number(dealerFees?.userMarketAdj) < 0 ? ' ' : 'Market Adjustment',
      userOMVIC: Number(dealerFees?.userOMVIC) < 0 ? ' ' : dealerFees?.userOMVIC,
      nameOMVIC: Number(dealerFees?.userOMVIC) < 0 ? ' ' : 'OMVIC / Gov Fee',
      userDemo: Number(dealerFees?.userDemo) < 0 ? ' ' : dealerFees?.userDemo,
      nameDemo: Number(dealerFees?.userDemo) < 0 ? ' ' : 'Demonstration Fee',
      discountPer: Number(finance[0].discountPer) < 0 ? ' ' : finance[0].discountPer,
      namediscountPer: Number(finance[0].discountPer) < 0 ? ' ' : 'Discount %',
      discount: Number(finance[0].discount) < 0 ? ' ' : finance[0].discount,
      namediscount: Number(finance[0].discount) < 0 ? ' ' : 'Discount',
      namefreight: Number(finance[0].freight) < 0 ? ' ' : 'Freight',
      nameadmin: Number(finance[0].admin) < 0 ? ' ' : 'Admin',
      namepdi: Number(finance[0].pdi) < 0 ? ' ' : 'PDI',
      namcomm: Number(finance[0].commodity) < 0 ? ' ' : 'Commodity',
      nameaccessories: Number(finance[0].accessories) < 0 ? ' ' : 'Other Accessories',
      namelabour: Number(finance[0].labour) < 0 ? ' ' : 'Labour',
      netDifference: (Number(finance[0].total) - Number(finance[0].tradeValue)),
      hstSubTotal: (Number(finance[0].total) + Number(finance[0].onTax)),
      withLicensing: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing)),
      withLien: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing) + Number(finance[0].lien)),
      payableAfterDel: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing) + Number(finance[0].lien) - Number(finance[0].deposit)),

      dealerName: dealerInfo?.dealerName,
      dealerAddress: dealerInfo?.dealerAddress,
      dealerProv: `${dealerInfo?.dealerCity}, ${dealerInfo?.dealerProv}, ${dealerInfo?.dealerPostal}`,
      dealerPhone: dealerInfo?.dealerPhone,
      userLoanProt: finance[0].userLoanProt,
      userTireandRim: finance[0].userTireandRim,
      userGap: finance[0].userGap,
      userExtWarr: finance[0].userExtWarr,
      userServicespkg: finance[0].userServicespkg,
      vinE: finance[0].vinE,
      lifeDisability: finance[0].lifeDisability,
      rustProofing: finance[0].rustProofing,
      userLicensing: dealerFees?.userLicensing,
      //  userFinance: dealerFees?.userFinance,
      //  userDemo: dealerFees?.userDemo,
      userGasOnDel: dealerFees?.userGasOnDel,
      //   userOMVIC: dealerFees?.userOMVIC,
      userOther: finance[0].userOther,
      userTax: dealerFees?.userTax,
      //  userAirTax: dealerFees?.userAirTax,
      //  userTireTax: dealerFees?.userTireTax,
      //  userGovern: dealerFees?.userGovern,
      userPDI: dealerFees?.userPDI,
      userLabour: dealerFees?.userLabour,
      //  userMarketAdj: dealerFees?.userMarketAdj,
      userCommodity: dealerFees?.userCommodity,
      // destinationCharge: dealerFees?.destinationCharge,
      userFreight: dealerFees?.userFreight,
      userAdmin: dealerFees?.userAdmin,
      iRate: finance[0].iRate,
      months: finance[0].months,
      //  discount: finance[0].discount,
      total: finance[0].total,
      onTax: finance[0].onTax,
      on60: finance[0].on60,
      biweekly: finance[0].biweekly,
      weekly: finance[0].weekly,
      weeklyOth: finance[0].weeklyOth,
      biweekOth: finance[0].biweekOth,
      oth60: finance[0].oth60,
      weeklyqc: finance[0].weeklyqc,
      biweeklyqc: finance[0].biweeklyqc,
      qc60: finance[0].qc60,
      deposit: finance[0].deposit,
      biweeklNatWOptions: finance[0].biweeklNatWOptions,
      weeklylNatWOptions: finance[0].weeklylNatWOptions,
      nat60WOptions: finance[0].nat60WOptions,
      weeklyOthWOptions: finance[0].weeklyOthWOptions,
      biweekOthWOptions: finance[0].biweekOthWOptions,
      oth60WOptions: finance[0].oth60WOptions,
      biweeklNat: finance[0].biweeklNat,
      weeklylNat: finance[0].weeklylNat,
      nat60: finance[0].nat60,
      qcTax: finance[0].qcTax,
      otherTax: finance[0].otherTax,
      totalWithOptions: finance[0].totalWithOptions,
      otherTaxWithOptions: finance[0].otherTaxWithOptions,
      desiredPayments: finance[0].desiredPayments,
      freight: finance[0].freight,
      admin: finance[0].admin,
      commodity: finance[0].commodity,
      pdi: finance[0].pdi,
      //   discountPer: finance[0].discountPer,
      deliveryCharge: finance[0].deliveryCharge,
      paintPrem: finance[0].paintPrem,
      msrp: finance[0].msrp,
      licensing: finance[0].licensing,
      options: finance[0].options,
      accessories: finance[0].accessories,
      labour: finance[0].labour,
      //year: finance[0].year,
      brand: finance[0].brand,
      model: finance[0].model,
      //  stockNum: finance[0].stockNum,
      model1: finance[0].model1,
      color: finance[0].color,
      modelCode: finance[0].modelCode,
      tradeValue: finance[0].tradeValue,
      tradeDesc: finance[0].tradeDesc,
      tradeColor: finance[0].tradeColor,
      //  tradeYear: finance[0].tradeYear,
      tradeMake: finance[0].tradeMake,
      //  tradeVin: finance[0].tradeVin,
      tradeTrim: finance[0].tradeTrim,
      //  tradeMileage: finance[0].tradeMileage,
      trim: finance[0].trim,
      //vin: finance[0].vin,
      lien: finance[0].lien,

      date: new Date().toLocaleDateString(),
      dl: finance[0].dl,
      email: finance[0].email,
      firstName: finance[0].firstName,
      lastName: finance[0].lastName,
      phone: finance[0].phone,
      name: finance[0].name,
      address: finance[0].address,
      city: finance[0].city,
      postal: finance[0].postal,
      province: finance[0].province,
      referral: finance[0].referral,
      visited: finance[0].visited,
      bookedApt: finance[0].bookedApt,
      aptShowed: finance[0].aptShowed,
      aptNoShowed: finance[0].aptNoShowed,
      testDrive: finance[0].testDrive,
      metService: finance[0].metService,
      metManager: finance[0].metManager,
      metParts: finance[0].metParts,
      sold: finance[0].sold,
      depositMade: finance[0].depositMade,
      refund: finance[0].refund,
      turnOver: finance[0].turnOver,
      financeApp: finance[0].financeApp,
      approved: finance[0].approved,
      signed: finance[0].signed,
      pickUpSet: finance[0].pickUpSet,
      demoed: finance[0].demoed,
      delivered: finance[0].delivered,
      status: finance[0].status,
      customerState: finance[0].customerState,
      result: finance[0].result,
      notes: finance[0].notes,
      metSalesperson: finance[0].metSalesperson,
      metFinance: finance[0].metFinance,
      financeApplication: finance[0].financeApplication,
      pickUpTime: finance[0].pickUpTime,
      depositTakenDate: finance[0].depositTakenDate,
      docsSigned: finance[0].docsSigned,
      tradeRepairs: finance[0].tradeRepairs,
      seenTrade: finance[0].seenTrade,
      lastNote: finance[0].lastNote,
      dLCopy: finance[0].dLCopy,
      insCopy: finance[0].insCopy,
      testDrForm: finance[0].testDrForm,
      voidChq: finance[0].voidChq,
      loanOther: finance[0].loanOther,
      signBill: finance[0].signBill,
      ucda: finance[0].ucda,
      tradeInsp: finance[0].tradeInsp,
      customerWS: finance[0].customerWS,
      otherDocs: finance[0].otherDocs,
      urgentFinanceNote: finance[0].urgentFinanceNote,
      funded: finance[0].funded,
    }
  } else {
    merged = {
      tradeMileage: finance[0].tradeMileage,
      userName: user?.username,
      year: finance[0].year === null ? ' ' : finance[0].year,
      tradeYear: finance[0].tradeYear === null ? ' ' : finance[0].tradeYear,
      vin: finance[0].vin === null ? ' ' : finance[0].vin,
      tradeVin: finance[0].tradeVin === null ? ' ' : finance[0].tradeVin,
      stockNum: finance[0].stockNum === null ? ' ' : finance[0].stockNum,
      namextwar: finance[0].userExtWarr === null ? ' ' : 'Extended Warranty',
      asdasd: finance[0].userOther === null ? ' ' : 'Other',
      nameloan: finance[0].userLoanProt === null ? ' ' : 'Loan Protection',
      namegap: finance[0].userGap === null ? ' ' : 'Gap Insurance',
      nameTireandRim: finance[0].userTireandRim === null ? ' ' : 'Warranty',
      namevinE: finance[0].vinE === null ? ' ' : 'Vin Etching',
      namerust: finance[0].rustProofing === null ? ' asdasdsa' : 'Rust Proofing',
      namelife: finance[0].lifeDisability === null ? ' ' : 'Life and Disability Ins.',
      nameservice: finance[0].userServicespkg === null ? ' ' : 'Service Package',
      namedelivery: finance[0].deliveryCharge === null ? ' ' : 'Delivery Charge',
      userGovern: Number(dealerFees?.userGovern) < 0 ? ' ' : dealerFees?.userGovern,
      nameGovern: Number(dealerFees?.userGovern) < 0 ? ' ' : 'Government Fees',
      userAirTax: Number(dealerFees?.userAirTax) < 0 ? ' ' : dealerFees?.userAirTax,
      nameAirTax: Number(dealerFees?.userAirTax) < 0 ? ' ' : 'Air Tax',
      userTireTax: Number(dealerFees?.userTireTax) < 0 ? ' ' : dealerFees?.userTireTax,
      nameTireTax: Number(dealerFees?.userTireTax) < 0 ? ' ' : 'Tire Tax',
      userFinance: Number(dealerFees?.userFinance) < 0 ? ' ' : dealerFees?.userFinance,
      nameFinance: Number(dealerFees?.userFinance) < 0 ? ' ' : 'Finance Fee',
      destinationCharge: Number(dealerFees?.destinationCharge) < 0 ? ' ' : dealerFees?.destinationCharge,
      namedestinationCharge: Number(dealerFees?.destinationCharge) < 0 ? ' ' : 'Destination Charge',
      userMarketAdj: Number(dealerFees?.userMarketAdj) < 0 ? ' ' : dealerFees?.userMarketAdj,
      nameMarketAdj: Number(dealerFees?.userMarketAdj) < 0 ? ' ' : 'Market Adjustment',
      userOMVIC: Number(dealerFees?.userOMVIC) < 0 ? ' ' : dealerFees?.userOMVIC,
      nameOMVIC: Number(dealerFees?.userOMVIC) < 0 ? ' ' : 'OMVIC / Gov Fee',
      userDemo: Number(dealerFees?.userDemo) < 0 ? ' ' : dealerFees?.userDemo,
      nameDemo: Number(dealerFees?.userDemo) < 0 ? ' ' : 'Demonstration Fee',
      discountPer: Number(finance[0].discountPer) < 0 ? ' ' : finance[0].discountPer,
      namediscountPer: Number(finance[0].discountPer) < 0 ? ' ' : 'Discount %',
      discount: Number(finance[0].discount) < 0 ? ' ' : finance[0].discount,
      namediscount: Number(finance[0].discount) < 0 ? ' ' : 'Discount',
      namefreight: Number(finance[0].freight) < 0 ? ' ' : 'Freight',
      nameadmin: Number(finance[0].admin) < 0 ? ' ' : 'Admin',
      namepdi: Number(finance[0].pdi) < 0 ? ' ' : 'PDI',
      namcomm: Number(finance[0].commodity) < 0 ? ' ' : 'Commodity',
      nameaccessories: Number(finance[0].accessories) < 0 ? ' ' : 'Other Accessories',
      namelabour: Number(finance[0].labour) < 0 ? ' ' : 'Labour',
      netDifference: (Number(finance[0].total) - Number(finance[0].tradeValue)),
      hstSubTotal: (Number(finance[0].total) + Number(finance[0].onTax)),
      withLicensing: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing)),
      withLien: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing) + Number(finance[0].lien)),
      payableAfterDel: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing) + Number(finance[0].lien) - Number(finance[0].deposit)),

      dealerName: dealerInfo?.dealerName,
      dealerAddress: dealerInfo?.dealerAddress,
      dealerProv: `${dealerInfo?.dealerCity}, ${dealerInfo?.dealerProv}, ${dealerInfo?.dealerPostal}`,
      dealerPhone: dealerInfo?.dealerPhone,
      userLoanProt: finance[0].userLoanProt,
      userTireandRim: finance[0].userTireandRim,
      userGap: finance[0].userGap,
      userExtWarr: finance[0].userExtWarr,
      userServicespkg: finance[0].userServicespkg,
      vinE: finance[0].vinE,
      lifeDisability: finance[0].lifeDisability,
      rustProofing: finance[0].rustProofing,
      userLicensing: dealerFees?.userLicensing,
      //  userFinance: dealerFees?.userFinance,
      //  userDemo: dealerFees?.userDemo,
      userGasOnDel: dealerFees?.userGasOnDel,
      //   userOMVIC: dealerFees?.userOMVIC,
      userOther: finance[0].userOther,
      userTax: dealerFees?.userTax,
      //  userAirTax: dealerFees?.userAirTax,
      //  userTireTax: dealerFees?.userTireTax,
      //  userGovern: dealerFees?.userGovern,
      userPDI: dealerFees?.userPDI,
      userLabour: dealerFees?.userLabour,
      //  userMarketAdj: dealerFees?.userMarketAdj,
      userCommodity: dealerFees?.userCommodity,
      // destinationCharge: dealerFees?.destinationCharge,
      userFreight: dealerFees?.userFreight,
      userAdmin: dealerFees?.userAdmin,
      iRate: finance[0].iRate,
      months: finance[0].months,
      //  discount: finance[0].discount,
      total: finance[0].total,
      onTax: finance[0].onTax,
      on60: finance[0].on60,
      biweekly: finance[0].biweekly,
      weekly: finance[0].weekly,
      weeklyOth: finance[0].weeklyOth,
      biweekOth: finance[0].biweekOth,
      oth60: finance[0].oth60,
      weeklyqc: finance[0].weeklyqc,
      biweeklyqc: finance[0].biweeklyqc,
      qc60: finance[0].qc60,
      deposit: finance[0].deposit,
      biweeklNatWOptions: finance[0].biweeklNatWOptions,
      weeklylNatWOptions: finance[0].weeklylNatWOptions,
      nat60WOptions: finance[0].nat60WOptions,
      weeklyOthWOptions: finance[0].weeklyOthWOptions,
      biweekOthWOptions: finance[0].biweekOthWOptions,
      oth60WOptions: finance[0].oth60WOptions,
      biweeklNat: finance[0].biweeklNat,
      weeklylNat: finance[0].weeklylNat,
      nat60: finance[0].nat60,
      qcTax: finance[0].qcTax,
      otherTax: finance[0].otherTax,
      totalWithOptions: finance[0].totalWithOptions,
      otherTaxWithOptions: finance[0].otherTaxWithOptions,
      desiredPayments: finance[0].desiredPayments,
      freight: finance[0].freight,
      admin: finance[0].admin,
      commodity: finance[0].commodity,
      pdi: finance[0].pdi,
      //   discountPer: finance[0].discountPer,
      deliveryCharge: finance[0].deliveryCharge,
      paintPrem: finance[0].paintPrem,
      msrp: finance[0].msrp,
      licensing: finance[0].licensing,
      options: finance[0].options,
      accessories: finance[0].accessories,
      labour: finance[0].labour,
      //year: finance[0].year,
      brand: finance[0].brand,
      model: finance[0].model,
      //  stockNum: finance[0].stockNum,
      model1: finance[0].model1,
      color: finance[0].color,
      modelCode: finance[0].modelCode,
      tradeValue: finance[0].tradeValue,
      tradeDesc: finance[0].tradeDesc,
      tradeColor: finance[0].tradeColor,
      //  tradeYear: finance[0].tradeYear,
      tradeMake: finance[0].tradeMake,
      //  tradeVin: finance[0].tradeVin,
      tradeTrim: finance[0].tradeTrim,
      //  tradeMileage: finance[0].tradeMileage,
      trim: finance[0].trim,
      //vin: finance[0].vin,
      lien: finance[0].lien,

      date: new Date().toLocaleDateString(),
      dl: finance[0].dl,
      email: finance[0].email,
      firstName: finance[0].firstName,
      lastName: finance[0].lastName,
      phone: finance[0].phone,
      name: finance[0].name,
      address: finance[0].address,
      city: finance[0].city,
      postal: finance[0].postal,
      province: finance[0].province,
      referral: finance[0].referral,
      visited: finance[0].visited,
      bookedApt: finance[0].bookedApt,
      aptShowed: finance[0].aptShowed,
      aptNoShowed: finance[0].aptNoShowed,
      testDrive: finance[0].testDrive,
      metService: finance[0].metService,
      metManager: finance[0].metManager,
      metParts: finance[0].metParts,
      sold: finance[0].sold,
      depositMade: finance[0].depositMade,
      refund: finance[0].refund,
      turnOver: finance[0].turnOver,
      financeApp: finance[0].financeApp,
      approved: finance[0].approved,
      signed: finance[0].signed,
      pickUpSet: finance[0].pickUpSet,
      demoed: finance[0].demoed,
      delivered: finance[0].delivered,
      status: finance[0].status,
      customerState: finance[0].customerState,
      result: finance[0].result,
      notes: finance[0].notes,
      metSalesperson: finance[0].metSalesperson,
      metFinance: finance[0].metFinance,
      financeApplication: finance[0].financeApplication,
      pickUpTime: finance[0].pickUpTime,
      depositTakenDate: finance[0].depositTakenDate,
      docsSigned: finance[0].docsSigned,
      tradeRepairs: finance[0].tradeRepairs,
      seenTrade: finance[0].seenTrade,
      lastNote: finance[0].lastNote,
      dLCopy: finance[0].dLCopy,
      insCopy: finance[0].insCopy,
      testDrForm: finance[0].testDrForm,
      voidChq: finance[0].voidChq,
      loanOther: finance[0].loanOther,
      signBill: finance[0].signBill,
      ucda: finance[0].ucda,
      tradeInsp: finance[0].tradeInsp,
      customerWS: finance[0].customerWS,
      otherDocs: finance[0].otherDocs,
      urgentFinanceNote: finance[0].urgentFinanceNote,
      funded: finance[0].funded,




    }
  }

  if (user?.activixActivated === 'yeskkk') {
    await UpdateLeadBasic(merged, user)
    await UpdateLeademail(merged)
    await UpdateLeadPhone(merged)
    await UpdateLeadWantedVeh(merged)
  }
  for (let key in merged) {
    merged[key] = String(merged[key]);
  }
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: email } });
  const UploadedDocs = await prisma.uploadDocs.findMany({ where: { financeId: finance?.id } });
  const userList = await prisma.user.findMany()
  const parts = await prisma.part.findMany()
  const clientUnit = await prisma.inventoryMotorcycle.findFirst({ where: { stockNumber: merged.stockNum } })


  if (user?.activixActivated === 'yes') {
    const financeData = finance
    await PullActivix(financeData)
  }
  if (brand === 'Manitou') {
    const modelData = await getDataByModelManitou(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, mergedFinanceList, getTemplates, Coms, merged, aptFinance3, docs: docTemplates, clientFile, clientfileId, modelData, finance, deFees, manOptions, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit })
  }
  if (brand === 'Switch') {
    const modelData = await getDataByModel(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, mergedFinanceList, getTemplates, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, manOptions, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'Kawasaki') {
    const modelData = await getDataKawasaki(finance);
    return json({ ok: true, mergedFinanceList, getTemplates, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'BMW-Motorrad') {
    const bmwMoto = await getLatestBMWOptions(financeId)
    const bmwMoto2 = await getLatestBMWOptions2(financeId)
    const modelData = await getDataBmwMoto(finance);
    return json({ ok: true, mergedFinanceList, getTemplates, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientfileId, clientUnit })
  }
  if (brand === 'Triumph') {
    const modelData = await getDataTriumph(finance);
    return json({ ok: true, mergedFinanceList, getTemplates, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'Harley-Davidson') {
    const modelData = await getDataHarley(finance);
    const apptFinance2 = await getAllFinanceApts2(financeId)
    const aptFinance3 = await getAllFinanceApts(financeId)
    return json({ ok: true, mergedFinanceList, getTemplates, Coms, merged, modelData, docs: docTemplates, clientFile, apptFinance2, aptFinance3, finance, deFees, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'Indian' || brand === 'Can-Am' || brand === 'Sea-Doo' || brand === 'Ski-Doo' || brand === 'Suzuki' || brand === 'Spyder' || brand === 'Can-Am-SXS') {
    const modelData = await getDataByModel(finance)
    return json({ ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, financeId, UploadedDocs, userList, parts, clientUnit })

  }
  return json({ ok: true, mergedFinanceList, getTemplates, Coms, merged, aptFinance3, docs: docTemplates, clientFile, finance, deFees, sliderWidth, user, financeNotes, financeId, UploadedDocs, userList, parts, clientUnit, clientfileId })
}
