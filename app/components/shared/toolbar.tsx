import * as Toolbar from "@radix-ui/react-toolbar";
import {
  Message,
  User,
  MoneySquare,
  NumberedListLeft,
  SendMail,
  SaveFloppyDisk,
  RemoveUser,
  Car,
} from "iconoir-react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "../ui";
import { Form } from "@remix-run/react";
import React, { useState } from "react";
import FinanceNotes from "../dashboard/customer/financeNotes";
import EmailDialog from "../dashboard/customer/emailDialog";
import FinanceNotesSidebar from "../dashboard/customer/FinanceNotesSidebar.tsx";
import EmailClient from "../dashboard/calls/emailClient";

export default function ToolbarDemo({
  finance,
  profileToggled,
  setProfileToggled,
  quoteToggled,
  setQuoteToggled,
  vehicleToggled,
  setVehicleToggled,
  setTradeToggled,
  tradeToggled,
  financeInfo,
  setFinanceInfo,
  dealStatusToggled,
  setDealStatusToggled,
  openToolbar,
  setOpenToolbar,
  data,
  notesToggled,
  setNotesToggled,
}) {
  return (
    <>
      {!openToolbar ? (
        <div className="containertoolBar">
          <Toolbar.Root className="ToolbarRoot" orientation="vertical">
            <div>
              <Toolbar.ToggleGroup type="multiple" className="flex flex-col">
                <Toolbar.ToggleItem
                  value="open"
                  name="open"
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setOpenToolbar(!openToolbar);
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Toolbar.ToggleItem>
                <Toolbar.Separator
                  data-orientation="vertical"
                  className="ToolbarSeparator"
                />

                <Toolbar.ToggleItem
                  value="notes"
                  name="notes"
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setNotesToggled(!notesToggled);
                  }}
                >
                  Notes
                </Toolbar.ToggleItem>
                <Toolbar.ToggleItem
                  value="customer"
                  name="customer"
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setProfileToggled(!profileToggled);
                  }}
                >
                  Customer
                </Toolbar.ToggleItem>
                <Toolbar.ToggleItem
                  value="Status"
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setDealStatusToggled(!dealStatusToggled);
                  }}
                >
                  Status
                </Toolbar.ToggleItem>

                <Toolbar.ToggleItem
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setVehicleToggled(!vehicleToggled);
                  }}
                  value="Vehicle"
                >
                  Vehicle
                </Toolbar.ToggleItem>
                <Toolbar.ToggleItem
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setTradeToggled(!tradeToggled);
                  }}
                  value="Trade"
                >
                  Trade
                </Toolbar.ToggleItem>

                <Toolbar.ToggleItem
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setFinanceInfo(!financeInfo);
                  }}
                  value="Finance"
                >
                  Finance
                </Toolbar.ToggleItem>
                <Toolbar.ToggleItem
                  className="ToolbarToggleItem cursor-pointer"
                  onClick={() => {
                    setQuoteToggled(!quoteToggled);
                  }}
                  value="Quote"
                >
                  Quote
                </Toolbar.ToggleItem>
              </Toolbar.ToggleGroup>
            </div>

            <Toolbar.Separator
              data-orientation="vertical"
              className="ToolbarSeparator"
            />

            <div className="flex flex-col">
              <Toolbar.Button className="ToolbarButton cursor-pointer" onClick={() => { }}>
                Text
              </Toolbar.Button>
              <Toolbar.Button className="ToolbarButton cursor-pointer" onClick={() => { }}>
                Phone
              </Toolbar.Button>
              <Toolbar.Button className="ToolbarButton cursor-pointer">
                <EmailClient data={data} />
              </Toolbar.Button>

            </div>

            <Toolbar.Separator
              data-orientation="vertical"
              className="ToolbarSeparator cursor-pointer"
            />

            <div className="mx-auto text-center">
              <Toolbar.ToggleGroup
                type="single"
                defaultValue="center"
                className="flex flex-col cursor-pointer"
              >
                <Toolbar.Link
                  href={`/overview/${finance.brand}/${finance.id}`}
                  target="_blank"
                  className="ToolbarButton cursor-pointer">
                  Overview
                </Toolbar.Link>

                <Toolbar.Link
                  href="/dashboard/calls"
                  target="_blank"
                  className="ToolbarButton cursor-pointer">
                  Dashboard
                </Toolbar.Link>

                <Popover>
                  <PopoverTrigger>
                    <Toolbar.Button className="ToolbarButton cursor-pointer">
                      Delete
                    </Toolbar.Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white">
                    <Form method="post">
                      <div className="m-auto">
                        <p>Are you sure you want to delete this customer?</p>
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="hidden"
                          value="deleteCustomer"
                          name="intent"
                        />
                        <input type="hidden" value={finance.id} name="id" />
                        <div className="mt-[25px] flex justify-end">
                          <button
                            type="submit"
                            className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </Form>
                  </PopoverContent>
                </Popover>
              </Toolbar.ToggleGroup>
            </div>
          </Toolbar.Root>
        </div>
      ) : (
        <div className="mr-auto mt-auto ">
          <Toolbar.Root
            className={`openToolbar ${openToolbar ? '  w-[37px] ml-2 mt-5 ' : ' containertoolBar '}`}
            orientation="vertical">
            <div>
              <Toolbar.ToggleGroup type="multiple" className="flex flex-col">
                <Toolbar.ToggleItem
                  value="open"
                  name="open"
                  className="ToolbarToggleItem"
                  onClick={() => {
                    setOpenToolbar(!openToolbar);
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Toolbar.ToggleItem>
              </Toolbar.ToggleGroup>
            </div>
          </Toolbar.Root>
        </div>
      )}
    </>
  );
}
