import {
  Card, CardHeader, CardTitle, CardContent, CardFooter, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Button, Popover, PopoverTrigger, PopoverContent, Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/index"
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { Calendar } from '~/components/ui/calendar';
import { format } from "date-fns"
import { cn } from "~/components/ui/utils"
import React, { useState } from "react";
import UnitPicker from '~/components/dashboard/unitPicker/unitPicker'

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function ContactInfoDisplay({ finance, handleChange, formData, totalLabour, deliveryCharge, discount }) {
  const firstName = finance?.firstName
  const lastName = finance?.lastName
  const [value, onChange] = useState<Value>(new Date());
  const [date, setDate] = React.useState<Date>('')
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState(currentHour)
  const [min, setMin] = useState(currentMinute)
  const [secs, setSecs] = useState(currentSecond)
  const currentTime = `${hour}:${min}:${currentSecond}`
  console.log(`Current time is `, currentTime);
  const time = `${hour}:${min}:00`
  return (
    <>
      <div className="mt-3">
        <h3 className="text-2xl ">Customer Detail Confirmation</h3>
      </div>
      <hr className="solid" />
      <div className="flex flex-wrap justify-between  ">
        <p className="basis-2/4  mt-2">First Name</p>
        <p className="flex basis-2/4 items-end justify-end  ">
          <Input
            className=" mt-2 text-right   h-8"
            defaultValue={formData.firstName}
            placeholder="First Name"
            type="text"
            name="firstName"
            onChange={handleChange}
          />
        </p>
        <p className="basis-2/4  mt-2">Last Name</p>
        <p className="flex basis-2/4 items-end justify-end  ">
          <Input
            className=" mt-2 text-right   h-8"
            defaultValue={formData.lastName}
            placeholder="Last Name"
            type="text"
            name="lastName"
            onChange={handleChange}
          />
        </p>
        <p className="basis-2/4  mt-2">Email</p>
        <p className="flex basis-2/4 items-end justify-end  ">
          <Input
            className="mt-2 text-right    h-8"
            defaultValue={finance.email}
            placeholder="Email"
            type="text"
            name="email"
          />
        </p>
        <p className="basis-2/4  mt-2">Phone</p>
        <p className="flex basis-2/4 items-end justify-end  ">
          <Input
            className=" mt-2 text-right  "
            defaultValue={finance.phone}
            placeholder="Phone #"
            type="text"
            name="phone"
          />
        </p>
        <p className="basis-2/4  mt-2">Address</p>
        <p className="flex basis-2/4 items-end justify-end  ">
          <Input
            className=" mt-2 text-right    h-8"
            defaultValue={finance.address}
            placeholder="Address"
            type="text"
            name="address"
          />
        </p>
      </div>

      <Accordion type="single" collapsible className="mt-3 w-full cursor-pointer">
        <AccordionItem value="item-1">
          <AccordionTrigger>Other Inputs</AccordionTrigger>
          <AccordionContent>

            <Accordion type="single" collapsible className="mt-3 w-full cursor-pointer">
              <AccordionItem value="item-1">
                <AccordionTrigger>Adjustment</AccordionTrigger>
                <AccordionContent>
                  <div className="grid  grid-cols-2">
                    <div className=" mt-2 ">
                      <div className="grid  max-w-sm items-center gap-1.5">
                        <label htmlFor="discount">Discount $ </label>
                        <Input
                          className="w-20 h-8"
                          name="discount"
                          id="discount"
                          autoComplete="discount"
                          defaultValue={discount}
                          onChange={handleChange}
                          type='number'
                        />
                      </div>
                    </div>
                    <div className="mt-2 ml-auto">
                      <div className="grid  max-w-sm items-center gap-1.5">
                        <label htmlFor="discountPer">Discount (1.1-15)%</label>
                        <Input
                          className="w-20 h-8 text-right ml-auto"
                          name="discountPer"
                          id="discountPer"
                          autoComplete="discountPer"
                          defaultValue={0}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className=" mt-2 ">
                      <div className="grid  max-w-sm items-center gap-1.5">
                        <label htmlFor="discountPer">Delivery Charge</label>
                        <Input
                          className="w-20 h-8"
                          name="deliveryCharge"
                          id="deliveryCharge"
                          autoComplete="deliveryCharge"
                          defaultValue={deliveryCharge}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {totalLabour > 0 &&
                      <>
                        <p className="basis-2/4  mt-3">Total Labour</p>
                        <p className="flex basis-2/4 items-end justify-end  ">
                          ${totalLabour}
                        </p>
                      </>
                    }


                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="mt-3 w-full cursor-pointer">
              <AccordionItem value="item-1">
                <AccordionTrigger>More Customer Details</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap justify-between  ">

                    <p className="basis-2/4  mt-2">City</p>
                    <p className="flex basis-2/4 items-end justify-end  ">
                      <Input
                        className=" mt-2 text-right   h-8 "
                        defaultValue={finance.city}
                        placeholder="City"
                        type="text"
                        name="city"
                      />
                    </p>
                    <p className="basis-2/4  mt-2">Province</p>
                    <p className="flex basis-2/4 items-end justify-end  ">
                      <Input
                        className=" mt-2 text-right   h-8 "
                        defaultValue={finance.province}
                        placeholder="Province"
                        type="text"
                        name="province"
                      />
                    </p>
                    <p className="basis-2/4  mt-2">Postal Code</p>
                    <p className="flex basis-2/4 items-end justify-end  ">
                      <Input
                        className=" mt-2 text-right    h-8"
                        defaultValue={finance.postal}
                        placeholder="Postal Code"
                        type="text"
                        name="postal"
                      />
                    </p>
                    <div className="grid grid-cols-1">

                      <label className="mt-3  h-9 text-left text-[15px]" htmlFor="name">
                        Prefered Time To Be Contacted
                      </label>
                      <select
                        name='timeToContact'
                        placeholder='Best Time To Contact'
                        className="mx-auto mt-3 w-2/3  border-black cursor-pointer rounded border-1 ml-2 mr-2 bg-slate1 px-3 py-3 text-sm text-[#fafafa] placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                        <option value="na">Best Time To Contact</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Do Not Contact">Do Not Contact</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1">
                      <label className=" mt-3 text-left text-[15px]" htmlFor="name">
                        Prefered Type To Be Contacted
                      </label>
                      <select
                        name='typeOfContact'
                        className='w-2/3  mx-auto  text-xs  mb-2 cursor-pointer rounded border-1 border-black focus:border-[#60b9fd] bg-slate1 text-[#fafafa]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
                        <option value="">Contact Method</option>
                        <option value="Phone">Phone</option>
                        <option value="InPerson">In-Person</option>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1">

                      <p className="basis-2/4  mt-2">Drivers License</p>
                      <p className="flex basis-2/4 items-end justify-end  mt-2 mb-2 ">
                        <Input
                          className=" mt-2 text-right    h-8 mb-2"
                          defaultValue={finance.dl}
                          placeholder="Driver's License"
                          type="text"
                          name="dl"
                        />
                      </p>
                    </div>

                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="mt-3 w-full cursor-pointer">
              <AccordionItem value="item-1">
                <AccordionTrigger>Wanted Unit</AccordionTrigger>
                <AccordionContent>
                  <UnitPicker data={finance} />


                </AccordionContent>
              </AccordionItem>
            </Accordion >
            <Accordion type="single" collapsible className="mt-3 w-full cursor-pointer">
              <AccordionItem value="item-1">
                <AccordionTrigger>Trade Unit</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2">
                    <div>
                      <p className="basis-2/4  mt-2">Year</p>
                      <Input
                        className=" w-[90%]       h-8"
                        defaultValue={finance.tradeYear}
                        placeholder="Year"
                        type="text"
                        name="tradeYear"
                      />
                    </div>
                    <div>
                      <p className="basis-2/4 text-right    mt-2">Make</p>

                      <Input
                        className="w-[90%]  text-right  ml-auto   h-8"
                        defaultValue={finance.tradeMake}
                        placeholder="Make"
                        type="text"
                        name="tradeMake"
                      />

                    </div>
                    <div>
                      <p className="basis-2/4  mt-2">Model</p>

                      <Input
                        className=" w-[90%]      h-8"
                        defaultValue={finance.tradeDesc}
                        placeholder="Model"
                        type="text"
                        name="tradeDesc"
                      />

                    </div>
                    <div>
                      <p className="basis-2/4  text-right mt-2">Color</p>

                      <Input
                        className=" w-[90%]  text-right  ml-auto   h-8"
                        defaultValue={finance.tradeColor}
                        placeholder="Color"
                        type="text"
                        name="tradeColor"
                      />

                    </div>
                    <div>
                      <p className="basis-2/4  mt-2">VIN</p>
                      <Input
                        className="  w-[90%]      h-8"
                        defaultValue={finance.tradeVin}
                        placeholder="VIN"
                        type="text"
                        name="tradeVin"
                      />
                    </div>
                    <div>
                      <p className="basis-2/4  text-right mt-2">Mileage</p>

                      <Input
                        className=" w-[90%]  text-right  ml-auto   h-8"
                        defaultValue={finance.tradeMileage}
                        placeholder="Mileage"
                        type="text"
                        name="tradeMileage"
                      />

                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion >
            <div className="flex flex-col mx-auto justify-center mt-5">
              {/* Content for column 1 */}
              <p className="text-center  mt-2">Desired Pick Up Date  / Time</p>
              <div className='flex mx-auto'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal mr-3",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 " />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                    <Calendar
                      className='bg-white text-black'
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input type='hidden' value={String(date)} name='value' />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <ClockIcon className="mr-2 h-4 w-4 " />
                      {currentTime ? (time) : <span>Pick a Time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                    <div className='flex' >
                      {hour}
                      <Select name='pickHour' value={hour} onValueChange={setHour}>
                        <SelectTrigger className="w-auto m-3" >
                          <SelectValue placeholder={hour} defaultValue={hour} />
                        </SelectTrigger>
                        <SelectContent className='text-black bg-white' >
                          <SelectGroup>
                            <SelectLabel>Hour</SelectLabel>
                            <SelectItem value="09">09</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="11">11</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="13">13</SelectItem>
                            <SelectItem value="14">14</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="17">17</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {min}
                      <Select name='pickMin' value={min} onValueChange={setMin} >
                        <SelectTrigger className="w-auto m-3" >
                          <SelectValue placeholder={min} defaultValue={min} />
                        </SelectTrigger>
                        <SelectContent className='text-black bg-white'  >
                          <SelectGroup>
                            <SelectLabel>Minute</SelectLabel>
                            <SelectItem value="00">00</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                    </div>

                  </PopoverContent>
                </Popover>
              </div>



            </div>
            <Input type="hidden" name="name" defaultValue={`${firstName}` + ' ' + `${lastName}`} />
          </AccordionContent>
        </AccordionItem>
      </Accordion >
    </>
  )
}
