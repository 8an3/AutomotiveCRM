/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import { Form, Link, useLoaderData, useLocation, useFetcher } from '@remix-run/react';
import { rootAction, useUserLoader } from './actions';
import { ActionFunction, type DataFunctionArgs, json, redirect, type LoaderFunction } from "@remix-run/node";
import { getSession } from "~/sessions/auth-session.server";
import { model } from "~/models";
import { toast } from 'sonner';
import { prisma } from "~/libs";

import { MessageSquare } from 'lucide-react';
import { requireAuthCookie } from '~/utils/misc.user.server';
import { useEffect, useRef, useState } from 'react';

export const loader: LoaderFunction = async ({ request, params }) => {
  let userSession = await getSession(request.headers.get("Cookie"));
  if (!userSession) { userSession = await requireAuthCookie(request); }
  if (!userSession) { return json({ status: 302, redirect: 'login' }); };
  let user = await model.user.query.getForSession({ email });
  if (!user) { user = await model.user.query.getForSession({ email: userSession.email }); }
  let email = userSession.get("email");

  if (!email) { email = userSession.mail }
  if (!user) { return json({ status: 302, redirect: 'login' }); };

  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userEmail: email
    }
  })
  console.log(notifications, 'nmoti')
  return json({ user, email })
}
export let action = rootAction

export default function Chat() {
  const { user } = useLoaderData();
  const location = useLocation();
  let fetcher = useFetcher()
  // const userIsAllowed = getUserIsAllowed(user, ["ADMIN", "MANAGER", "EDITOR", "SALES", "FINANCE"]);
  const isUserDashboard = location.pathname.includes('/user/dashboard')
  //  const { user } = useRootLoaderData();
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      if (iFrameRef?.current) {
        iFrameRef.current.src = 'http://localhost:3000/dealer/im/lobby';
        //iFrameRef.current.src = 'http://localhost:3002/customerGen';
      }
    });
    const hideSpinner = () => {
      setIsLoading(false);
    };

    return (
      <>
        <div className="h-[100vh] w-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            height="100%"
            onLoad={hideSpinner}
          />
        </div>
      </>
    );
  };



  useEffect(() => {
    if (iFrameRef?.current) {
      iFrameRef.current.src = 'http://localhost:3000/dealer/im/chatMenu';
      //  iFrameRef.current.src = 'http://localhost:3002/customer-forms';
      //  const userId = user.id
      //  let merged = { finance }
      //  let merged = { finance }
      // Function to convert values to strings

      const handleLoad = () => {
        //   const data = { merged, user, userId };
        const data = user.email
        iFrameRef.current?.contentWindow?.postMessage(data, '*');
      };

      iFrameRef.current.addEventListener('load', handleLoad);

      // Clean up the event listener when the component is unmounted
      return () => {
        iFrameRef.current?.removeEventListener('load', handleLoad);
      };
    }
  }, [iFrameRef,]);

  return (
    <>
      <MyIFrameComponent />
    </>
  )
}



