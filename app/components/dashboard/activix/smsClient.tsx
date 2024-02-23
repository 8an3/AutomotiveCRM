import * as Dialog from "@radix-ui/react-dialog";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import { response } from "express";
import financeFormSchema from "~/routes/overviewUtils/financeFormSchema";
import React, { useEffect, useRef, useState } from 'react';
import * as Toast from "@radix-ui/react-toast";

export let loader = dashboardLoader;



export default function SmsClient({ data }) {
  const today = new Date();

  const id = data.id ? data.id.toString() : '';

  let formRef = useRef();

  const fetcher = useFetcher();
  let isAdding = fetcher.state === "submitting" && fetcher.formData?.get("intent") === "2DaysFromNow";

  const [open, setOpen] = React.useState(false);
  const timerRef = useRef(0);

  useEffect(() => {
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);


  return (
    <Dialog.Root>
      <Dialog.Trigger asChild >
        <p className="cursor-pointer" >
          <MessageText />
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[650px] w-full md:w-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Text Client
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          </Dialog.Description>
          <fetcher.Form method="post" ref={formRef}>
            <div className='flex flex-col'>
              <label className="w-[90px] text-left text-[15px]" htmlFor="username">
                Body
              </label>
              <TextArea
                placeholder="Type your email here."
                name="customContent"
                className="h-[250px] mt-2"
              />
            </div>
            <input type='hidden' value={data.firstName} name='customerFirstName' />
            <input type='hidden' value={data.lastName} name='customerLastName' />
            <input type='hidden' value={data.email} name='customerEmail' />
            <input type='hidden' value={data.phone} name='customerPhone' />
            <input type="hidden" defaultValue={data.userEmail} name="userEmail" />
            <input type="hidden" defaultValue={data.id} name="financeId" />
            <input type="hidden" defaultValue={id} name="id" />
            <input type="hidden" defaultValue={data.brand} name="brand" />
            <input type='hidden' value='smsClient' name='intent' />
            <input type='hidden' value={today} name='lastContact' />

            <div className="mt-[25px] flex justify-end">
              <Dialog.Close asChild>

                <Toast.Provider swipeDirection="right">
                  <button name='emailType' value='smsClient' type='submit'
                    className="bg-[#02a9ff] w-[75px] ml-2  mr-2 active:text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
                  >
                    Send
                  </button>
                  <Toast.Root
                    open={open}
                    onOpenChange={setOpen}
                    className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
                  >
                    <Toast.Title className="text-slate12 mb-[5px] text-[15px] font-medium [grid-area:_title]">
                      Sent Email to {data.firstName}.
                    </Toast.Title>
                    <Toast.Description asChild></Toast.Description>
                  </Toast.Root>
                  <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[250vw] list-none  flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
                </Toast.Provider>
              </Dialog.Close>

            </div>
          </fetcher.Form >
          <Dialog.Close asChild>
            <button
              className=" hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/*
export function EmailClient2() {
  const { finance } = useLoaderData();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const promise2 = fetch('/dashboard/calls', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    const promise1 = fetch('/emails/send/payments', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    Promise.all([promise1, promise2])
      .then((responses) => {
        for (const response of responses) {
          console.log(`${response.url}: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
  }

  const id = finance.id ? finance.id.toString() : '';


  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>Email</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-blackA6" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Email
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-mauve11"></Dialog.Description>
          <Form method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Subject
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="subject"
                placeholder="Subject"
              />
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Preview - ie on the email console, it shows a breif preview of
                the email
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="preview"
                placeholder="Preview"
              />
              <label
                className="w-[90px] text-left text-[15px]"
                htmlFor="username"
              >
                Body
              </label>
              <TextArea
                placeholder="Type your email here."
                name="customContent"
                className="mt-2 h-[250px]"
              />
            </div>
            <input
              type="hidden"
              value={finance.firstName}
              name="customerFirstName"
            />
            <input
              type="hidden"
              value={finance.lastName}
              name="customerLastName"
            />


            <input type='hidden' value={finance.firstName} name='customerFirstName' />
            <input type='hidden' value={finance.lastName} name='customerLastName' />
            <input type='hidden' value={finance.email} name='customerEmail' />
            <input type="hidden" defaultValue={finance.userEmail} name="userEmail" />
            <input type="hidden" defaultValue={finance.id} name="financeId" />
            <input type="hidden" defaultValue={id} name="id" />
            <input type="hidden" defaultValue={finance.brand} name="brand" />
            <input type='hidden' value='fullCustom' name='emailType' />
            <input type='hidden' value='Reached' name='customerState' />
            <input type='hidden' value='2DaysFromNow' name='intent' />

            <div className="mt-[25px] flex justify-end">
              <button
                name="emailType"
                value="fullCustom"
                type="submit"
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Send
              </button>
            </div>
          </Form>
          <Dialog.Close asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 *
export default function EmailClient({ data }) {
  const { dashBoardCustURL } = useLoaderData();
  console.log(dashBoardCustURL)
  if (dashBoardCustURL === "/dashboard/calls") {
   return (
    <EmailClient1 data={data} />
   )
  }
  else {
    EmailClient2()
  }
}

export function EmailClient2() {
  const { finance } = useLoaderData();
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>Email</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-blackA6" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Email
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-mauve11"></Dialog.Description>
          <Form method="post" action="/emails/send/payments">
            <div className="flex flex-col">
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Subject
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="subject"
                placeholder="Subject"
              />
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Preview - ie on the email console, it shows a breif preview of
                the email
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="preview"
                placeholder="Preview"
              />
              <label
                className="w-[90px] text-left text-[15px]"
                htmlFor="username"
              >
                Body
              </label>
              <TextArea
                placeholder="Type your email here."
                name="customContent"
                className="mt-2 h-[250px]"
              />
            </div>
            <input
              type="hidden"
              value={finance.firstName}
              name="customerFirstName"
            />
            <input
              type="hidden"
              value={finance.lastName}
              name="customerLastName"
            />
            <input type="hidden" value={finance.email} name="customerEmail" />
            <input type="hidden" value="fullCustom" name="emailType" />
            <input type="hidden" value="Reached" name="customerState" />
            <input type="hidden" value="2DaysFromNow" name="intent" />
            <div className="mt-[25px] flex justify-end">
              <button
                name="emailType"
                value="fullCustom"
                type="submit"
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Send
              </button>
            </div>
          </Form>
          <Dialog.Close asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


const EmailClient1 = ({ data }) => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Mail />
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                    Email
                </Dialog.Title>
                <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                </Dialog.Description>
                <Form method="post" action="/emails/send/payments">
                    <div className='flex flex-col'>
                        <label className=" w-full text-left text-[15px]" htmlFor="name">
                            Subject
                        </label>
                        <input
                            className=" shadow-violet7 focus:shadow-violet8 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="name"
                            name='subject'
                            placeholder="Subject"
                        />
                        <label className=" w-full text-left text-[15px]" htmlFor="name">
                            Preview - ie on the email console, it shows a breif preview of the email
                        </label>
                        <input
                            className=" shadow-violet7 focus:shadow-violet8 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="name"
                            name='preview'
                            placeholder="Preview"
                        />
                        <label className="w-[90px] text-left text-[15px]" htmlFor="username">
                            Body
                        </label>
                        <TextArea
                            placeholder="Type your email here."
                            name="customContent"
                            className="h-[250px] mt-2"
                        />
                    </div>
                    <input type='hidden' value={data.firstName} name='customerFirstName' />
                    <input type='hidden' value={data.lastName} name='customerLastName' />
                    <input type='hidden' value={data.email} name='customerEmail' />
                    <input type='hidden' value= name='intent' />

                    <input type='hidden' value='fullCustom' name='emailType' />
                    <input type='hidden' value='Reached' name='customerState' />
                    <input type='hidden' value='2DaysFromNow' name='intent' />
                    <div className="mt-[25px] flex justify-end">
                        <button name='emailType' value='fullCustom' type='submit' className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                            Send
                        </button>
                    </div>
                </Form>
                <Dialog.Close asChild>
                    <button
                        className=" hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                    >
                        <WebWindowClose />
                    </button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

 */
