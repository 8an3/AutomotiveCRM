import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import {
  paidfeature,
  dash,
  parts,
  docs,
  owner,
  quote,
  automation,
  admin,
  service,
  accessories,
  manager,
  dealerOnboarding,
  infastructure,
  sales,
  WIP,
  getDoneNow,
  doneneedstesting,
  BACKBURNER,
  completed,
  issue,
  ideas,
} from '~/routes/__authorized/dealer/user/dashboard.roadmap'
import {
  RemixNavLink, Input, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger, Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components"
import { cn } from "~/components/ui/utils"
import { Form, Link, useLoaderData, useLocation, useFetcher, useSubmit } from '@remix-run/react';
import { useEffect, useState } from "react"



export default function RoadMap() {
  const items = [
    {
      title: "Work In Progress",
      value: "wip",
    },
    {
      title: "Issue",
      to: "wip",
    },
    {
      title: "Ideas",
      to: "wip",
    },
    {
      title: "Done Needs Testing",
      to: "wip",
    },
    {
      title: "Get Done Now",
      to: "wip",
    },
    {
      title: "Sales",
      to: "wip",
    },
    {
      title: "Accessories",
      to: "wip",
    },
    {
      title: "Service",
      to: "wip",
    },
    {
      title: "Parts",
      to: "wip",
    },
    {
      title: "Admin",
      to: "wip",
    },
    {
      title: "Manager",
      to: "wip",
    },
    {
      title: "Dealer On Boarding",
      to: "wip",
    },
    {
      title: "Infastructure",
      to: "wip",
    },
    {
      title: "Automation",
      to: "wip",
    },
    {
      title: "Quote",
      to: "wip",
    },
    {
      title: "Owner",
      to: "wip",
    },
    {
      title: "Docs",
      to: "wip",
    },
    {
      title: "Dash",
      to: "wip",
    },
    {
      title: "Paid Feature",
      to: "wip",
    },
    {
      title: "Backburner",
      to: "wip",
    },
    {
      title: "Completed",
      to: "wip",
    },

  ]
  const [selectedItem, setSelectedItem] = useState('Work In Progress')
  const [list, setList] = useState(WIP)

  const renderContent = (selectedContent) => {
    console.log('Selected Content:', selectedContent);
    let selectedItems = []
    switch (selectedContent) {
      case `Work In Progres`:
        selectedItems = WIP
        break;
      case `Issue`:
        selectedItems = issue
        break;
      case `Ideas`:
        selectedItems = ideas
        break;
      case `Done Needs Testing`:
        selectedItems = doneneedstesting
        break;
      case `Get Done Now`:
        selectedItems = getDoneNow
        break;
      case `Sales`:
        selectedItems = sales
        break;
      case `Accessories`:
        selectedItems = accessories
        break;
      case `Service`:
        selectedItems = service
        break;
      case `Parts`:
        selectedItems = parts
        break;
      case `Admin`:
        selectedItems = admin
        break;
      case `Manager`:
        selectedItems = manager
        break;
      case `Dealer On Boarding`:
        selectedItems = dealerOnboarding
        break;
      case `Infastructure`:
        selectedItems = infastructure
        break;
      case `Automation`:
        selectedItems = automation
        break;
      case `Quote`:
        selectedItems = quote
        break;
      case `Owner`:
        selectedItems = owner
        break;
      case `Docs`:
        selectedItems = docs
        break;
      case `Dash`:
        selectedItems = dash
        break;
      case `Paid Feature`:
        selectedItems = WIP
        break;
      case `Completed`:
        selectedItems = completed
        break;
      case `Backburner`:
        selectedItems = BACKBURNER
        break;

      default:
        selectedItems = WIP
        break;
    }
    setList(selectedItems)
  };
  function SidebarNav({ className, items, ...props }: SidebarNavProps) {

    return (
      <nav className={cn("flex space-x-2 flex-col lg:space-x-0 lg:space-y-1", className)} {...props} >
        {items.map((item) => (
          <Button
            key={item.to}
            variant='ghost'
            onClick={() => {
              setSelectedItem(item.title)
              renderContent(item.title)
            }}
            className={cn(
              'justify-start text-left',
              buttonVariants({ variant: 'ghost' }),
              selectedItem === item.title
                ? "bg-[#232324] hover:bg-muted/50 w-[90%] text-foreground   "
                : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
              "justify-start w-[90%]"
            )} >
            {item.title}
          </Button>
        ))}
      </nav>
    )
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Roadmap</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
        >
          <SidebarNav items={items} />
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1" className='bg-bakcground'>
            <CardHeader>
              <CardTitle>Roadmap Items</CardTitle>
              <CardDescription>
                What we are planning to do and have done so far.
              </CardDescription>
            </CardHeader>
            <CardContent className='h-[500px] max-h-[500px] overflow-y-auto'>
              <ul className="grid gap-3 text-sm mt-2">
                {list && list.map((item, index) => (
                  <li key={index} className="flex mt-2">
                    <p className='text-foreground text-left'>-- {' '}{item.item}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 border-border">
            </CardFooter>
          </Card>

        </div>
      </div>
    </main>
  )
}
