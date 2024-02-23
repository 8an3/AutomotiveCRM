// https://github.com/remix-run/examples/tree/main/file-and-cloudinary-upload
import React, { useState, useEffect, useRef } from "react";
import { Form, } from "@remix-run/react";
import { Textarea } from "~/other/textarea";
import { Button, Input } from "~/components";
import * as Toast from '@radix-ui/react-toast';
import * as Dialog from '@radix-ui/react-dialog';
import { useRootLoaderData } from "~/hooks";


export default function NewTemplate() {
  const [clientAtrState, seClientAtr] = useState("");
  const [tradeVehAttrState, setTradeVehAttrState] = useState("");
  const [wantedVehAttrState, setWantedVehAttrState] = useState("");
  const [salesPersonAttrState, setSalesPersonAttrState] = useState("");
  const [FandIAttrState, setFandIAttrState] = useState("");
  const textareaRef = useRef(null);
  const { user } = useRootLoaderData()
  const [cc, setCc] = useState(false)
  const [bcc, setBcc] = useState(false)
  const [open, setOpen] = React.useState(false);
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const [details, setDetails] = useState(false);
  const clientAtr =
  {
    "Title": "{clientTitle}",
    "First Name": "{clientFname}",
    "Last Name": "{clientLname}",
    "Full Name": "{clientFullName}",
    "Phone": "{clientPhone}",
    'Email': '{clientEmail}',
    'Company Name': '{clientCompanyName}',
    'Cell #': '{clientCell}',
    'Address': '{clientAddress}',
    'City': '{clientCity}',
    'Province': '{clientProvince}',
    'Postal Code': '{clientPostalCode}',
    'Country': '{clientCountry}',
  }

  const wantedVehAttr = {
    'Year': "{year}",
    "Brand": "{brand}",
    "Model": "{model}",
    "Trim": "{trim}",
    "Stock Number": "{stockNumber}",
    "VIN": "{vin}",
    'Color': '{color}',
    'Balance': '{balance}',
  }

  const tradeVehAttr = {
    'Year': "{tradeYear}",
    "Brand": "{tradeMake}",
    "Model": "{tradeDesc}",
    "Trim": "{tradeTrim}",
    "VIN": "{tradeVin}",
    'Color': "{tradeColor}",
    'Trade Value': "{tradeValue}",
    'Mileage': '{tradeMileage}',
  }

  const salesPersonAttr = {
    'First Name': "{userFname}",
    "Full Name": "{userFullName}",
    "Phone or EXT": "{userPhone}",
    'Email': "{userEmail}",
    'Cell #': "{userCell}",
  }

  const FandIAttr = {
    'Institution': "{fAndIInstitution}",
    "Assigned Manager": "{fAndIFullName}",
    "Email": "{fAndIEmail}",
    "Name": "{fAndIFullName}",
    'Phone # or EXT': "{fAndIPhone}",
    'Cell #': "{fAndICell}",
  }


  function insertAtCursor(value) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert value at cursor position
    textarea.value = textarea.value.substring(0, start) + value + textarea.value.substring(end);

    // Move the cursor after the inserted value

    textarea.selectionStart = textarea.selectionEnd = start + value.length;

  }

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8  justify-between lg:flex cursor-pointer hover:text-[#02a9ff]"
          >
            <div className="flex w-full items-center justify-between text-slate1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-plus-2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M3 15h6" /><path d="M6 12v6" /></svg>

            </div>
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-background/80 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="fixed top-[50%] border  border-black left-[50%] max-h-[85vh] w-full md:w-3/4 translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#5cdb95] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">

            <div   >
              <div className="flex flex-col space-y-4 bg-[#5cdb95] ">
                {/* Row 1 */}
                <div className="flex justify-between  ">
                  <div className="flex items-center justify-start">
                    <div className="cursor-pointer p-2 hover:text-[#02a9ff]"  >
                      <Dialog.Close asChild>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-x-circle"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="m15 9-6 6" />
                          <path d="m9 9 6 6" />
                        </svg>
                      </Dialog.Close>
                    </div>
                  </div>

                </div>
              </div>
              <div className={` bg-bg-[#5cdb95]  w-[100vw] items-center overflow-x-hidden  shadow-sm transition-all duration-500 md:w-[50%] `}   >

                {/* Your content here */}
                <Form method="post">
                  <div className="bg-[#5cdb95] mx-auto ml-4 mr-4 grid grid-cols-1 justify-center gap-4">
                    {/* Row 1 */}
                    <div className="py-1">
                      <Input
                        name="title"
                        placeholder="Email Template Title"

                        className="border-[#379683]  border placeholder-[#05386b] text-[#05386b]  bg-[#5cdb95]"
                      />
                    </div>
                    {/* Row 2 */}
                    <div className="py-1">
                      <div className="flex flex-row justify-between">
                        <select name="dept" className={`border-[#379683] text-[#05386b] placeholder-[#05386b] placeholder:text-blue-300 broder  justifty-start h-8  cursor-pointer rounded border bg-[#5cdb95]  px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] `}
                        >
                          <option value="">Select a Dept</option>
                          <option value="Sales">Sales</option>
                          <option value="Service">Service</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Management">Management</option>
                          <option value="After Sales">After Sales</option>
                          <option value="Other">Other</option>
                        </select>
                        <select name="type" className={`border-[#05386b] text-[#379683] placeholder:text-blue-300 broder ml-2 justifty-start h-8  cursor-pointer rounded border bg-[#5cdb95]  px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] mr-2`}
                        >
                          <option value="">Select Type</option>
                          <option value="Phone">Phone</option>
                          <option value="Email">Email</option>
                          <option value="Text">Text</option>
                          <option value="Copy">Copy</option>
                          <option value="Advertising">Advertising</option>
                        </select>
                        <Input
                          name="category"
                          type="text"
                          placeholder="Template category, ie Follow-up, Service Reminder"
                          className=" border-[#379683] text-[#05386b]  w-1/2 border bg-[#5cdb95]"
                        />
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="py-1">
                      <Input
                        name="subject"
                        placeholder="Subject"
                        className="border-[#379683] text-[#05386b]   border bg-[#5cdb95]"
                      />
                    </div>
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
                    <Input
                      name="intent"
                      type="hidden"
                      defaultValue="createTemplate"
                    />
                    <Input
                      name="userEmail"
                      type="hidden"
                      defaultValue={user.email}
                    />
                    <div className="py-1">
                      <div
                        onClick={() => setDetails(!details)}
                        className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                      >
                        <p>Dynamic Variables</p>
                      </div>
                    </div>
                    {/* Details */}
                    {details && (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <select
                            className={`border-black text-black placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-slate12 px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                            value={clientAtrState}
                            onChange={(e) => {
                              seClientAtr(e.target.value);
                              // Insert the value at the cursor position in the text editor
                              insertAtCursor(clientAtr[e.target.value]);
                            }}
                          >
                            <option value="">Client</option>
                            {Object.entries(clientAtr).map(([title, value]) => (
                              <option key={title} value={title}>
                                {title}
                              </option>
                            ))}
                          </select>
                          <select
                            className={`border-black text-black placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-slate12 px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                            value={wantedVehAttrState}
                            onChange={(e) => {
                              setWantedVehAttrState(e.target.value);
                              // Insert the value at the cursor position in the text editor
                              insertAtCursor(wantedVehAttr[e.target.value]);
                            }}
                          >
                            <option value="">Wanted Veh</option>
                            {Object.entries(wantedVehAttr).map(([title, value]) => (
                              <option key={title} value={title}>
                                {title}
                              </option>
                            ))}
                          </select>
                          <select
                            className={`border-black text-black placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-slate12 px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                            value={tradeVehAttrState}
                            onChange={(e) => {
                              setTradeVehAttrState(e.target.value);
                              // Insert the value at the cursor position in the text editor
                              insertAtCursor(tradeVehAttr[e.target.value]);
                            }}
                          >
                            <option value="">Trade Veh</option>
                            {Object.entries(tradeVehAttr).map(([title, value]) => (
                              <option key={title} value={title}>
                                {title}
                              </option>
                            ))}
                          </select>
                          <select
                            className={`border-black text-black placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-slate12 px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                            value={salesPersonAttrState}
                            onChange={(e) => {
                              setSalesPersonAttrState(e.target.value);
                              // Insert the value at the cursor position in the text editor
                              insertAtCursor(salesPersonAttr[e.target.value]);
                            }}
                          >
                            <option value="">Sales Person</option>
                            {Object.entries(salesPersonAttr).map(([title, value]) => (
                              <option key={title} value={title}>
                                {title}
                              </option>
                            ))}
                          </select>
                          <select
                            className={`border-black text-black placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-slate12 px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                            value={FandIAttrState}
                            onChange={(e) => {
                              setFandIAttrState(e.target.value);
                              // Insert the value at the cursor position in the text editor
                              insertAtCursor(FandIAttr[e.target.value]);
                            }}
                          >
                            <option value="">F & I Manager</option>
                            {Object.entries(FandIAttr).map(([title, value]) => (
                              <option key={title} value={title}>
                                {title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <div className=" p-1">
                      <div className="mr-auto px-2">
                        <Textarea
                          name="body"
                          className="border-black"
                          placeholder="Type your message here."
                          ref={textareaRef} />
                        <br />
                        <Toast.Provider swipeDirection="right">
                          <Button className="border-black cursor-pointer border uppercase">
                            Save
                          </Button>
                          <Toast.Root
                            className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                            open={open}
                            onOpenChange={setOpen}
                          >
                            <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                              Updated Template
                            </Toast.Title>
                            <Toast.Description asChild>

                            </Toast.Description>
                            <Toast.Action className="[grid-area:_action]" asChild altText="Goto schedule to undo">
                            </Toast.Action>
                          </Toast.Root>
                          <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
                        </Toast.Provider>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div >
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
