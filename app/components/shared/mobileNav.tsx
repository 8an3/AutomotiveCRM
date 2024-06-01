/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { Form, Link, useLoaderData, } from '@remix-run/react';
import { RemixNavLink, Input, Separator, Button } from "~/components"
import { rootAction, useUserLoader } from './actions';
import { formatRelativeTime } from '~/utils';
import { Sheet, SheetClose, SheetContent, SheetTrigger, } from "~/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { DashboardSpeed, LogOut, Dashboard, Settings, User, AddDatabaseScript, MailIn, InputField, MoneySquare, Map } from "iconoir-react";
import { Components, Keyboard, Users } from "~/icons";
import { getUserIsAllowed } from "~/helpers";
import { configDev, } from "~/configs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { useRootLoaderData, type RootLoaderData } from "~/hooks";

export let loader = useUserLoader
export let action = rootAction

export default function MobileNav() {
  const { finance } = useLoaderData<typeof loader>();
  const { user } = useRootLoaderData();

  const [userDashboard, setUserDashboard] = useState(true)

  const userIsAllowed = getUserIsAllowed(user, ["ADMIN", "MANAGER", "EDITOR"]);

  if (!user) {
    return null;
  }
  return (
    <>
      <Sheet>
        <SheetTrigger className="top-5 right-5 fixed  z-150">
          <div className="top-5 right-5 fixed sm:inline z-150">
            <p>Menu</p>
          </div>
        </SheetTrigger>
        <SheetContent side='left' className='bg-white w-full '>

          <div className="flex flex-col h-screen">
            {/* Content for the  first row */}
            <div className="flex-1 overflow-y-auto ">
              <RemixNavLink prefetch="intent" to={`/subscribe`}>
                <SheetClose asChild>
                  <span>Pricing</span>
                </SheetClose>
              </RemixNavLink>
              <RemixNavLink to={`/faq`}>
                <SheetClose asChild>
                  <span>
                    FAQ
                  </span>
                </SheetClose>
              </RemixNavLink>
              <RemixNavLink to={`/contact`}>
                <SheetClose asChild>
                  Contact
                </SheetClose>
              </RemixNavLink>
              <RemixNavLink to={`/subscribe`}>
                <SheetClose asChild>
                  Subscribe
                </SheetClose>
              </RemixNavLink>
              <RemixNavLink to={`/mission`}>
                <SheetClose asChild>
                  Mission
                </SheetClose>
              </RemixNavLink>
              <hr className="solid" />
              {user ? (
                <>
                  <RemixNavLink to={`/user/dashboard/settings`}>
                    <SheetClose asChild>
                      Profile
                    </SheetClose>
                  </RemixNavLink>
                  <RemixNavLink to={`/logout`}>
                    <SheetClose asChild>
                      Log out
                    </SheetClose>
                  </RemixNavLink>
                </>

              ) : (
                <>
                  <RemixNavLink to={`/login`}>
                    <SheetClose asChild>
                      Log in
                    </SheetClose>
                  </RemixNavLink>
                  <RemixNavLink to={`/login`}>
                    <SheetClose asChild>
                      Join
                    </SheetClose>
                  </RemixNavLink>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet >
    </>
  )
}


