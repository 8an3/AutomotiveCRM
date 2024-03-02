import {
  useLoaderData,
  Form,
  useRouteLoaderData,
  useFetcher,
} from "@remix-run/react";
import {
  Input,
  Button,
  Separator,
  Checkbox,
  PopoverTrigger,
  PopoverContent,
  Popover,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/index";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/other/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/other/tabs";

import * as Toast from "@radix-ui/react-toast";
import React, { useEffect, useState } from "react";
import { DataFeesFunction } from "~/components/lists/financeFees";
import { VehichleDetailsFunction } from "~/components/lists/vehicleInfo";
import { FinanceOptionsFunction } from "~/components/lists/financeOptions";
import * as Dialog from '@radix-ui/react-dialog';

const ClientVehicleCard = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const id = data.id ? data.id.toString() : "";

  let finance;
  const brand = data.make
  return (
    <Sheet>
      <SheetTrigger asChild>

        <p className="hover:text-[#02a9ff]">
          {data.model}
        </p>
      </SheetTrigger>
      <SheetHeader>
        <SheetTitle>
          <SheetContent side='left' className='bg-[#1c2024] w-full md:w-[50%] mt-3 ml-3 mr-3 overflow-y-auto   shadow-[0_2px_10px]' >

            <h3 className="text-2xl font-thin text-[#c7c7cb]">CLIENT VEHICLE CARD</h3>

            <Form method='post'>
              <div className="grid grid-cols-1 text-[#c7c7cb]">
                {/* Left column with inputs */}
                <div>
                  <div className="mx-3 my-3 w-[90%]">
                    <p className=" ml-3 text-sm text-[#c7c7cb]">Purchasing</p>
                    {VehichleDetailsFunction({
                      data,
                      finance,
                    }).map((fee, index) => (
                      <div key={index}>
                        <Input
                          name={fee.name}
                          defaultValue={fee.value}
                          placeholder={fee.placeHolder}
                          className="mt-2 h-8"
                          readOnly={fee.readOnly}

                        />
                      </div>
                    ))}
                    <Input type="hidden" defaultValue={data.id} name="financeId" />
                    <Input type="hidden" defaultValue={id} name="id" />
                    <Input type="hidden" defaultValue={data.brand} name="brand" />
                    <Input type="hidden" defaultValue='updateFinance' name="intent" />

                  </div>
                  <div className="mx-3 my-3 w-[90%]">
                    <Tabs defaultValue="price" className="my-x mx-3 w-[90%]">
                      <TabsList className="flex w-full flex-row  ">
                        <TabsTrigger value="price">Price</TabsTrigger>
                        <TabsTrigger value="Finance">Finance</TabsTrigger>
                        <TabsTrigger value="Options">Options</TabsTrigger>
                        <TabsTrigger value="Acc">Acc</TabsTrigger>
                      </TabsList>
                      <TabsContent value="price">
                        {DataFeesFunction({ data, finance })
                          .filter(
                            (fee) =>
                              fee.value > 0 &&
                              fee.value !== "on" &&
                              fee.value !== "0"
                          )
                          .map((fee, index) => (
                            <div
                              key={index}
                              className="mt-1 flex flex-wrap  text-slate1  justify-between "
                            >
                              <p className="mt-1 basis-2/4 text-slate1  text-sm font-thin">
                                {fee.name}
                              </p>
                              <p className="flex basis-2/4  items-end   text-slate1   justify-end text-sm font-thin ">
                                ${fee.value}
                              </p>
                            </div>
                          ))}
                        {data.desiredPayments === "Standard Payment" && (
                          <>
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4  text-slate1  text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4  items-end text-slate1   justify-end  text-right text-sm font-thin ">
                                W/O Deposit ${data.total}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                              <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                                ${data.onTax}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "Payments with Options" && (
                          <>
                            <div className="mt-2 flex flex-wrap justify-between text-slate1 ">
                              <p className="mt-2 basis-2/4  text-slate1  text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4 text-slate1  items-end  justify-end text-right text-sm font-thin ">
                                W/O Deposit ${data.totalWithOptions}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap text-slate1  justify-between ">
                              <p className="mt-2 basis-2/4 text-slate1   text-sm  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                                ${data.qcTax}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment" && (
                          <>
                            <div className="mt-2 flex flex-wrap text-slate1  justify-between ">
                              <p className="mt-2 basis-2/4  text-slate1  text-sm  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  text-slate1  items-end   justify-end  text-right text-sm font-thin ">
                                W/O Deposit ${data.native}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment with Options" && (
                          <>
                            <div className="mt-2 flex flex-wrap text-slate1  justify-between ">
                              <p className="mt-2 basis-2/4 text-slate1   text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4  items-end text-slate1   justify-end  text-right text-sm font-thin ">
                                W/O Deposit ${data.totalWithOptions}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "Custom Tax Payment" && (
                          <>
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                                W/O Deposit ${data.total}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  items-end   justify-end  text-right text-sm font-thin ">
                                ${data.otherTax}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments ===
                          "Custom Tax Payment with Options" && (
                            <>
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2 basis-2/4   text-sm  font-thin">
                                  Total
                                </p>
                                <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                                  W/O Deposit ${data.totalWithOptions}
                                </p>
                              </div>
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2 basis-2/4   text-sm  font-thin">
                                  After Tax
                                </p>
                                <p className="flex basis-2/4  items-end   justify-end  text-right text-sm font-thin ">
                                  ${data.otherTaxWithOptions}
                                </p>
                              </div>
                            </>
                          )}

                        <div className="mt-2 flex flex-wrap justify-between ">
                          <p className="mt-2 basis-2/4   text-sm  font-thin">
                            Deposit
                          </p>
                          <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                            ${data.deposit}
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="Finance">
                        <div className="mt-2 flex flex-wrap justify-between ">
                          <p className="mt-2 basis-2/4   text-sm  font-thin">
                            Desposit
                          </p>
                          <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                            ${data.deposit}
                          </p>
                          <p className="mt-2 basis-2/4   text-sm  font-thin">
                            Term
                          </p>
                          <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                            {data.months}
                          </p>
                          <p className="mt-2 basis-2/4   text-sm  font-thin">
                            Rate
                          </p>
                          <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                            {data.iRate}%
                          </p>
                        </div>
                        {data.desiredPayments === "Standard Payment" && (
                          <>
                            <p className="mt-2 basis-2/4   text-sm  font-thin">
                              Standard
                            </p>
                            <hr className="solid" />
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Monthly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.on60}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Bi-weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.biweekly}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.weekly}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "Payments with Options" && (
                          <>
                            <p className="mt-2 basis-2/4   text-sm  font-thin">
                              Standard W/ Options
                            </p>
                            <hr className="solid" />
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Monthly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.qc60}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Bi-weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.biweeklyqc}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.weeklyqc}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment" && (
                          <>
                            <p className="mt-2 basis-2/4   text-sm  font-thin">
                              Tax Exempt
                            </p>
                            <hr className="solid" />
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Monthly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.nat60}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Bi-weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.biweeklNat}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.weeklylNat}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment with Options" && (
                          <>
                            <p className="mt-2 basis-2/4   text-sm  font-thin">
                              Tax Exempt
                            </p>
                            <hr className="solid" />
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Monthly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.oth60}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Bi-weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.biweekOth}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.weeklyOth}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "Custom Tax Payment" && (
                          <>
                            <p className="mt-2 basis-2/4   text-sm  font-thin">
                              Tax Exempt
                            </p>
                            <hr className="solid" />
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Monthly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.nat60WOptions}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Bi-weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.biweeklNatWOptions}
                              </p>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Weekly
                              </p>
                              <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                ${data.weeklylNatWOptions}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments ===
                          "Custom Tax Payment with Options" && (
                            <>
                              <p className="mt-2 basis-2/4   text-sm  font-thin">
                                Tax Exempt
                              </p>
                              <hr className="solid" />
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2 basis-2/4   text-sm  font-thin">
                                  Monthly
                                </p>
                                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                  ${data.oth60WOptions}
                                </p>
                                <p className="mt-2 basis-2/4   text-sm  font-thin">
                                  Bi-weekly
                                </p>
                                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                  ${data.biweekOthWOptions}
                                </p>
                                <p className="mt-2 basis-2/4   text-sm  font-thin">
                                  Weekly
                                </p>
                                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                                  ${data.weeklyOthWOptions}
                                </p>
                              </div>
                            </>
                          )}
                      </TabsContent>
                      <TabsContent value="Options">
                        {/* loading all and every option may be too consuming of internet resources, if they want to see the options and accessories they can go to the quote itself */}
                        <p className="mt-2  basis-2/4   text-sm font-thin">
                          Finance Products
                        </p>
                        <Separator />

                        {FinanceOptionsFunction({
                          data,
                          finance,
                        }).map((fee, index) => {
                          if (
                            fee.value > 0 &&
                            fee.value !== "on" &&
                            fee.value !== "0"
                          ) {
                            return (
                              <div
                                key={index}
                                className="mt-2 flex flex-wrap justify-between "
                              >
                                <p className="mt-2  basis-2/4   text-sm font-thin">
                                  {fee.name}
                                </p>
                                <p className="flex basis-2/4   items-end  justify-end text-sm font-thin ">
                                  ${fee.value}
                                </p>
                              </div>
                            );
                          }
                          return null; // Return null for fees that don't meet the condition
                        })}
                        <p className="mt-2  basis-2/4   text-sm font-thin">
                          Vehichle Options
                        </p>
                        <Separator />

                        <p className="mt-2  basis-2/4   text-sm font-thin">
                          Parts & Acc
                        </p>
                        <Separator />
                      </TabsContent>
                      <TabsContent value="Acc"></TabsContent>
                    </Tabs>
                  </div>
                </div>
                {/* right column with inputs */}
                <div>
                  <div className="mx-3 my-3 w-[90%]">
                    <h3 className="text-2xl font-thin">TRADE</h3>
                    <Input
                      className="mr-3 mt-2 h-8  text-right "
                      placeholder="Make"
                      name="tradeMake"
                      defaultValue={data.tradeMake}
                    />
                    <Input
                      className="mt-2 h-8 pr-5  text-right "
                      placeholder="Model"
                      name="tradeDesc"
                      defaultValue={data.tradeDesc}
                    />
                    <Input
                      className="mt-2  h-8  text-right "
                      placeholder="Year"
                      name="tradeYear"
                      defaultValue={data.tradeYear}
                    />
                    <Input
                      className="mt-2 h-8  text-right "
                      placeholder="Trim"
                      name="tradeTrim"
                      defaultValue={data.tradeTrim}
                    />
                    <Input
                      className="mt-2  h-8  text-right "
                      placeholder="Color"
                      name="tradeColor"
                      defaultValue={data.tradeColor}
                    />
                    <Input
                      className="mt-2  h-8 text-right "
                      placeholder="vin"
                      name="tradeVin"
                      defaultValue={data.tradeVin}
                    />
                  </div>
                  <div className="mx-3 my-3 grid w-[90%] grid-cols-2 p-2">
                    <p className=" text-sm ">Trade Value</p>
                    <Input
                      className="  ml-3 h-8 w-auto  text-right  text-sm "
                      name="tradeValue"
                      defaultValue={data.tradeValue}
                    />
                    <p className=" mt-2  text-sm ">Needed Repairs</p>
                    <Input
                      className="  ml-3 mt-2 h-8  w-auto  text-right  text-sm "
                      name="tradeRepairs"
                      defaultValue={data.tradeRepairs}
                    />
                    <p className=" mt-2  text-sm ">Trade Seen</p>
                    {data.seenTrade === "off" && (
                      <p className=" mt-2 text-right  text-sm ">No</p>
                    )}
                    {data.seenTrade === "on" && (
                      <p className=" mt-2 text-right  text-sm ">Yes</p>
                    )}
                  </div>
                </div>
                {/* Button Group */}
                <input type='hidden' name='financeId' value={data.id} />
                <input type='hidden' name='userEmail' value={data.userEmail} />
                <input type='hidden' name='brand' value={data.brand} />
                <input type='hidden' name='clientfileId' value={data.clientfileId} />

                <div className="mb-auto mr-auto p-3">
                  <Toast.Provider swipeDirection="right">
                    <button
                      onClick={() => {
                        setOpen(false);
                        window.clearTimeout(timerRef.current);
                        timerRef.current = window.setTimeout(() => {
                          setOpen(true);
                        }, 100);
                      }}
                      name="intent"
                      type="submit"
                      className="ml-auto mr-10 cursor-pointer hover:text-[#02a9ff] hover:text-[#02a9ff]"
                      value="updateFinance"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26px"
                        height="26px"
                        fill="none"
                        strokeWidth="1.2"
                        viewBox="0 0 24 24"
                        color="#c7c7cb"
                      >
                        <path
                          stroke="#c7c7cb"
                          strokeWidth="1.2"
                          d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                        ></path>
                        <path
                          stroke="#c7c7cb"
                          strokeWidth="1.2"
                          d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                        ></path>
                      </svg>
                    </button>

                    <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[250vw] list-none  flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
                  </Toast.Provider>
                </div>
              </div>
            </Form>

          </SheetContent>
        </SheetTitle>
      </SheetHeader>
    </Sheet>
  );
}
export default ClientVehicleCard;
