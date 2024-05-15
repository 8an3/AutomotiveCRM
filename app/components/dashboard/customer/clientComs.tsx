/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useTransition, } from "@remix-run/react";
import { RemixNavLink, Input, Separator, Button, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, TextArea, Label, } from "~/components";
import * as Toolbar from "@radix-ui/react-toolbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/other/card";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';



export default function ClientComs({ Coms }) {

  return (
    <div className="flex flex-col">
      <div className="relative mx-3 mt-2 max-h-[600px] h-auto overflow-y-auto">
        <ul>
          {Coms.map((message) => (
            <li key={message.id} className="flex-cols-2 flex "  >
              <Card className="mr-1 mt-1 w-full rounded mb-3 bg-[#09090b]"  >
                <CardContent className="flex flex-col"  >
                  <div className="mt-1 flex justify-between">
                    <p className="text-thin text-[14px] text-gray-300">
                      Associate: {message.userName}
                    </p>
                    <p className="text-thin text-[14px] text-gray-300">
                      {message.direction} - {message.type} -  {message.result}
                    </p>
                    <p className="text-thin text-[14px] text-gray-300">

                    </p>
                    <button className='h-4 w-8' />
                    <p className="text-thin text-[14px] text-gray-300">
                      {new Date(message.createdAt).toLocaleDateString()}{" "}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <p className="text-thin text-[12px] text-left text-gray-300">
                    {message.title}
                  </p>
                  <p className="text-thin text-[12px] text-left text-gray-300">
                    {message.content}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
