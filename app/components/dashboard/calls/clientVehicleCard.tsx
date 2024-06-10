
import {
  useLoaderData,
  Form,
  useRouteLoaderData,
  useFetcher,
  useNavigate,
  useSubmit,
  useActionData,
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
} from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ButtonLoading } from "~/components/ui/button-loading";
import UnitPicker from '../unitPicker/unitPicker'
import { dashboardAction, dashboardLoader } from "activix/dashboardCallsActivix";
import { Toaster, toast } from 'sonner'

import React, { useEffect, useRef, useState } from "react";
import { prisma } from "~/libs";
import { json } from "@remix-run/node";


export default function ClientVehicleCard({ data, }) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const id = data.id ? data.id.toString() : "";



  let finance;
  const Dealerfees = [
    { name: "userAdmin", value: data.userAdmin, placeholder: "Admin" },
    { name: "userFreight", value: data.userFreight, placeholder: "Freight" },
    { name: "userCommodity", value: data.userCommodity, placeholder: "Commodity" },
    { name: "userPDI", value: data.userPDI, placeholder: "PDI" },
    { name: "userAirTax", value: data.userAirTax, placeholder: "Air Tax" },
    { name: "userTireTax", value: data.userTireTax, placeholder: "Tire Tax" },
    { name: "userGovern", value: data.userGovern, placeholder: "Government Fees" },
    { name: "userFinance", value: data.userFinance, placeholder: "Finance Fees" },
    { name: "destinationCharge", value: data.destinationCharge, placeholder: "Destination Charge" },
    { name: "userGasOnDel", value: data.userGasOnDel, placeholder: "Gas On Delivery" },
    { name: "userMarketAdj", value: data.userMarketAdj, placeholder: "Market Adjustment" },
    { name: "userDemo", value: data.userDemo, placeholder: "Demonstratration Fee" },
    { name: "userOMVIC", value: data.userOMVIC, placeholder: "OMVIC or Other" },
  ];


  const FinanceOptions = [
    { name: "userExtWarr", value: data.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: data.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: data.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", data: data.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: data.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: data.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: data.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: data.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: data.userOther, placeholder: 'Other data Package' },
  ];

  const [clientUnit, setClientUnit] = useState([]);

  useEffect(() => {
    async function fetchUnit() {
      try {
        const unit = await prisma.inventoryMotorcycle.findFirst({
          where: {
            stockNumber: data.stockNum
          }
        });
        setClientUnit(unit);
      } catch (error) {
        console.error('Error fetching unit:', error);
      }
    }

    fetchUnit();
  }, [data.stockNum]);

  const navigate = useNavigate();
  const options = [
    "BMW-Motorrad",
    "Can-Am",
    "Can-Am-SXS",
    "Harley-Davidson",
    "Indian",
    "Kawasaki",
    "KTM",
    "Manitou",
    "Sea-Doo",
    "Switch",
    "Ski-Doo",
    "Suzuki",
    "Triumph",
    "Spyder",
    "Yamaha"
  ];

  const formRef = useRef(null);
  const submit = useSubmit();



  return (
    <Sheet>
      {data.model ? (
        <SheetTrigger asChild>
          <div>{data.model}</div>
        </SheetTrigger>
      ) : (
        <div>
          <Form method="post" onChange={(event) => { submit(event.currentTarget); }}>
            <select
              name='selectBrand'

              className="mx-auto cursor-pointer px-2 py-1 rounded-md border border-[#c7c7cb] text-foreground h-8 bg-[#363a3f] text-xs placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] w-[180px] "
            >
              <option value="">Select Brand</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input type='hidden' name='firstName' value={data.firstName} />
            <input type='hidden' name='lastName' value={data.lastName} />
            <input type='hidden' name='phone' value={data.phone} />
            <input type='hidden' name='email' value={data.email} />
            <input type='hidden' name='address' value={data.address} />
            <input type='hidden' name='financeId' value={data.id} />
            <input type='hidden' name='activixId' value={data.activixId} />
            <input type='hidden' name='intent' value='selectBrand' />
          </Form>
        </div>
      )}
      <SheetHeader>
        <SheetTitle>
          <SheetContent side='left' className='bg-background text-foreground w-full h-screen md:w-[50%] overflow-y-auto   ' >

            <h3 className="text-2xl font-thin text-foreground">CLIENT VEHICLE CARD</h3>

            <Form method='post'>
              <div className="grid grid-cols-1 text-foreground">
                {/* Left column with inputs */}
                <div>
                  <div className="mx-3 my-3 w-[90%]">
                    <h3 className="text-2xl font-thin">PURCHASING</h3>

                    <Input type="hidden" defaultValue={data.id} name="financeId" />
                    <Input type="hidden" defaultValue={id} name="id" />
                    <Input type="hidden" defaultValue={data.brand} name="brand" />
                    <Input type="hidden" defaultValue='updateFinance' name="intent" />

                  </div>
                  <div className="mx-3 my-3 w-[99%]">
                    <Tabs defaultValue="model" className="my-x mx-3 w-auto">
                      <TabsList className="flex w-full flex-row  ">
                        <TabsTrigger value="model">Model</TabsTrigger>
                        <TabsTrigger value="price">Price</TabsTrigger>
                        <TabsTrigger value="Finance">Finance</TabsTrigger>
                        <TabsTrigger value="Options">Options</TabsTrigger>
                        <TabsTrigger value="Acc">Acc</TabsTrigger>
                      </TabsList>
                      <TabsContent value="model">
                        <div className='grid grid-cols-2 items-center'>
                          <p>Stock Number</p>
                          {data.stockNum ? (
                            <p className='text-right'>{data.stockNum}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                          <p>Year</p>
                          <p className='text-right'>{data.year}</p>
                          <p>Brand</p>
                          <p className='text-right'>{data.brand}</p>
                          <p>Model</p>
                          <p className='text-right'>{data.model}</p>
                          <p>Trim</p>
                          <p className='text-right'>{data.trim}</p>
                          <p>Color</p>
                          <p className='text-right'>{data.color}</p>

                          <p>VIN</p>
                          {data.vin ? (
                            <p className='text-right'>{data.vin}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}

                          <p>Status</p>
                          {data.statusBike && data.statusBike ? (
                            <p className='text-right'>{data.statusBike}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                          <p>Location</p>
                          {data.location ? (
                            <p className='text-right'>{data.location}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                          <p>Mileage</p>
                          {data.mileage ? (
                            <p className='text-right'>{data.mileage}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="price">
                        {Dealerfees.map((fee, index) => (
                          fee.value > 0 && (
                            <div key={index} className="flex justify-between">
                              <p>{fee.placeholder}</p>
                              <p>{fee.value}</p>
                            </div>
                          )
                        ))}
                        {FinanceOptions.map((fee, index) => (
                          fee.value > 0 && (
                            <div key={index} className="flex justify-between">
                              <p>{fee.placeholder}</p>
                              <p>{fee.value}</p>
                            </div>
                          )
                        ))}
                        {data.desiredPayments === "Standard Payment" && (
                          <>
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4  text-foreground  text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end  text-right text-sm font-thin ">
                                ${data.total}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap justify-between text-foreground  ">
                              <p className="mt-2 basis-2/4   text-sm text-foreground  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end text-sm font-thin ">
                                ${data.onTax}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "Payments with Options" && (
                          <>
                            <div className="mt-2 flex flex-wrap justify-between text-foreground ">
                              <p className="mt-2 basis-2/4  text-foreground  text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4 text-foreground  items-end  justify-end text-right text-sm font-thin ">
                                ${data.totalWithOptions}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap text-foreground  justify-between ">
                              <p className="mt-2 basis-2/4 text-foreground   text-sm  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end text-sm font-thin ">
                                ${data.qcTax}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment" && (
                          <>
                            <div className="mt-2 flex flex-wrap text-foreground  justify-between ">
                              <p className="mt-2 basis-2/4  text-foreground  text-sm  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  text-foreground  items-end   justify-end  text-right text-sm font-thin ">
                                ${data.native}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment with Options" && (
                          <>
                            <div className="mt-2 flex flex-wrap text-foreground  justify-between ">
                              <p className="mt-2 basis-2/4 text-foreground   text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end  text-right text-sm font-thin ">
                                ${data.totalWithOptions}
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
                                ${data.total}
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
                                  ${data.totalWithOptions}
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

                        {FinanceOptions.map((fee, index) => {
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
                          return null;
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
                <div className="mx-3 my-3 w-[90%]">
                  <h3 className="text-2xl font-thin">TRADE</h3>
                  <div className="relative mt-5">
                    <Input
                      className="mr-3 mt-2 h-8 border-border bg-background    "
                      name="tradeMake"
                      defaultValue={data.tradeMake}
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Brand</label>
                  </div>
                  <div className="relative mt-5">
                    <Input
                      className="mt-2 h-8 pr-5 border-border bg-background  "
                      name="tradeDesc"
                      defaultValue={data.tradeDesc}
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Model</label>
                  </div>
                  <div className="relative mt-5">
                    <Input
                      className="mt-2  h-8 border-border bg-background  "
                      name="tradeYear"
                      defaultValue={data.tradeYear}
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Year</label>
                  </div>
                  <div className="relative mt-5">
                    <Input
                      className="mt-2 h-8 border-border bg-background  "
                      name="tradeTrim"
                      defaultValue={data.tradeTrim}
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Trim</label>
                  </div>
                  <div className="relative mt-5">
                    <Input
                      className="mt-2  h-8  border-border bg-background  "
                      name="tradeColor"
                      defaultValue={data.tradeColor}
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Color</label>
                  </div>
                  <div className="relative mt-5">
                    <Input
                      className="mt-2  h-8 border-border bg-background  "
                      name="tradeVin"
                      defaultValue={data.tradeVin}
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">VIN</label>
                  </div>
                  <div className="relative mt-5">
                    <Input
                      className="mt-2  h-8 border-border bg-background  "
                      name="tradeMileage"
                      defaultValue={data.tradeMileage}
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Mileage</label>
                  </div>
                  <input type='hidden' name='vehicleIdWTrade' defaultValue={data.vehicleIdWTrade} />
                  <div className="mx-3 my-3 grid w-[90%] grid-cols-2 p-2">
                    <p className=" text-sm ">Trade Value</p>
                    <Input
                      className="  ml-3 h-8 w-auto  text-right  border-border bg-background  text-sm "
                      name="tradeValue"
                      defaultValue={data.tradeValue}
                    />
                    <p className=" mt-2  text-sm ">Needed Repairs</p>
                    <Input
                      className="  ml-3 mt-2 h-8  w-auto  text-right border-border bg-background   text-sm "
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
                <input type='hidden' name='activixId' value={data.activixId} />
                <input type='hidden' name='whichVehicle' value='exchange' />

                <div className="mb-auto mr-auto p-3">

                  <ButtonLoading
                    size="sm"
                    value='updateFinanceTrade'
                    className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                    name="intent" type="submit"

                    onClick={() => toast.success(`Quote updated for ${data.firstName}`)}
                    loadingText="Saving..."
                  >
                    Update
                  </ButtonLoading>

                </div>
              </div>
            </Form>
            <div className="ml-4">
              <UnitPicker data={data} />

            </div>

          </SheetContent>
        </SheetTitle>
      </SheetHeader>
    </Sheet >
  );
}


/**import {
  useLoaderData,
  Form,
  useNavigate,
  useFetcher,
  useSearchParams
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
} from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ButtonLoading } from "~/components/ui/button-loading";
import UnitPicker from '../unitPicker'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Toaster, toast } from 'sonner'
import { getSession, commitSession, destroySession } from '~/utils/misc.user.server';

import React, { useEffect, useRef, useState } from "react";
import { prisma } from "~/libs";


export default async function ClientVehicleCard({ data }) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const id = data.id ? data.id.toString() : "";



  let finance;
  const Dealerfees = [
    { name: "userAdmin", value: data.userAdmin, placeholder: "Admin" },
    { name: "userFreight", value: data.userFreight, placeholder: "Freight" },
    { name: "userCommodity", value: data.userCommodity, placeholder: "Commodity" },
    { name: "userPDI", value: data.userPDI, placeholder: "PDI" },
    { name: "userAirTax", value: data.userAirTax, placeholder: "Air Tax" },
    { name: "userTireTax", value: data.userTireTax, placeholder: "Tire Tax" },
    { name: "userGovern", value: data.userGovern, placeholder: "Government Fees" },
    { name: "userFinance", value: data.userFinance, placeholder: "Finance Fees" },
    { name: "destinationCharge", value: data.destinationCharge, placeholder: "Destination Charge" },
    { name: "userGasOnDel", value: data.userGasOnDel, placeholder: "Gas On Delivery" },
    { name: "userMarketAdj", value: data.userMarketAdj, placeholder: "Market Adjustment" },
    { name: "userDemo", value: data.userDemo, placeholder: "Demonstratration Fee" },
    { name: "userOMVIC", value: data.userOMVIC, placeholder: "OMVIC or Other" },
  ];


  const FinanceOptions = [
    { name: "userExtWarr", value: data.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: data.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: data.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", data: data.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: data.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: data.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: data.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: data.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: data.userOther, placeholder: 'Other data Package' },
  ];

  const [clientUnit, setClientUnit] = useState([]);

  useEffect(() => {
    async function fetchUnit() {
      try {
        const unit = await prisma.inventoryMotorcycle.findFirst({
          where: {
            stockNumber: data.stockNum
          }
        });
        setClientUnit(unit);
      } catch (error) {
        console.error('Error fetching unit:', error);
      }
    }

    fetchUnit();
  }, [data.stockNum]);

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const options = [
    "BMW-Motorrad",
    "Can-Am",
    "Can-Am-SXS",
    "Harley-Davidson",
    "Indian",
    "Kawasaki",
    "KTM",
    "Manitou",
    "Sea-Doo",
    "Switch",
    "Ski-Doo",
    "Suzuki",
    "Triumph",
    "Spyder",
    "Yamaha"
  ];
  const formRef = useRef(null);

  const handleSelectChange = (event) => {
    const selectedBrand = event.target.value;
    if (selectedBrand) {
      navigate(`/quote/${selectedBrand}`);
    }
  };



  return (
    <Sheet>
      <p className="hover:text-primary">
        {data.model ? (
          <SheetTrigger asChild>
            <div>{data.model}</div>
          </SheetTrigger>
        ) : (
          <div>
            <Form method="post" ref={formRef}>
              <select
                name='selectBrand'
                onChange={handleSelectChange}
                className="mx-auto cursor-pointer px-2 py-1 rounded-md border border-white text-foreground h-8 bg-[#363a3f] text-xs placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] w-[180px] mx-auto"
              >
                <option value="">Select Brand</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Form>
          </div>
        )}
      </p>
      <SheetHeader>
        <SheetTitle>
          <SheetContent side='left' className='bg-[#1c2024] w-full md:w-[50%]  overflow-y-auto    shadow-[0_2px_10px] text-foreground' >
            <h3 className="text-2xl font-thin text-foreground">CLIENT VEHICLE CARD</h3>
            <Form method='post'>
              <div className="grid grid-cols-1 text-foreground">
                <div>
                  <div className="mx-3 my-3 w-[90%]">
                    <h3 className="text-2xl font-thin">PURCHASING</h3>
                    <Input type="hidden" defaultValue={data.id} name="financeId" />
                    <Input type="hidden" defaultValue={id} name="id" />
                    <Input type="hidden" defaultValue={data.brand} name="brand" />
                    <Input type="hidden" defaultValue='updateFinance' name="intent" />
                  </div>
                  <div className="mx-3 my-3 w-[90%]">
                    <Tabs defaultValue="model" className="my-x mx-3 w-[90%]">
                      <TabsList className="flex w-full flex-row  ">
                        <TabsTrigger value="model">Model</TabsTrigger>
                        <TabsTrigger value="price">Price</TabsTrigger>
                        <TabsTrigger value="Finance">Finance</TabsTrigger>
                        <TabsTrigger value="Options">Options</TabsTrigger>
                        <TabsTrigger value="Acc">Acc</TabsTrigger>
                      </TabsList>
                      <TabsContent value="model">
                        <div className='grid grid-cols-2 items-center'>
                          <p>Stock Number</p>
                          {data.stockNum ? (
                            <p className='text-right'>{data.stockNum}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                          <p>Year</p>
                          <p className='text-right'>{data.year}</p>
                          <p>Brand</p>
                          <p className='text-right'>{data.brand}</p>
                          <p>Model</p>
                          <p className='text-right'>{data.model}</p>
                          <p>Trim</p>
                          <p className='text-right'>{data.trim}</p>
                          <p>Color</p>
                          <p className='text-right'>{data.color}</p>

                          <p>VIN</p>
                          {data.vin ? (
                            <p className='text-right'>{data.vin}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}

                          <p>Status</p>
                          {clientUnit.statusBike && clientUnit.statusBike ? (
                            <p className='text-right'>{clientUnit.statusBike}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                          <p>Location</p>
                          {clientUnit.location ? (
                            <p className='text-right'>{clientUnit.location}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                          <p>Mileage</p>
                          {clientUnit.mileage ? (
                            <p className='text-right'>{clientUnit.mileage}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="price">
                        {Dealerfees.map((fee, index) => (
                          fee.value > 0 && (
                            <div key={index} className="flex justify-between">
                              <p>{fee.placeholder}</p>
                              <p>{fee.value}</p>
                            </div>
                          )
                        ))}
                        {FinanceOptions.map((fee, index) => (
                          fee.value > 0 && (
                            <div key={index} className="flex justify-between">
                              <p>{fee.placeholder}</p>
                              <p>{fee.value}</p>
                            </div>
                          )
                        ))}
                        {data.desiredPayments === "Standard Payment" && (
                          <>
                            <div className="mt-2 flex flex-wrap justify-between ">
                              <p className="mt-2 basis-2/4  text-foreground  text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end  text-right text-sm font-thin ">
                                ${data.total}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap justify-between text-foreground  ">
                              <p className="mt-2 basis-2/4   text-sm text-foreground  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end text-sm font-thin ">
                                ${data.onTax}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "Payments with Options" && (
                          <>
                            <div className="mt-2 flex flex-wrap justify-between text-foreground ">
                              <p className="mt-2 basis-2/4  text-foreground  text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4 text-foreground  items-end  justify-end text-right text-sm font-thin ">
                                ${data.totalWithOptions}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap text-foreground  justify-between ">
                              <p className="mt-2 basis-2/4 text-foreground   text-sm  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end text-sm font-thin ">
                                ${data.qcTax}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment" && (
                          <>
                            <div className="mt-2 flex flex-wrap text-foreground  justify-between ">
                              <p className="mt-2 basis-2/4  text-foreground  text-sm  font-thin">
                                After Tax
                              </p>
                              <p className="flex basis-2/4  text-foreground  items-end   justify-end  text-right text-sm font-thin ">
                                ${data.native}
                              </p>
                            </div>
                          </>
                        )}
                        {data.desiredPayments === "No Tax Payment with Options" && (
                          <>
                            <div className="mt-2 flex flex-wrap text-foreground  justify-between ">
                              <p className="mt-2 basis-2/4 text-foreground   text-sm  font-thin">
                                Total
                              </p>
                              <p className="flex basis-2/4  items-end text-foreground   justify-end  text-right text-sm font-thin ">
                                ${data.totalWithOptions}
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
                                ${data.total}
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
                                  ${data.totalWithOptions}
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
                        {/* loading all and every option may be too consuming of internet resources, if they want to see the options and accessories they can go to the quote itself *
                        <p className="mt-2  basis-2/4   text-sm font-thin">
                          Finance Products
                        </p>
                        <Separator />

                        {FinanceOptions.map((fee, index) => {
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
                          return null;
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

                <div>
                  <div className="mx-3 my-3 w-[90%]">
                    <h3 className="text-2xl font-thin">TRADE</h3>
                    <Input
                      className="mr-3 mt-2 h-8 border-border bg-background   "
                      placeholder="Make"
                      name="tradeMake"
                      defaultValue={data.tradeMake}
                    />
                    <Input
                      className="mt-2 h-8 pr-5 border-border bg-background  "
                      placeholder="Model"
                      name="tradeDesc"
                      defaultValue={data.tradeDesc}
                    />
                    <Input
                      className="mt-2  h-8 border-border bg-background  "
                      placeholder="Year"
                      name="tradeYear"
                      defaultValue={data.tradeYear}
                    />
                    <Input
                      className="mt-2 h-8 border-border bg-background  "
                      placeholder="Trim"
                      name="tradeTrim"
                      defaultValue={data.tradeTrim}
                    />
                    <Input
                      className="mt-2  h-8  border-border bg-background  "
                      placeholder="Color"
                      name="tradeColor"
                      defaultValue={data.tradeColor}
                    />
                    <Input
                      className="mt-2  h-8 border-border bg-background  "
                      placeholder="vin"
                      name="tradeVin"
                      defaultValue={data.tradeVin}
                    />
                    <Input
                      className="mt-2  h-8 border-border bg-background  "
                      placeholder="Mileage"
                      name="tradeMileage"
                      defaultValue={data.tradeMileage}
                    />
                    <input type='hidden' name='vehicleIdWTrade' defaultValue={data.vehicleIdWTrade} />
                  </div>
                  <div className="mx-3 my-3 grid w-[90%] grid-cols-2 p-2">
                    <p className=" text-sm ">Trade Value</p>
                    <Input
                      className="  ml-3 h-8 w-auto  text-right  border-border bg-background  text-sm "
                      name="tradeValue"
                      defaultValue={data.tradeValue}
                    />
                    <p className=" mt-2  text-sm ">Needed Repairs</p>
                    <Input
                      className="  ml-3 mt-2 h-8  w-auto  text-right border-border bg-background   text-sm "
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

                <input type='hidden' name='financeId' value={data.id} />
                <input type='hidden' name='userEmail' value={data.userEmail} />
                <input type='hidden' name='brand' value={data.brand} />
                <input type='hidden' name='clientfileId' value={data.clientfileId} />
                <input type='hidden' name='activixId' value={data.activixId} />
                <input type='hidden' name='whichVehicle' value='exchange' />

                <div className="mb-auto mr-auto p-3">

                  <ButtonLoading
                    size="lg"
                    value='updateFinanceTrade'
                    className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                    name="intent" type="submit"

                    onClick={() => toast.success(`Quote updated for ${data.firstName}`)}
                    loadingText="Saving..."
                  >
                    Update
                  </ButtonLoading>

                </div>
              </div>
            </Form>
            <div className="ml-4">
              <UnitPicker data={data} />

            </div>

          </SheetContent>
        </SheetTitle>
      </SheetHeader>
    </Sheet>
  )
}
 */