/*
/**
 *      {/* trade *
<Tabs.Content className="grow p-5 bg-white2 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="features"  >
  {location.pathname.startsWith(`/overview/`) && (
    <>
      <div className="grid">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Features</h4>

        </div>
        <div className="flex ">
          <div className='grid grid-cols-1 gap-2'>

            <p className="text-muted-foreground text-sm text-left">
              Print Docs
            </Button>
            <hr className="solid" />

            <div className="mx-auto justify-center">
              <PrintSpec />
            </div>
            <div className="">
              <Button disabled className="" type="submit" content="update">
                Test Drive Docs - Unavailable
              </Button>
            </div>
            <div className="mx-auto w-auto ">
              <PrintDealer />
            </div>
            <div className="">
              <Button disabled className="" type="submit" content="update">
                Customer W/S - Unavailable
              </Button>
            </div>
            <div className="items-center mx-auto">
              <PrintContract />
            </div>

            <div className="">
              <Button disabled className="" type="submit" content="update">
                Trade in Docs -  Unavailable
              </Button>
            </div>
            <p className="text-muted-foreground text-sm text-left">
              Email
            </Button>
            <hr className="solid" />

            <div className="">
              <Button disabled className="" type="submit" content="update">
                Docsign Contract - Unavailable
              </Button>
            </div>
            <p className="text-muted-foreground text-sm text-left">
              Other
            </Button>
            <hr className="solid" />

            <div className="mx-auto ">
              <ModelPage />
            </div>

            <div className="">
              <Button disabled className="" type="submit" content="update">
                Sync Deal to CRM - Unavailable
              </Button>
            </div>
            <Button>
              <a href="/dashboard/calls"
                target="_blank"
              >
                Dashboard
              </a>
            </Button>
            <Button>
              <a href={`/customer/${currentEvent?.financeId}{finance.id}`}
                target="_blank"
              >
                Client File
              </a>
            </Button>
          </div>
        </div>
        <div className="flex justify-between mb-[10px] mt-3">

        </div>
      </div>
    </>
  )}
</Tabs.Content>
{
  location.pathname.startsWith(`/overview/`) && (
    <Tabs.List className="shrink-0 flex border-b mt-auto border-mauve6" aria-label="Manage your account">
      <Tabs.Trigger
        className="bg-white2 px-5 h-[45px] flex-1 rounded-bl-md  flex items-center justify-center text-[15px] leading-none text-black select-none  hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
        value="features"
      >
        Features
      </Tabs.Trigger>

      <Tabs.Trigger
        className="bg-white2 px-5 h-[45px] flex-1 flex rounded-br-md items-center justify-center text-[15px] leading-none text-black select-none  hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
        value="emails"
      >
        Email
      </Tabs.Trigger>
    </Tabs.List>
  )
}
 * email sheet
  < Tabs.Content
className = "grow p-5 bg-white2 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
value = "emails"
  >
  <>
    <div className="grid gap-2">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">
          Email Templates
        </h4>
        <p className="text-muted-foreground text-sm">
          Be sure to update before selecting an email to send.
        </Button>
        <p className="text-muted-foreground text-sm mt-2">
          Options - would include gap, warranties, etc
        </Button>
        <p className="text-muted-foreground text-sm mt-2">
          These are templated emails, send one to yourself first to ensure you like the content.
        </Button>
        <hr className="solid" />
      </div>
      <div className="w-[95%]">
        <Form method="post" action="/emails/send/payments">
          <Select name="emailType">
            <SelectTrigger className=" mt-2 rounded-[0px] border">
              <SelectValue placeholder="Select an email..." />
            </SelectTrigger>
            <SelectContent className="bg-white2 dark:bg-black dark:text-[#fafafa] ">
              <ScrollArea className="h-[300px] w-[350px] rounded-md  p-4">
                <SelectGroup>
                  <SelectLabel>Payments </SelectLabel>
                  <SelectItem value="">Select None</SelectItem>
                  <SelectItem value="paymentsTemp">Payments</SelectItem>{/* 1*
                  <SelectItem value="wBreakdownTemp">W/ Full Breakdown</SelectItem>{/*2
                  <SelectItem value="wSpecTemp">W/ Full Breakdown & Spec</SelectItem>{/* 3
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsTemp">W/ Options</SelectItem>{/* 4
                  <SelectItem value="optionsWBreakdownTemp">Options W/ Full Breakdown</SelectItem>{/* 5
                  <SelectItem value="optionsWSpecTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*6
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>No Tax</SelectLabel>
                  <SelectItem value="paymentsNoTaxTemp">Payments</SelectItem>{/* 7
                  <SelectItem value="wBreakdownNoTaxTemp">W/ Full Breakdown</SelectItem>{/* 8
                  <SelectItem value="wSpecNoTaxTemp">W/ Full Breakdown & Spec</SelectItem>{/*9
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsNoTaxTemp">W/ Options</SelectItem>{/* 10
                  <SelectItem value="optionsWBreakdownNoTaxTemp">Options W/ Full Breakdown</SelectItem>{/*11
                  <SelectItem value="optionsWSpecNoTaxTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*12
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>Custom Tax</SelectLabel>
                  <SelectItem value="paymentsCustomTemp">Payments</SelectItem>{/*13
                  <SelectItem value="wBreakdownCustomTemp">W/ Full Breakdown</SelectItem>{/*14
                  <SelectItem value="wSpecCustomTemp">W/ Full Breakdown & Spec</SelectItem>{/* 15
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsCustomTemp">W/ Options</SelectItem>{/*16
                  <SelectItem value="optionsWBreakdownCustomTemp">Options W/ Full Breakdown</SelectItem>{/*17
                  <SelectItem value="optionsWSpecCustomTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*18
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
          <Button className="mt-2" type="submit" name="intent" value="justpaymentsCustom">
            Email
          </Button>
        </Form>
        <div className="space-y-2 mt-4">
          <h4 className="font-medium leading-none">
            Custom Email Templates
          </h4>
          <p className="text-muted-foreground text-sm">
            Instead of a complete template, with these you can insert your own body but still get all the payments and breakdowns already done.
          </Button>
          <hr className="solid" />
        </div>
        <Form method="post" action="/emails/send/payments">
          <TextArea
            placeholder="Type your message here."
            name="customContent"
            className="h-[250px] mt-2"
          />
          <Select name="emailType" >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Payments (by default)" />
            </SelectTrigger>
            <SelectContent className="bg-white2 dark:bg-black dark:text-[#fafafa] ">
              <ScrollArea className="h-[400px] w-[350px] rounded-md  p-4">
                <SelectGroup>
                  <SelectLabel>Payments </SelectLabel>
                  <SelectItem value="payments">Payments</SelectItem>{/*19
                  <SelectItem value="wBreakdown">W/ Full Breakdown</SelectItem>{/* 20
                  <SelectItem value="wSpec">W/ Full Breakdown & Spec</SelectItem>{/*21
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptions">W/ Options</SelectItem>{/* 22
                  <SelectItem value="optionsWBreakdown">Options W/ Full Breakdown</SelectItem>{/* 23
                  <SelectItem value="optionsWSpec"> Options W/ Full Breakdown & Spec</SelectItem>{/*24
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>No Tax</SelectLabel>
                  <SelectItem value="paymentsNoTax">Payments</SelectItem>{/*25
                  <SelectItem value="wBreakdownNoTax">W/ Full Breakdown</SelectItem>{/* 26
                  <SelectItem value="wSpecNoTax">W/ Full Breakdown & Spec</SelectItem>{/*27
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsNoTax">W/ Options</SelectItem>{/*28
                  <SelectItem value="optionsWBreakdownNoTax">Options W/ Full Breakdown</SelectItem>{/* 29
                  <SelectItem value="optionsWSpecNoTax"> Options W/ Full Breakdown & Spec</SelectItem>{/* 30
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>Custom Tax</SelectLabel>
                  <SelectItem value="paymentsCustom">Payments</SelectItem>{/*31
                  <SelectItem value="wBreakdownCustom">W/ Full Breakdown</SelectItem>{/*32
                  <SelectItem value="wSpecCustom">W/ Full Breakdown & Spec</SelectItem>{/* 33
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsCustom">W/ Options</SelectItem>{/*34
                  <SelectItem value="optionsWBreakdownCustom">Options W/ Full Breakdown</SelectItem>{/*35
                  <SelectItem value="optionsWSpecCustom">W/ Full Breakdown & Spec</SelectItem>{/*36
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
          <Button className="w-auto mt-2" type="submit" name="intent" value="justpaymentsCustom">
            Email
          </Button>
        </Form>


      </div>
    </div>
  </>
</Tabs.Content>
  */
