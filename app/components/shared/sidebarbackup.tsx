/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { Form, Link, useLoaderData, } from '@remix-run/react';
import {
  RemixNavLink, Input, Separator, Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "~/components"
import { rootAction, useUserLoader } from './actions';
import ContactForm from './contactForm';
import ScriptForm from './scriptsForm';
import { useRootLoaderData } from "~/hooks";
import * as Dialog from '@radix-ui/react-dialog';
import { formatRelativeTime } from '~/utils';
import { ArrowRight, } from "iconoir-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/other/sheet"


export function getUserImgSrc(imageId?: string | null) {
  return imageId ? `/resources/user-images/${imageId}` : '/img/user.png'
}
export let loader = useUserLoader
export let action = rootAction

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default function Sidebar(user) {
  const [open, setOpen] = React.useState(false);
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate); // Update the date state when a date is selected
  };
  const [isActive, setIsActive] = useState(false);
  const { finance } = useLoaderData<typeof loader>();

  const handleClick = () => {
    setIsActive(!isActive);
  };
  return (
    <>


      <Dialog.Root>
        <Dialog.Trigger >


          <div className='top-5 left-5 fixed'>
            <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </div>


        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black  bg-opacity-50  fixed inset-0" />
          <Dialog.Content className='data-[state=open]:animate-contentShow fixed w-[300px]
          h-screen left-0 top-0 bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,
          _hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none transition-transform duration-500 transform
          dark:bg-black dark:text-slate1 dark:shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,'
          >
            <Dialog.Title >
              <h3 className="text-2xl font-thin">Brands</h3>
            </Dialog.Title>
            <Dialog.Description >



              <h3 className="text-2xl font-thin">
                WATERCRAFT
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <Link className='link-with-arrow' to='/quote/Kawasaki' >
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin sidebarnavlink

                  ">
                    Kawasaki
                  </p>

                </Link>
                <Link className='link-with-arrow' to='/quote/Manitou'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    Manitou
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Sea-Doo'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin

                  sidebarnavlink
                  ">
                    Sea-Doo
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Switch'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink

                  ">
                    Sea-Doo Switch
                  </p>
                </Link>
              </div>

              <h3 className="text-2xl font-thin">
                OFF-ROAD
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <Link className='link-with-arrow' to='/quote/Can-Am'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    Can-Am
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Can-Am-SXS'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    Can-Am SXS
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/KTM'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    KTM
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Kawasaki'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin

                  sidebarnavlink   ">
                    Kawasaki
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Ski-Doo'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    Ski-Doo
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Suzuki'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin sidebarnavlink

                  ">
                    Suzuki
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Triumph'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin

                  sidebarnavlink
                   ">
                    Triumph
                  </p>
                </Link>
              </div>

              <h3 className="text-2xl font-thin">
                MOTORCYCLE
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <Link className='link-with-arrow' to='/quote/BMW-Motorrad'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin sidebarnavlink
                  ">
                    BMW Motorrad
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Harley-Davidson'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    Harley-Davidson
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Kawasaki'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    Kawasaki
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/KTM'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    KTM
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Indian'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink  ">

                    Indian
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Yamaha'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                   ">
                    Yamaha
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Suzuki'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink   ">

                    Suzuki
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Spyder'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink  ">

                    Spyder
                  </p>
                </Link>
                <Link className='link-with-arrow' to='/quote/Triumph'>
                  <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                  sidebarnavlink
                  ">
                    Triumph
                  </p>
                </Link>
              </div>

              <h3 className="text-2xl font-thin">
                ON-ROAD
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin
                sidebarnavlink   ">

                  Dodge
                </p>
                <p className="mb-0 flex basis-2/4 text-center pb-0 font-thin sidebarnavlink  ">
                  BMW
                </p>
              </div>



            </Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}


/**
 *  <DropdownMenuItem>

                      <Link className='link-with-arrow'  to={`/users/${username}/dashboard`}>Dashboard</Link>

                  </DropdownMenuItem>


              <Link className='link-with-arrow'  to='/dashboard/calls'>
                <div className='flex items-center mt-5'>
                  <div className="text-xl ">
                  <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" d="M8.976 3C4.05476 3 3 4.05476 3 8.976V15.024C3 19.9452 4.05476 21 8.976 21H9V9H21V8.976C21 4.05476 19.9452 3 15.024 3H8.976Z" fill="#323232"/>
<path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="#323232" strokeWidth="2"/>
<path d="M21 9L3 9" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M9 21L9 9" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                  </div>
                  <p className="m-auto text-sm text-muted-foreground "> Dashboard </p>
                </div>
              </Link>

 */
