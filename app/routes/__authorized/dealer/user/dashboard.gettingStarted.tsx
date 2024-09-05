import { useLoaderData, Form, useActionData } from '@remix-run/react'
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
import { Bell, ScrollText, Sheet, User2 } from 'lucide-react';
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
    </div>

  )
}

function SalesCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Sales People</CardTitle>
        <CardDescription>
          Some house keeping before you started.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <Bell className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Dealer Fees</p>
            <p className="text-sm text-muted-foreground">
              First you will need to input your dealer's fees and other values, in your settings section, for the quoting system to populate accurate quotes.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
          <User2 className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Profile</p>
            <p className="text-sm text-muted-foreground">
              Update your profile information as much as you can.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <Sheet className="mt-px h-5 w-5" />

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Documents</p>
            <p className="text-sm text-muted-foreground">
              Creating all of your templated documents ahead of time can you alot of it during the sales process, it is worth the initial investment setting everything up. Currently once your done your document you will have to email us the template to have it saved to your clients dashboard so it can be used for every sale. In the future this will be automatic and sending it to us will not be needed.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <PauseCircle className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">How to documentation</p>
            <p className="text-sm text-muted-foreground">
              In your drop down, it will display documenation. No matter the page your on it will bring you to that pages video, explaining all the features and abilities that page has. That way you can learn as you go when needed, instead of sitting there for the next 4 hours and only retaining a portain of the information.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <Presentation className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">The Board</p>
            <p className="text-sm text-muted-foreground">
              The board in your settings area is similar to a trello board, it can be used to set up a sale process that works for you and guide you through it when you can't remember, or other ideas like that.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <ScrollText className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Scripts</p>
            <p className="text-sm text-muted-foreground">
              Building your scripts library now and on the go will save you time when you can reuse that script with the next customer. They're accessible when emailing or texting people so they can come in handy to take care of calls.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <FileQuestion className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Suggestions</p>
            <p className="text-sm text-muted-foreground">
              If you see an area/process that can be accomplished more effieciently, let us know and we can update/upgrade it.
            </p>
          </div>
        </div>
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

