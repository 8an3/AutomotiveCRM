import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import { response } from "express";
import financeFormSchema from "~/routes/overviewUtils/financeFormSchema";
import React, { useEffect, useRef, useState } from 'react';
import * as Toast from "@radix-ui/react-toast";

import { getTemplatesByEmail } from "~/utils/emailTemplates/template.server";
import { authenticator } from "~/services/auth-service.server";
import { json } from "@remix-run/node";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { prisma } from "~/libs";



export default function EmailClient() {
  // const { getTemplates } = useLoaderData();
  /// console.log(getTemplates, 'getTemplates')
  // console.log(data, 'getTemplates')
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const { getTemplates, user, finance } = useLoaderData();


  const [templates, setTemplates] = useState(getTemplates);

  //console.log(templates, 'data')

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const today = new Date();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [text, setText] = React.useState('');

  const [cc, setCc] = useState(false)
  const [bcc, setBcc] = useState(false)


  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  React.useEffect(() => {
    if (selectedTemplate) {
      setText(selectedTemplate.body);
    }
  }, [selectedTemplate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      customerFirstName: formData.get('customerFirstName'),
      customerLastName: formData.get('customerLastName'),
      customerEmail: formData.get('customerEmail'),
      financeId: formData.get('financeId'),
      userEmail: formData.get('userEmail'),
      brand: formData.get('brand'),
      id: formData.get('id'),
      intent: formData.get('intent'),
      template: formData.get('template'),
      customContent: formData.get('customContent'),
    }
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    /**clientFname ${clientFname}  clientLname ${clientLname} clientFullName ${clientFullName} clientPhone  ${clientPhone} clientEmail ${clientEmail} clientCell ${clientCell} clientAddress ${clientAddress} clientCity ${clientCity} clientProvince ${clientProvince} clientPostalCode  ${clientPostalCode} year ${year} brand ${brand} model ${model} trim ${trim} stockNumber ${stockNumber} tradeYear ${tradeYear} tradeMake ${tradeMake} tradeDesc ${tradeDesc} vin ${vin} color ${color}  tradeColor ${tradeColor}   tradeValue ${tradeValue} tradeMileage ${tradeMileage}  firstName ${userFname}  userFullName ${userFullName} userPhone ${userPhone} userEmail ${userEmail} userCell ${userCell} */
    const template = formData.get('template')

    if (template === "createEmailTemplate") {
      console.log('hit template')
      const promise2 = fetch('/emails/send/form', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          console.log(`${response.url}: ${response.status}`);
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });
      console.log(promise2, 'promise2')

    } else {
      console.log('hit else')

      const promise2 = fetch('/emails/send/form', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          console.log(`${response.url}: ${response.status}`);
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });
      console.log(promise2, 'promise2')

      // Make second request
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

      Promise.all([promise2, promise1])
        .then((responses) => {
          for (const response of responses) {
            console.log(`${response}: ${response}`);
          }
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });
    }
  }



  // const id = data.id

  let formRef = useRef();

  const fetcher = useFetcher();
  let isAdding = fetcher.state === "submitting" && fetcher.formData?.get("intent") === "2DaysFromNow";

  // const [open, setOpen] = React.useState(false);
  const timerRef = useRef(0);
  /**
   *   useEffect(() => {
      setOpen(false);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setOpen(true);
      }, 100);
      if (!isAdding) {
        formRef.current?.reset();
      }
    }, [isAdding]);


   */

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <p
          className="cursor-pointer text-[#EEEEEE] hover:text-[#02a9ff] target:text-[#02a9ff]" >
          <Mail className="" />
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" bg-background/80 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] md:w-[750px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Email
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          </Dialog.Description>
          <fetcher.Form method="post" onSubmit={handleSubmit} ref={formRef}>
            <div className='flex flex-col'>
              <label className=" w-full mt-3 text-left text-[15px]" htmlFor="name">
                Subject
              </label>
              <Input
                className=" shadow-violet7 focus:shadow-violet8 inline-flexw-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="name"
                name='subject'
                value={selectedTemplate?.subject}
                placeholder="Subject"
              />
              <label className=" w-full text-left mt-3 text-[15px]" htmlFor="name">
                Preview - ie on the email console, it shows a breif preview of the email
              </label>
              <Input
                className=" shadow-violet7 focus:shadow-violet8 inline-flex w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="name"
                name='preview'
                placeholder="Preview"
              />
              <label className=" w-full text-left mt-3 text-[15px]" htmlFor="name">
                Templates
              </label>
              <select
                className={`border-black text-black placeholder:text-blue-300 broder justifty-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                onChange={handleChange}>
                <option value="">Select a template</option>
                {templates && templates.filter(template => template.type === 'email').map((template, index) => (
                  <option key={index} value={template.title}>
                    {template.title}
                  </option>
                ))}
              </select>
              {selectedTemplate && (
                <div className="mt-3">
                  <p>{selectedTemplate.dept} - {selectedTemplate.type} - {selectedTemplate.category}</p>
                  {/* Add more input fields as needed */}
                </div>
              )}
              <div className="ml-auto flex px-2  ">
                <p
                  onClick={() => setCc(!cc)}
                  className="hover:text-[#02a9ff]  cursor-pointer px-2 text-right text-[12px]">
                  cc
                </p>
                <p
                  onClick={() => setBcc(!bcc)}
                  className="hover:text-[#02a9ff]  cursor-pointer px-2 text-right text-[12px] ">
                  bcc
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {cc && (
                  <Input placeholder="cc:" name='ccAddress' className="rounded" />
                )}
                {bcc && (
                  <Input placeholder="bcc:" name="bccAddress" className="rounded" />
                )}
              </div>
              <label className="w-[90px] mt-3 text-left text-[15px]" htmlFor="username">
                Body
              </label>
              <TextArea
                value={text}
                name="customContent"
                className="border-black"
                placeholder="Type your message here."
                ref={textareaRef}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <input type='hidden' value={finance[0].firstName} name='firstName' />
            <input type='hidden' value={finance[0].lastName} name='lastName' />
            <input type='hidden' value={finance[0].email} name='email' />
            <input type="hidden" defaultValue={finance[0].userEmail} name="userEmail" />
            <input type="hidden" defaultValue={finance[0].id} name="financeId" />
            <input type="hidden" defaultValue={finance[0].id} name="id" />
            <input type="hidden" defaultValue={finance[0].brand} name="brand" />
            <input type='hidden' value='fullCustom' name='emailType' />
            <input type='hidden' value='Attempted' name='customerState' />
            <input type='hidden' value='Outgoing' name='direction' />
            <input type='hidden' value='EmailClient' name='intent' />
            <input type='hidden' value={today} name='lastContact' />
            <div className="mt-[25px] flex justify-end">
              <Button
                onClick={() => {
                  setIsButtonPressed(true);
                }}
                name='template' value='createEmailTemplate' type='submit'
                className={`w-[75px] ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
              >
                Save Template
              </Button>
              <Button
                onClick={() => {
                  setIsButtonPressed(true);
                }}
                name='emailType' value='fullCustom' type='submit'
                className={`w-[75px] ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
              >
                Send
              </Button>
            </div>
          </fetcher.Form >
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
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
