import { useLoaderData, Form, useActionData, NavLink, Link } from '@remix-run/react'
import { type MetaFunction, json, redirect, type ActionFunction, type LoaderFunction, } from '@remix-run/node'
import { Input, Label, Separator, Button, } from '~/components/ui/index'
import { prisma } from "~/libs";
import financeFormSchema from '~/overviewUtils/financeFormSchema'
import { createDealerfees, getDealerFeesbyEmail, updateDealerFees, updateUser } from '~/utils/user.server'
import * as Toast from '@radix-ui/react-toast';
import React from 'react';
import { deleteDailyPDF } from '~/utils/dailyPDF/delete.server'
import { saveDailyWorkPlan } from '~/utils/dailyPDF/create.server'
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { GetUser } from "~/utils/loader.server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Bell, ScrollText, Sheet, User2, Wrench, Database  } from 'lucide-react';
import { PauseCircle } from 'lucide-react';
import { Presentation } from 'iconoir-react';
import { FileQuestion } from 'lucide-react';

export const loader = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  if (user?.plan === 'prod_OY8EMf7RNoJXhX') {
    redirect('/dealer/user/dashboard/settings')

  }
  return json({ user, });
}

export const meta = () => {
  return [
    { title: "Welcome - Dealer Fees - Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM',
    },
  ];
};


export default function WelcomeDealerFeesSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto gap-4 ">
      <SalesCard />
      <DealerCard />
    </div>

  )
}

function DealerCard() {
  return (
    <Card className='bg-background'>
      <CardHeader className="pb-3">
        <CardTitle>Dealers</CardTitle>
        <CardDescription>
          Some house keeping before you get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
      <NavLink to='/dealer/admin/users/overview'>
          <div className="-mx-2 flex items-start space-x-4 rounded-md hover:bg-accent p-2 hover:text-accent-foreground transition-all">
            <User2 className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Adding Employees</p>
              <p className="text-sm text-muted-foreground">
                Here you can add your employees so they can start using the system. Once created you can delegate the previous tasks to them, or take care of them yourself.
              </p>
            </div>
          </div>
        </NavLink>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <Bell className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Other Steps</p>
            <p className="text-sm text-muted-foreground">
              All the steps in the sales card are needed to be completed for you as well.
            </p>
          </div>
        </div>

        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <Link className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Links</p>
            <p className="text-sm text-muted-foreground">
              Here are the links needed to complete the previous steps, and what position can complete them.
            </p>
            <div className='grid grid-cols-1 justify-center'>

              <NavLink to='/dealer/admin/settings/general' className='hover:text-underline'>
                Dealer Fees and Information - Admin / Manager
              </NavLink>
              <NavLink to='/dealer/user/dashboard/templates'  className='hover:text-underline'>
                Templates - Any
              </NavLink>
              <NavLink to='/dealer/user/dashboard/board'  className='hover:text-underline'>
                Boards - Any
              </NavLink>
              <NavLink to='/dealer/user/dashboard/scripts'  className='hover:text-underline'>
                Scripts - Any
              </NavLink>
            </div>
          </div>
        </div>


        <NavLink to='/dealer/admin/importexport/units'>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <Database className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Data</p>
              <p className="text-sm text-muted-foreground">
                To import data from your current CRM.
              </p>
            </div>
          </div>
        </NavLink>
      </CardContent>
    </Card>

  )
}
function SalesCard() {
  return (
    <Card className='bg-background'>
      <CardHeader className="pb-3">
        <CardTitle>Sales People</CardTitle>
        <CardDescription>
          Some house keeping before you get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <NavLink to='/dealer/user/dashboard/dealerFees'>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <Bell className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Dealer Fees</p>
              <p className="text-sm text-muted-foreground">
                First you will need to input your dealer's fees and other values, in your settings section, for the quoting system to populate accurate quotes.
              </p>
            </div>
          </div>
        </NavLink>
        <NavLink to='/dealer/user/dashboard/settings'>
        <div className="-mx-2 flex items-start space-x-4 rounded-md hover:bg-accent p-2 hover:text-accent-foreground transition-all">
        <User2 className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Profile</p>
              <p className="text-sm text-muted-foreground">
                Update your profile information.
              </p>
            </div>
          </div>
        </NavLink>

        <NavLink to='/dealer/user/dashboard/templates'>
          <div className="-mx-2 flex items-start space-x-4 rounded-md hover:bg-accent p-2 hover:text-accent-foreground transition-all">
            <Sheet className="mt-px h-[40px] w-[40px]" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Documents</p>
              <p className="text-sm text-muted-foreground">
              Creating all of your templated documents ahead of time can save you a lot of it during the sales process. Its worth the initial investment setting everything up. Currently once your done your documents you will have to email us the templates to have accessible on your clients dashboard so it can be used for every sale. In the future this will be automatic and sending it to us will not be needed.
              </p>
            </div>
          </div>
        </NavLink>


        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <PauseCircle className="mt-px h-10 w-10" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">How to documentation</p>
            <p className="text-sm text-muted-foreground">
              In your drop down menu, it will display 'how to documenation'. No matter the page your on it will bring you to that pages video, explaining all the features and abilities that page has. That way you can learn as you go, when needed. Instead of sitting there for the next 4 hours and only retaining a portain of the information.
            </p>
          </div>
        </div>
        <NavLink to='/dealer/user/dashboard/board'>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <Presentation className="mt-px h-10 w-10" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">The Board</p>
              <p className="text-sm text-muted-foreground">
                The board in your settings area is similar to a trello board, it can be used to set up a sale process that works for you and guide you through it when you can't remember, or other ideas like that.
              </p>
            </div>
          </div>
        </NavLink>
        <NavLink to='/dealer/user/dashboard/scripts'>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <ScrollText className="mt-px h-10 w-10" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Scripts</p>
              <p className="text-sm text-muted-foreground">
                Building your scripts library now and on the go will save you time when you reuse that script with the next customer. They're accessible when emailing or texting people so they can come in handy to take care of calls, or sending customers quotations in a second while they are still at the desk with you.
              </p>
            </div>
          </div>
        </NavLink>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <Wrench className="mt-px h-10 w-10" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Preconfigured options</p>
            <p className="text-sm text-muted-foreground">
              Almost everything is pre configured and set up already to help you succeed. For example the dashbaord's are already set up to hit the ground running so you don't need to move / hide or display columns for it to be effecient to work with. It is there if you do want it, so make any changes you see fit. Same with scripts, there are already a number that you have access to. Along with a number of other pre configured systems.
            </p>
          </div>
        </div>
        <NavLink to='/dealer/user/dashboard/contact'>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <FileQuestion className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Suggestions</p>
              <p className="text-sm text-muted-foreground">
                If you see an area/process that can be accomplished more effieciently, let us know and we can update/upgrade it.
              </p>
            </div>
          </div>
        </NavLink>
      </CardContent>
    </Card>

  )
}
export const asdsaloader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  let deFees = await prisma.dealer.findUnique({
    where: { userEmail: email },
  });
  console.log('loader', deFees, email, user)
  return json({ request, user, deFees });
}

