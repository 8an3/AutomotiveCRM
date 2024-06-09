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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { cn } from "~/components/ui/utils"
import { Button, buttonVariants } from "~/components/ui/button"

export const mainNav = [

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
    to: "/demo/dashboard",
    description:
      "What makes us different and better than any other crm.",
  },

  {
    title: "Contact",
    to: "/contact",
    description:
      "Have a question or request, get in touch.",
  },
  {
    title: "Login",
    to: "/auth/login",
    description:
      "",
  },
  {
    title: "Subscribe",
    to: "/subscribe",
    description:
      "",
  },
]

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname
  console.log(pathname)
  return (
    <nav className={cn("grid md:grid-cols-1 lg:grid-cols-1 space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props} >
      {items.map((item) => (
        <Link
          to={item.to}
          key={item.to}
          className="justify-start mt-[15px]" >
          <Button
            variant='ghost'
            className={cn(
              'justify-start text-left  hover:border-[#02a9ff]',
              buttonVariants({ variant: 'ghost' }),
              pathname === item.to
                ? "bg-[#232324] hover:bg-[#232324] w-[90%]   "
                : "hover:bg-[#232324]  w-[90%]  ",
              "justify-start w-[90%]"
            )} >
            <p className=' text-lg'>
              {item.title}
            </p>
          </Button>
          <p className="text-[#909098] text-sm text-left ml-[33px] ">
            {item.description}
          </p>
        </Link>
      ))}
    </nav>
  )
}

export function NavigationMenuSales() {

  return (
    <div className='mt-5'>
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline" className='ml-3 text-[#fafafa] border-none'>DSA</Button>
        </DrawerTrigger>
        <DrawerContent className='text-[#fafafa] h-full md:w-[400px] border-[#27272a] '>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <ul className="grid gap-3  ">
                <li className="">
                  <DrawerClose>
                    <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" to='/' >
                      <div className="text-left mb-2 mt-4 text-xl font-medium">
                        DSA
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Helping you achieve more sales, everyday.
                      </p>
                    </Link>
                  </DrawerClose>
                </li>
                <DrawerClose>
                  <SidebarNav items={mainNav} />
                </DrawerClose>
              </ul>
            </DrawerHeader>
          </div>
        </DrawerContent>
      </Drawer >
      <Link to='/auth/login'>
        <Button className='hover:border-[#02a9ff] cursor-pointer text-[#fafafa] ml-3 mr-3 bg-transparent hover:bg-transparent'>
          Join
        </Button>
      </Link>
      <Link to="/auth/login">
        <Button className='hover:border-[#02a9ff] cursor-pointer text-[#fafafa] bg-transparent hover:bg-transparent'>
          Login
        </Button>
      </Link>
    </div>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
    description: string
  }[]
}
