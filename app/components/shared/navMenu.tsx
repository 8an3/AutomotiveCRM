import * as React from "react"
import { Link, useLocation } from "@remix-run/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Label } from "~/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { Button } from "~/components/ui/button"

const mainNav = [
  {
    title: "Home",
    to: "/",
    description:
      "Homepage.",
  },
  {
    title: "Custom Features",
    to: "/customFeatures",
    description:
      "Do you need something that is not available? We can help.",
  },
  {
    title: "CRM",
    to: "/crm",
    description: "Beta version now available, at a discounted price.",
  },
  {
    title: "Roadmap",
    to: "/roadmap",
    description:
      "A look into our developement plans and accomplishments.",
  },
  {
    title: "Privacy Policy",
    to: "/Privacy",
    description:
      "Your privacy held up to the highest standards.",
  },
  {
    title: "The Difference",
    to: "/theDifference",
    description:
      "What makes us different and better than any other crm.",
  },
  {
    title: "Installation Docs",
    to: "/docs/installation",
    description:
      "How to install dependencies and structure your app.",
  },
]


export function NavigationMenuSales() {
  return (
    <>
      <div className='flex-row m-3'>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className='cursor-pointer  bg-transparent hover:bg-transparent'>
              DSA
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#121212] text-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex-col items-center  text-center bg-[#5c5c5c] rounded-md">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-1 items-center gap-4">
                  <SidebarNav items={mainNav} />
                </div>
              </div>
            </div>

          </PopoverContent>
        </Popover>
        <Link to='/auth/login'>

          <Button className=' cursor-pointer ml-3 mr-3 bg-transparent hover:bg-transparent'>
            Join
          </Button>
        </Link>
        <Link to="/auth/login">

          <Button className='cursor-pointer  bg-transparent hover:bg-transparent'>
            Login
          </Button>
        </Link>

      </div >
    </>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname
  console.log(pathname)
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="justify-start" >
          <Button variant='ghost'
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.to
                ? "bg-[#232324] hover:bg-[#232324] w-[90%]  hover:bg-[#95959f] "
                : "hover:bg-[#232324]  w-[90%]  ",
              "justify-start w-[90%] "
            )} >
            <div classname='flex-col mb-3 text-white' >
              <p classname='  mb-3'>
                {item.title}
              </p>
              <p className='text-[#95959f]'>
                {item.description}
              </p>
            </div>
          </Button>
        </Link>
      ))
      }
    </nav >
  )
}
