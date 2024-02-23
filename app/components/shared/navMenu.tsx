"use client"

import * as React from "react"

import { cn } from "~/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"
import { Link } from "@remix-run/react"



export function NavigationMenuSales() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='text-white'>Dealer Sales Assistant</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-black text-white border border-white">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/"  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Dealer Sales Assistant
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Making the dealership efficient and in turn making it more profitable.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/roadmap" title="Roadmap">
                See what features we have now and what is coming in the future.
              </ListItem>
              <ListItem href="/CRM" title="CRM">
                Beta version now available, at a discounted price.
              </ListItem>
              <ListItem href="/customFeatures" title="Custom Features">
                Do you need something that is not available? We can help.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/login" className="text-white" >
            <NavigationMenuLink className={navigationMenuTriggerStyle()} >
              Log in
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem >
          <Link to="/register" className="text-white" >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              join
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
