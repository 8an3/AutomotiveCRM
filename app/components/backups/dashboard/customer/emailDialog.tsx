import * as Dialog from '@radix-ui/react-dialog';
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea } from '~/components/ui/index'
import { useLoaderData, Form, useFetcher } from '@remix-run/react'
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose } from "iconoir-react";

export default function EmailDialog() {
  const { finance, user, financeNotes } = useLoaderData()
  const fetcher = useFetcher()
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="none" strokeWidth="1.2" viewBox="0 0 24 24" color="#000000"><path stroke="#000000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="m9 9 4.5 3L18 9M3 13.5h2M1 10.5h4"></path><path stroke="#000000" strokeWidth="1.2" strokeLinecap="round" d="M5 7.5V7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-.5"></path></svg>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[500px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Email
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          </Dialog.Description>
          <div className="w-[90%] mx-auto mt-2">
            <fetcher.Form method="post" action="/emails/send/payments">
              <div className='flex flex-col mt-2'>

                <Input
                  className=" h-8 shadow-violet7 focus:shadow-violet8 inline-flex w-full flex-1 items-center justify-cente px-[10px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="name"
                  name='subject'
                  placeholder="Subject"
                />

                <Input
                  className="mt-2 h-8 shadow-violet7 focus:shadow-violet8 inline-flex  w-full flex-1 items-center justify-center px-[10px] shadow-[0_0_0_1px] leading-none outline-none focus:shadow-[0_0_0_2px]"
                  id="name"
                  name='preview'
                  placeholder="Preview"
                />

                <TextArea
                  placeholder="Type your email here."
                  name="customContent"
                  className="
                          h-[250px] mt-2
                          rounded-[0px]"
                />
              </div>
              <input type='hidden' value={finance.firstName} name='customerFirstName' />
              <input type='hidden' value={finance.lastName} name='customerLastName' />
              <input type='hidden' value={finance.email} name='customerEmail' />

              <input type='hidden' value='fullCustom' name='emailType' />
              <input type='hidden' value='Reached' name='customerState' />
              <input type='hidden' value='2DaysFromNow' name='intent' />
              <div className="mt-[25px] flex justify-end">
                <button name='emailType' value='fullCustom' type='submit' className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                  Send
                </button>
              </div>
            </fetcher.Form>
          </div>
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
  )
}
