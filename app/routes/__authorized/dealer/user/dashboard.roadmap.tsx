

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "~/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { useState, useEffect } from "react"
import { Separator } from "~/components"
import { GiBullseye } from "react-icons/gi";
import { Target } from 'lucide-react';
import { Link, useLocation } from "@remix-run/react"
import { cn } from "~/components/ui/utils"
import { Button, buttonVariants } from "~/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}


export default function DashboardPage() {

  const columnsWithItems = [
    { name: 'DONE NEEDS TESTING', items: doneneedstesting },
    { name: 'WIP', items: WIP },
    { name: 'GET IT DONE NOW', items: getDoneNow },
    { name: 'COMPLETED', items: completed },
    { name: 'SALES', items: sales },
    { name: 'IDEAS', items: ideas },
    { name: 'AUTOMATION', items: automation },
    { name: 'SERVICE', items: service },
    { name: 'DOCS', items: docs },
    { name: 'OWNER', items: owner },
    { name: 'QUOTE', items: quote },
    { name: 'PARTS', items: parts },
    { name: 'ACCESSORIES', items: accessories },
    { name: 'MANAGER', items: manager },
    { name: 'ADMIN', items: admin },
    { name: 'DEALER ONBOARDING', items: dealerOnboarding },
    { name: 'INFASTRUCTURE', items: infastructure },
    { name: 'DASH', items: dash },
    { name: 'COMMUNICATIONS', items: communications },
    { name: 'PAID FEATURE', items: paidfeature },
    { name: 'ISSUE', items: issue },
    { name: 'BACKBURNER', items: BACKBURNER },

  ];

  const [name, setName] = useState('')
  const [pickedRoadmap, setPickedRoadmap] = useState([])


  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-auto">
          <div>
            <p className='text-2xl'>Roadmap Menu</p>
            <Separator className='border-border bg-border text-border w-[90%] mb-3' />
            <div className="max-h-[500px] h-full overflow-y-auto">
              <nav className={cn("flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",)}    >
                {columnsWithItems.map((item) => (
                  <Button
                    key={item.name}
                    variant='ghost'
                    onClick={() => {
                      setName(item.name)
                      setPickedRoadmap(item.items)
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      item.name === name
                        ? "bg-[#232324] hover:bg-muted/50 w-[90%]     "
                        : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
                      "justify-start w-[90%] "
                    )} >
                    {item.name}
                  </Button>
                ))
                }
              </nav >
            </div>
            <Separator className='border-border bg-border text-border w-[90%] mt-3' />

            <div className="flex-col font-bold mt-3">
              <p>
                Projects Completed: {completed.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Projects in progess: {WIP.length}
              </p>
            </div>
          </div>
          <Card className="lg:col-span-2  bg-background overflow-y-clip">
            <CardHeader className='bg-muted/50'>
              <CardTitle>Roadmap Items</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow !grow  max-h-[500px] h-full overflow-y-auto">
              <ul className="grid gap-3 text-sm mt-2">
                {pickedRoadmap.map((item, index) => (
                  <li key={index} className="flex mt-2">
                    <p className='text-foreground text-left'>{index + 1}{") "} {item.item}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className='bg-muted/50 mt-auto flex-col justify-self-end '>
              <div className="flex-col font-bold mt-3">
                <p>Projects to be completed: {roadMapItems.length}</p>
                {name === 'GET IT DONE NOW' && (
                  <p className="text-xs text-muted-foreground"> Items to complete:  {getDoneNow.length}</p>
                )}
                {name === 'BACKBURNER' && (
                  <p className="text-xs text-muted-foreground">  Items to complete:  {BACKBURNER.length}</p>
                )}
                {name === 'ISSUES' && (
                  <p className="text-xs text-muted-foreground"> Current issues:  {issue.length}</p>
                )}
                {name === 'DONE NEEDS TESTING' && (
                  <p className="text-xs text-muted-foreground">  Needs testing: {doneneedstesting.length}</p>
                )}
                {name === 'SERVICE' && (
                  <p className="text-xs text-muted-foreground"> Service: {service.length} </p>
                )}
                {name === 'COMMUNICATIONS' && (
                  <p className="text-xs text-muted-foreground"> Communications: {communications.length}</p>
                )}
                {name === 'DASH' && (
                  <p className="text-xs text-muted-foreground"> Dash: {dash.length}</p>
                )}
                {name === 'INFASTRUCTURE' && (
                  <p className="text-xs text-muted-foreground">  Infastructure: {infastructure.length}</p>
                )}
                {name === 'ADMIN' && (
                  <p className="text-xs text-muted-foreground"> Admin: {admin.length}</p>
                )}
                {name === 'ACCESSORIES' && (
                  <p className="text-xs text-muted-foreground">Accessories: {accessories.length}</p>
                )}
                {name === 'PAID FEATURE' && (
                  <p className="text-xs text-muted-foreground">AI - paid features: {paidfeature.length}</p>
                )}
                {name === 'PARTS' && (
                  <p className="text-xs text-muted-foreground"> Parts: {parts.length}</p>
                )}
                {name === 'QUOTE' && (
                  <p className="text-xs text-muted-foreground"> Quote: {quote.length}</p>
                )}
                {name === 'SALES' && (
                  <p className="text-xs text-muted-foreground">  Sales: {sales.length}</p>
                )}
                {name === 'DEALER ONBOARDING' && (
                  <p className="text-xs text-muted-foreground"> Dealer on-boarding: {dealerOnboarding.length}</p>
                )}
              </div>

            </CardFooter>
          </Card>
        </div>
      </div >
    </>
  )
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname
  console.log(pathname)
  return (
    <nav
      className={cn(
        "flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Button
          key={item.to}
          variant='ghost'
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.to
              ? "bg-[#232324] hover:bg-muted/50 w-[90%]     "
              : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
            "justify-start w-[90%] "
          )} >
          {item.title}
        </Button>
      ))
      }
    </nav >
  )
}


export const metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}
const completed = [
  { board: "dev", column: "ROLES", item: "forgot driver, need to add delivery schedule, add it as a resource like the techs need to give the ability to set deliveries to everyoneyt" },
  { board: "dev", column: "ISSUE", item: "with production demo site, problem started after you manually had to update the files from remote because github action was not working" },
  { board: "dev", column: "SALES", item: "have it so if you sdelect clientfile it just goes to client file and then you can select a unit if you want to but it displays orders, and work orders under clients name not under a unit bought there" },
  { board: "dev", column: "GET DONE NOW", item: "use financeUnit for when you pick a unit out of stock to sell financeUnit/tradeunit " },
  { board: "dev", column: "ISSUE", item: "need to be able to choose one resource id in calendar and display it in service" },
  { board: "dev", column: "ISSUE", item: "need winter storage dash for service / winter storage long term" },
  { board: "dev", column: "IDEAS", item: "service calendar - select mechanic and it only shows that mechanics appts" },

  { board: "dev", column: "DEALER ONBOARDING", item: "finish dealer greeting - first step complete, need to set email once CRM is ready that would be sent from dev dashboard, dev dashboard needs to accomadate crm leads and clients, add notes capability for crmcleints" },
  { board: "dev", column: "ISSUE", item: "unit picker - redesign" },
  { board: "dev", column: "quote", item: "unit picker - once model is selected with customer=, table will render in modal with the avialble units for sale right on the quote if the customer wants to go for it" },
  { board: "dev", column: "INFASTRUCTURE", item: "set up dummy dealer site, with all the needed data to fill everything, 5 customers or so with orders and units in the system this would give you a production enviroment to test and give you the ability to give out test accounts for people to try - this could also be - set up demo site where, sign in is just inputing the email like technician@email.com and theyre logged in as the tech, or service writer and etc" },
  { board: "dev", column: "docs", item: "^^^^^ used for final tesing ^^^^^" },

  { board: "dev", column: "service", item: "service writer dash" },
  { board: "dev", column: "service", item: "tech dash" },
  { board: "dev", column: "GET DONE NOW", item: "use swr with auto revalidation for workorders so it updates in real time to get rid of the issue of 1 work order only open, set to fast on work orders for service writers but slow on tech's page" },
  { board: "dev", column: "WIP", item: "implement server to accommodate automation https://github.com/Saicharan0662/email-scheduler-client" },
  { board: "dev", column: "quote", item: "set up more parts pages - started - Manitou done - switch started" },
  { board: "dev", column: "MANAGER", item: "manager / dash fix sales stats section and finish page... just redo the leadersboard section in manager menu x sales people and have a section of all open contracts and have filters on the table to easily search for customers with refunds, certain amount of time not contacted etc tabs have dash like sales person then have a tab for each  sales person and their stats" },
  { board: "dev", column: "admin", item: "have it populate api keys so managers can hand them out" },
  { board: "dev", column: "accessories", item: "acc dash" },
  { board: "dev", column: "parts", item: "parts specfic page to print label, make changes etc, have search table that switch from table to part view using use state like the one in newleads" },
  { board: "dev", column: "MANAGER", item: "have all managers stuff within managers so dashboard would have sales, acc, parts, and service" },
  { board: "dev", column: "admin", item: "for making admin dash, go custom try to replicate sales dash but go all out... here you can even do context menu's aand everything, tab it by clientfile, finance, acc order, workorder, sales and in sales quickly sort by sales person by month user filters like u used in receivng" },
  { board: "dev", column: "GET DONE NOW", item: "put swr places it needs to be, part, unit, workorder, like the way you did on sales dashbaord" },
  { board: "dev", column: "parts", item: "parts dash" },
  { board: "dev", column: "parts", item: "shpping and receiving dash" },
  { board: "dev", column: "service", item: "tech should just be aqble to look at his agenda and know what hes doing for the day, he should have access to all the information he needs from his terminal without having to go find anyone and bug them about it and no more paperwork" },
  { board: "dev", column: "GET DONE NOW", item: "put in a room for admin for people to leave notes for the admin team" },
  { board: "dev", column: "GET DONE NOW", item: "fetcher on technician update for workorder appt in caleddnar modal" },
  { board: "dev", column: "GET DONE NOW", item: "notes in client file fix" },
  { board: "dev", column: "GET DONE NOW", item: "in clientfile under service tab create back button to see the list of workorders again" },
  { board: "dev", column: "GET DONE NOW", item: "workorder/workorderid add  appts tab where you can see select and edit appts, maybe add?" },
  { board: "dev", column: "GET DONE NOW", item: "workorder/workorderid when adding part pull part status before saving" },
  { board: "dev", column: "GET DONE NOW", item: "aprts and acc -1 part when sold at parts/acc counters or when parts fulfills an order for service or sales " },
  { board: "dev", column: "GET DONE NOW", item: "end of day reports, choose date so you can print any day" },
  { board: "dev", column: "ISSUE", item: "accessories/parts differiantiati between parts and acc by sellingDept on dashboard" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "invite user section where it send an email with links to the crm and" },
  { board: "dev", column: "ISSUE", item: "man / imprt exprort test import and putmore exports and fix exports since we changed db" },
  { board: "dev", column: "WIP", item: "manager Dashboard" },
  { board: "dev", column: "WIP", item: "admin dash" },
  { board: "dev", column: "done needs testing", item: "need to test all functions due to database changes" },
  { board: "dev", column: "WIP", item: "need to test all functions due to database changes" },
  { board: "dev", column: "WIP", item: "dev control panel needs to send email to new dealers with sign in info" },
  { board: "dev", column: "ISSUE", item: "dashboard - fix dob calendar" },
  { board: "dev", column: "STAFF AREA", item: "idea for a chart current contact time, 1 day 7 days 14 days 30 days 60 days 90 days" },
  { board: "dev", column: "SALES", item: "Add trello board to user section so they can use it if they want to" },
  { board: "dev", column: "SALES", item: "finance dash neeed to add up totals from new package area" },
  { board: "dev", column: "SERVICE", item: "tech should just be aqble to look at his agenda and know what hes doing for the day, he should have access to all the information he needs from his terminal without having to go find anyone and bug them about it and no more paperwork" },
  { board: "dev", column: "SERVICE", item: "tech dash" },
  { board: "dev", column: "PARTS", item: "parts dash" },
  { board: "dev", column: "PARTS", item: "parts specfic page to print label, make changes etc, have search table that switch from table to part view using use state like the one in newleads" },
  { board: "dev", column: "PARTS", item: "shpping and receiving dash" },
  { board: "dev", column: "ACCESSORIES", item: "acc dash" },
  { board: "dev", column: "ISSUE", item: "search need to finish the drop down to specefiy which file u want to go to " },
  { board: "dev", column: "SERVICE", item: "service writer dash" },
  { board: "dev", column: "IDEAS", item: "transcribe videos and enable a fuzzy search on them so if people dont know what they are looking for tghey can even give a short description to try to find it" },
  { board: "dev", column: "IDEAS", item: "employee to employee messaging using the emitter and alert dialog so its an important message that they have to read rght away, like next client here etc" },
  { board: "dev", column: "DASH", item: "dynamic dashboard widgets" },
  { board: "dev", column: "AUTOMATION", item: "for lead rotation, if customer pending after an hour it goes up onto a free for all board so anyone can respond to him" },
  { board: "dev", column: "DEALER ONBOARDING", item: "role specific invites, for example when invitiing a tech only show him what hes going to be using maybe even see if you can book mark for them to make it super easy" },
  { board: "dev", column: "WIP", item: "admin dash" },
  { board: "dev", column: "WIP", item: "manager Dashboard" },
  { board: "dev", column: "WIP", item: "sales manager dash" },
  { board: "dev", column: "DOCS", item: " instead of having a doc section maybe have dialog open up from the menu and they can read the docs per page instead of learning and cramming evrything at once they can learn when they need to and use the inforation right away and have it question what the user wants to learn and give it the right info on the spot and have link to video on utube open in new window" },
  { board: "dev", column: "SALES", item: "Trade in pricing from the kelley blue book integrated right into our quoting system." },
  { board: "dev", column: "ISSUE", item: "search need to finish the drop down to specefiy which file u want to go to " },
  { board: "dev", column: "ISSUE", item: "dashboard - fix dob calendar" },
  { board: "dev", column: "ISSUE", item: "man / imprt exprort test import and putmore exports and fix exports since we changed db" },
  { board: "dev", column: "ISSUE", item: "add notes ability to inventory, parts" },
  { board: "dev", column: "PAC", item: "print barcodes use same pdf generator u use now" },
  { board: "dev", column: "PAC", item: "add auto focus to forms so first input alrady has cursor" },
  { board: "dev", column: "ISSUE", item: "Print receipt, have qrcode on it so you can just scan it" },
  { board: "dev", column: "ISSUE", item: "service receipts / quotes qrcode on it to just scan it and have it pulled up no more messing with looking for customers" },
  { board: "dev", column: "PAC", item: "move accessories pages that are needed else where to components and import them that way so you can use your routes actions - this did not work first try" },
  { board: "dev", column: "PAC", item: "give the ability to transfer orders to other depts and have them able to claim it to the work order or unit" },
  { board: "dev", column: "PAC", item: "copy over the create and update orders into the finance file so you can create and update the orders attached to the unit" },
  { board: "dev", column: "PAC", item: "redirect user when customer has no unit to the order page" },
  { board: "dev", column: "PAC", item: "customer file sync between mobile and desktop" },
  { board: "dev", column: "PAC", item: "parts - a electronix lineup system  " },
  { board: "dev", column: "PAC", item: "ACC - a electronix lineup system " },
  { board: "dev", column: "PAC", item: "inventory counter, like u know the ones u see at walmart" },
  { board: "dev", column: "PAC", item: "maybe put acc tab drop down items in an alert menu first to get confirmation " },
  { board: "dev", column: "PAC", item: "receiving" },
  { board: "dev", column: "SERVICE", item: "service - a electronix lineup system for order/ wo" },
  { board: "dev", column: "SERVICE", item: "for the tech have clock in clock out, but also a check off list of the items that need to be done if they want it that tracks what item was done when and to ensure nothing gets missed" },
  { board: "dev", column: "SERVICE", item: "once tech is done with servicing a unit, if a wo isnt assigned have a waiter board where he can get his next service wo" },
  { board: "dev", column: "SERVICE", item: "service board to have a section with buttons that adds the most purchased services to the work order making it a breeze for the desk to produce quotes fast, that even inputs the part numbers, hours to complete, etc will need to make a dashboard where the service manager can set this up, maybe even produce a list of common parts associated with those jobs incase the customer doesn't like that specifc tire" },
  { board: "dev", column: "SERVICE", item: "try to make it so the service writers dont have to type anything in barely, maybe even have a section of most typed comments, have scanner in service as well so the can jkust scan parts instead of inputing part numbers" },
  { board: "dev", column: "WIP", item: "Finance Dashboard" },
  { board: "dev", column: "IDEAS", item: "trllo board for users" },
  { board: "dev", column: "ISSUE", item: "export in managers section - export csv files of customers, inventory etc" },
  { board: "dev", column: "IDEAS", item: "teleprompter" },
  { board: "dev", column: "IDEAS", item: "client turnover list? and sales rotation on same tab?" },
  { board: "dev", column: "ISSUE", item: "dashboard - client vehicle card make it so trade info only shows up on one palce" },
  { board: "dev", column: "ISSUE", item: "customer / clietfile / financefile fix menu button placement" },
  { board: "dev", column: "ISSUE", item: "temmplate builder fix add tempalte modal size" },
  { board: "dev", column: "ISSUE", item: "admin / overview  fix button palcement" },
  { board: "dev", column: "ISSUE", item: "dev move new menu to dev section" },
  { board: "dev", column: "ISSUE", item: "admin / ussers  fix add user modal size" },
  { board: "dev", column: "ISSUE", item: "admin / users  get rid of search leads link maybe replace with their own sales like dashboard" }, { board: "dev", column: "ISSUE", item: "customer / clietfile / financefile redisgn coms section" },
  { board: "dev", column: "ISSUE", item: "clientfile financeid - add claim button to dashboard" },
  { board: "dev", column: "ISSUE", item: "customer / clietfile / financefile need to start and finish customer timeline react diagrams?" },
  { board: "dev", column: "ISSUE", item: "overview - need to access and edit the deal whenever you want " },
  { board: "dev", column: "ISSUE", item: "unit picker - redesign" },
  { board: "dev", column: "ISSUE", item: "fix sales person select in clientfile/financeid and add finance manager as well" },
  { board: "dev", column: "ISSUE", item: "missing data on client file page, compare with clientcard and other places" },
  { board: "dev", column: "ISSUE", item: "added new schema model comm for communications, need to update comms to upload data" },
  { board: "dev", column: "ISSUE", item: "notifications - put in menu" },
  { board: "dev", column: "ISSUE", item: "user settings board fix css finance products " },
  { board: "dev", column: "ISSUE", item: "dashboard - menu global filter " },
  { board: "dev", column: "ISSUE", item: "dashboard - column search" },
  { board: "dev", column: "ISSUE", item: "man / csi  fix placement mt-10 or whatever" },
  { board: "dev", column: "ISSUE", item: "dashboard - add customer modal size needs fixing " },
  { board: "dev", column: "DONE NEEDS TESTING", item: "when bike becomes available that customer is looking at or something similar set note in finance file and notifition for user" },
  { board: "dev", column: "SALES", item: "Add trello board to user section so they can use it if they want to" },
  { board: "dev", column: "WIP", item: "mass email/sms - wip" },
  { board: "dev", column: "WIP", item: "have your own csi reporting for the dealer that can be sent to customers" },
  { board: "dev", column: "ISSUE", item: "export in managers section - export csv files of customers, inventory etc" },
  { board: "dev", column: "WIP", item: "dev control panel needs to send email to new dealers with sign in info" },
  { board: "dev", column: "ISSUE", item: "idea for a chart to show data, remember the sales funnel? do that but in a chart form i guess idk" },
  { board: "dev", column: "ISSUE", item: "idea for a chart  active, duplicate, invalid, lost fell through crack" },

  { board: "dev", column: "DEV", item: "need to make function that addes prisma statemnt to save alll communucations" },
  { board: "dev", column: "DEV", item: "mobile frendly dash and calendar" },
  { board: "dev", column: "DEV", item: "automation - instead of doing it like activxi... that no one can use anyways - just have options of different automation tasks like follow up after pick up, or reminders before appts, you can always offer customized automations but theres no point having a system no one uses but the person choose the time frames" },
  { board: "dev", column: "WIP", item: "UserEmailTemplates so users can add their own templates to the template drop down in overview" },
  { board: "dev", column: "DEV", item: "Dealer Onboarding - done" },
  { board: "dev", column: "DEV", item: "in quote loader there is updateReadStatus() instead of it being triggered here this should be converted to an automation" },
  { board: "dev", column: "DEV", item: "welcome email for sales people" },
  { board: "dev", column: "DEV", item: "once dealer signs up, send welcome email bringing them to the page they need to fill out for the informatoin to build their site" },
  { board: "dev", column: "DEV", item: "file upload in customer file - done " },
  { board: "dev", column: "DEV", item: "emails in overview - done" },
  { board: "dev", column: "DEV", item: "employee onboarding - done - be need to redo admin dashbaoard that deals with usrs" },
  { board: "dev", column: "DEV", item: "Dealer Onboarding - done - automate creation of vercel need to get the url and save it in our database, just use the one repo once you sync it upgrades evrvyones vercel sites" },
  { board: "dev", column: "ISSUE", item: "add ping system for notes - COMPLETED BUT NEEDS TESTING" },
  { board: "dev", column: "ISSUE", item: "need to change how to load overview,   by financeId maybe save the financeId to local storage or a cookie to always have acxcess to the last one u made" },
  { board: "dev", column: "WIP", item: "Dept Leaderboards" },
  { board: "dev", column: "WIP", item: "finish automation dash - wip" },
  { board: "dev", column: "DEALER ONBOARDING", item: "automate on boarding" },
  { board: "dev", column: "ADMIN", item: "employee onboarding" },
  { board: "dev", column: "ISSUE", item: "overview emails" },
  { board: "dev", column: "google", item: "utilize other services from google, notes, to-do, sms, voice chat, call recording, video calling, teaam chat?, tasks and plans,  " }, { board: "dev", column: "DONE NEEDS TESTING", item: "API file upload will be released once google approves gmail as its still in the process right now - done needs testing" },
  { board: "dev", column: 'google', item: 'has a push notiications for new incoming emails' },
  { board: "dev", column: "DEALER ONBOARDING", item: "initial data can be put into seed file filed out by dealer" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "roles based access - done needs testing" },
  { board: "dev", column: "NTBC", item: "API Docs" }, { board: "dev", column: "ISSUE", item: "notifications" },
  { board: "dev", column: "SALES", item: "Demo Day Dashboard" },
  { board: "dev", column: "quote", item: "Save form to LOCAL STORASGE(CHECK REMIX SITE FOR SOLUTIONp) incase something happens to connection or if they srep awway from their computer that way whenever you come back the form is filled out the way you left it" }, { board: "dev", column: "ADMIN", item: "import customers" },
  { board: "dev", column: "ADMIN", item: "import parts" }, { board: "dev", column: "ADMIN", item: "export parts" },
  { board: "dev", column: "ADMIN", item: "export acc" },
  { board: "dev", column: "DEALER ONBOARDING", item: "new sales page with upgrades" },
  { board: "dev", column: "ADMIN", item: "import acc" },
  { board: "dev", column: "DEALER ONBOARDING", item: "docs videos" },
  { board: "dev", column: "DEALER ONBOARDING", item: "quote how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "sales dashboard how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "calendar how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "automation how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "template how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "inventory how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "document builder how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "sales process start to finsih" },
  { board: "dev", column: "WIP", item: "calendar to set store hours" },
  { board: "dev", column: "nonUrgent", item: "to add onto the last one - unit sold in territories, report already out there owners of dealers get them" },
  { board: "dev", column: "WIP", item: "redesign subscription page to include 2 optoinns for stand alone sales people and dealers" },
  { board: "dev", column: "ISSUE", item: "move staff chat to sms messenger" },
  { board: "dev", column: "website sales", item: "try out section where people can see how much quicker the process can be" },
  { board: "dev", column: "NTBC", item: "Dept and General Staff Chat" },
  { board: "dev", column: 'google', item: 'tasks' },
  { board: "dev", column: 'google', item: 'Calendar' },
  { board: "dev", column: "Automation", item: "sales person schedule for lead rotation" },
  { board: "dev", column: 'google', item: 'Keep note' },
  { board: "dev", column: "ISSUE", item: "add customer on dashboard needs to be updated to be the same as on calendar" },
  { board: "dev", column: "sales process", item: "update finance mgr lock so that the sales person can have a in queue timer" },
  { board: "dev", column: "ISSUE", item: "need mileage for new vehciles for printing paperwork" },
  { board: "dev", column: "wip - crm integration", item: "complete first integration" },
  { board: "dev", column: "ISSUE", item: "everything google on hold - google is asking for requirments that they were never upfront about" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "have all features off of the same platform/project - done needs testing" },
  { board: "dev", column: "Automation", item: "have it so you can tag a customers file so when a test drive cmoes around it just reminds you to get them on  ti or on wish ist" },
  { board: "dev", column: "DEALER ONBOARDING", item: "script how-to" },
  { board: "dev", column: "DEALER ONBOARDING", item: "payment calc how-to" },
  { board: "dev", column: "ISSUE", item: "need to redo email templates in overview - wip move email templates to template section??? and just have a email client in its place then it would really just be three choices instead of 100 and something because it would just take whatewver payments that are saved" },
  { board: "dev", column: "ISSUE", item: "to get notified when new useed units come in for customers wish list - just generate brand / model list to choose from instead of letting them type it in" },
  { board: "dev", column: "paid feature", item: "sms messenger" },
  { board: "dev", column: "DEALER ONBOARDING", item: "each dealer will have their own server on vercel, own database on planetscale, and so forth find a way to automate this even though it doesnt take any time to do so" },
  { board: "dev", column: "quote", item: "find source with API with up-to-date model information - Kelly Black Book - they have the product take picutre of blue ages for now and just ocr scan - just going to use dealer binders of dealers that sign up - alkmost completed" },
  { board: "dev", column: "ISSUE", item: "google auth fixed need to verify, put in root " },
  { board: "dev", column: "ISSUE", item: "email not currently working in overview" },
  { board: "dev", column: "ISSUE", item: "to get notified when new useed units come in for customers wish list" },
  { board: "dev", column: "ISSUE", item: "lien payout - COMPLETED BUT NEEDS TESTING" },
  { board: "dev", column: "ISSUE", item: "csv upload for prodcuts and inventory" },
  { board: "dev", column: "communications", item: "set up whatsap for dealing with dealer customers affiliate marketers" },
  { board: "dev", column: "DASH", item: "dash switcher in settings to change from integration to integration or not" },
  { board: "dev", column: "communications", item: "whats app integration" },
  { board: "dev", column: "ISSUE", item: "put customer coms in cuterom file not bike file - DID NOT COMPLETE REVISIT AFTER BETA " },
  { board: "dev", column: "notifications", item: "push notifications - cheat way to do it in terms of cost and coding - just send a email along with the in app notfication as long as your phone is hooked up to your computer, you will get notified through your phone and computer" },
  { board: "dev", column: "ISSUE", item: "last note column" },
  { board: "dev", column: "ISSUE", item: "sms messenger" },
  { board: "dev", column: "ISSUE", item: "calendar - complete appointment" },
  { board: "dev", column: "ISSUE", item: "email refresh token use revalidateOnFocus from swr to refresh tokens https://swr.vercel.app/docs/revalidation" },
  { board: "dev", column: "Automation", item: "integration with vercel app - wip" },
  { board: "dev", column: "USER", item: "fields to add - triggerFieldList in automations" },
  { board: "dev", column: "customer", item: "add api to import new leads" },
  { board: "dev", column: "notifications", item: "upcoming appt - wip" },
  { board: "dev", column: "notifications", item: "instead of somweething fancy and expensive jsut use db and have it laod on each render, and have page reload afdter 10 mins or something of inactivty - wip" },
  { board: "dev", column: "sales process", item: "internal IM system would help with these things, relying on the note system within the custemer files is just stupid - https://github.com/remix-run/examples/tree/main/sse-chat" },
  { board: "dev", column: "ISSUE", item: "pre populate random dealer info to start customer can always change it" },
  { board: "dev", column: "crm integration", item: "inital api function" },
  { board: "dev", column: "crm integration", item: "create matching records - figure out the best way to then integrate the data into our system" },
  { board: "dev", column: "crm integration", item: "SyncLeadData - should we update leads from activix each time login? or refresh?" },
  { board: "dev", column: "ISSUE", item: "production enviroment with new google implmentation" },
  { board: "dev", column: "ISSUE", item: "registration" },
  { board: "dev", column: "calendar", item: "render sms or email clients in claendsar appointments to take care of that right then and ther" },
  { board: "dev", column: "USER", item: "add 2FA" },
  { board: "dev", column: "ISSUE", item: "QUOTE/USED - wip" },
  { board: "dev", column: "ISSUE", item: "internal chat" },
  { board: "dev", column: "ISSUE", item: "notifications" },
  { board: "dev", column: "ADMIN", item: "import of lists like inventory, customers, parts, acc" },
  { board: "dev", column: "ADMIN", item: "add new users through admin protal" },
  { board: "dev", column: "DASH", item: "pop up to display entire conversation history non interactive because that wont work" },
  { board: "dev", column: "DEV", item: "project is getting to big to continue testing, need a page to automate testing" },
  { board: "dev", column: "ISSUE", item: "Calendar missing 2 of its views" },
  { board: "dev", column: "ISSUE", item: "admin add user not working properly" },
  { board: "dev", column: "DASH", item: "import / export customer base" },
  { board: "dev", column: "ADMIN", item: "import inventory" },
  { board: "dev", column: "ADMIN", item: "export inventory" },
  { board: "dev", column: "ADMIN", item: "import users" },
  { board: "dev", column: "ADMIN", item: "export users" },
  { board: "dev", column: "DASH", item: "demo day list like the wish list?" },
  { board: "dev", column: "DASH", item: "have a quick contact option at the top of the page where you can skip account creation to send an email or text as your typing email or phone it searches for the client file, onc esent the next page would be go to create client file or go to client file " },
  { board: "dev", column: "USER", item: "need heavy hitter finance manager to accommodate them for CRM" },
  { board: "dev", column: "quote", item: "hook up communication counter" },
  { board: "dev", column: 'google', item: 'gmail done' },
  { board: "dev", column: "DASH", item: "import / export inventory" },
  { board: "dev", column: "ADMIN", item: "redesign admin page" },
  { board: "dev", column: "DASH", item: "finance manager dash" },
  { board: "dev", column: "sales process", item: "to add to last item - put a non removablew modal for when client is ready to finance when at the dealer that will lock the app of the finance managers till someone clicks accept unless they are already currently in a file, need to find a way to kick them off the file after a period of inactivty to ensure they dont cheat the system" },
  { board: "dev", column: "client file", item: "change checkbox section so only finance can change finance items but display once they are checked off" },
  { board: "dev", column: "ADMIN", item: "redesign admin page" },
  { board: "dev", column: "quote", item: "once sold, do all the stupid stuff behind the scenes rather than having to do it multiple times when u sell a unit" },
  { board: "dev", column: "inventory", item: "have inventory hooked to the quotes so the sales perosn can see in while pricing the customer you can see if its in stock and what colors are available" },
  { board: "dev", column: "Auto print", item: " have AI component attached to the email client to rewrite emails if needed - huge cost wip" },
  { board: "dev", column: "USER", item: "statistics page based on data from dash and CRM" },
  { board: "dev", column: "USER", item: "for sales tracker, add up delivered and add it to sales tracker, whatever the value is now" },
  { board: "dev", column: "USER", item: "utilize user notifications - sns providor has this option WIP" },
  { board: "dev", column: "USER", item: "have dealer staff able to edit others' clients" },
  { board: "dev", column: "Templates", item: "have an option on the text editor to be able to save as template on text and email so you can quickly savew it and review again later rather than praying you dont close that tab, which u do anyways" },
  { board: "dev", column: "DASH", item: "make an assigned to area on purchasing tab" },
  { board: "dev", column: "deployment", item: "look at some github actions so when you update the main repo it would push the update to all the repos or look into vercel, have one repo for multiple deployments" },
  { board: "dev", column: "DASH", item: "search to find a customer placed at root WIP" },
  { board: "dev", column: "DASH", item: "combine customers? idk how i feel about that, would rather have the ability to 'meld' them, becoming one but with multiple units." },
  { board: "dev", column: "TASK", item: "Hide feature buttons if unavailable" },
  { board: "dev", column: "TASK", item: "Move feature buttons to sidebar" },
  { board: "dev", column: "TASK", item: "See if auto email will work in sidebar" },
  { board: "dev", column: "USER", item: "sms" },
  { board: "dev", column: "USER", item: "add dealer roles - WIP" },
  { board: "dev", column: "external link", item: "https://stackoverflow.com/questions/75189762/how-to-save-contact-details-from-a-website-to-an-android-or-iphone-using-html-bu" },
  { board: "dev", column: "text client", item: "chatgpt integration to reply or create or edit emails on the fly with only a short description from you  - huge cost" },
  { board: "dev", column: "email client", item: "chatgpt integration to reply or create or edit emails on the fly with only a short description from you  - huge cost" },
  { board: "dev", column: "quote", item: "put follow-up buttons on quote as well" },
  { board: "dev", column: "website", item: "change favicon based on brand" },
  { board: "dev", column: "DASH", item: "mass sms" },
  { board: "dev", column: "DASH", item: "payment calc with no ability to select a unit" },
  { board: "dev", column: "USER", item: "Allow users to store their own custom emails" },
  { board: "dev", column: "DASH", item: "lock fields on delivered" },
  { board: "dev", column: "DASH", item: "mass sms" },
  { board: "dev", column: "DASH", item: "sms" },
  { board: "dev", column: "USER", item: "Give the ability for people to upload their own worksheets, contracts, and such - https://pspdfkit.com/guides/web/downloads/" },
  { board: "dev", column: "email client", item: "create client - like short wave, they stole my idea for it" },
  { board: "dev", column: "customer profile", item: "print area on customer profile to print pre-populated paperwork" },
  { board: "dev", column: "email client", item: "email client near completion - utilize other services from azure, notes, to-do, sms, voice chat, call recording, video calling, teaam chat?, tasks and plans,  " },
  { board: "dev", column: "DASH", item: "crm integration - along with our CRM - WIP" },
  { board: "dev", column: "Auto print", item: " customer work sheets - WIP" },
  { board: "dev", column: "Auto print", item: " test drive waiver - WIP" },
  { board: "dev", column: "Auto print", item: " UCDA - WIP" },
  { board: "dev", column: "email", item: "more scriptied emails" },
  { board: "dev", column: "customer profile", item: "implement DocuSign" },
  { board: "dev", column: "USER", item: "send email to salesperson when someone else enters yellow or red notes" },
  { board: "dev", column: "calendar", item: "service cal" },
  { board: "dev", column: "calendar", item: "parts cal" },
  { board: "dev", column: "calendar", item: "sales manager" },
  { board: "dev", column: "calendar", item: "finance manager" },
  { board: "dev", column: "client", item: "implement server to accommodate automation" },
  { board: "dev", column: "DASH", item: "record and show all previous interaction" },
  { board: "dev", column: "DASH", item: "have drop down for notes with ones you use most i.e. was supposed to come in, followed up, no answer so speed up follow up reschedule" },
  { board: "dev", column: "DASH", item: "calendar" },
  { board: "dev", column: "USER", item: "Microsoft Outlook has an API for email, can make your own mail page in the app, along with calendar and Todo. Check other services from Microsoft" },
  { board: "dev", column: "DASH", item: "look at making table from scratch, would alleviate all the problems you're having, and allow for more customization" },
  { board: "dev", column: "DASH", item: "check this out for a table alternative - https://github.com/bvaughn/react-virtualized" },
  { board: "dev", column: "DASH", item: "for advanced filtering - https://www.youtube.com/watch?v=MY6ZZIn93V8" },
  { board: "dev", column: "DASH", item: "date range filter for calls" },
  { board: "dev", column: "DASH", item: "different tables for different views, i.e., sold, not delivered, pending" },
  { board: "dev", column: "DASH", item: "under settings have a table that displays delivered and to be delivered" },
  { board: "dev", column: "DASH", item: "save current filter/sort to cookie so it doesn't interrupt your workflow" },
  { board: "dev", column: "DASH", item: "implement a way to show reached till phone service is working" },
  { board: "dev", column: "DASH", item: "filter per column" },
  { board: "dev", column: "quote", item: "along with DocuSign, digitize any other docs for a smoother paperwork process" },
  { board: "dev", column: "USER", item: "allow users to opt out of 2-day auto follow-up" },
  { board: "dev", column: "DASH", item: "Texting is broken in scripts" },
  { board: "dev", column: "auto email", item: "customer set time after delivery thanking them and asking for referrals" },
  { board: "dev", column: "auto email", item: "finance - reminders to clients if missing anything from finance or sales" },
  { board: "dev", column: "TASK", item: "Put a copy text button for each script" },
  { board: "dev", column: "USER", item: "Take off contact and script upload since it's in the menu now" },
  { board: "dev", column: "DASH", item: "instead of sorting the table to see what deliveries are, have a 3-day rolling list, one less thing to sort on the table, the same in-person appt, not follow-up calls" },



  { board: "dev", column: "quote", item: "apt list breakdown on profile with delete and edit options" },
  { board: "dev", column: "DASH", item: "change filter input to dropdown based on column selection" },
  { board: "dev", column: "DASH", item: "have it on top of the dashboard so it displays every morning and you can select a button to hide so you never forget about deliveries" },
  { board: "dev", column: "DASH", item: "change filter input to dropdown based on column selection" },
  { board: "dev", column: "TASK", item: "API file upload does not work in production folder API is already in use by platform Procidor move API/file upload to dealerapi/fileupload" },
  { board: "dev", column: "TASK", item: "Cookies for user preferences" },
  { board: "dev", column: "TASK", item: "Cookies for user preferences" },
  { board: "dev", column: "DASH", item: "have the dash just be able to send texts and call, have the messenger somewhere else" },
  { board: "dev", column: "DASH", item: "make full CRM - once done with the original app - WIP" },
  { board: "dev", column: "USER", item: "instant messenger - to not use LoaderData, that god-awful messenger anymore - started but didn't work out" },
  { board: "dev", column: "USER", item: "phone working but not on a wide scale" },
  { board: "dev", column: "quote", item: "finish customer profile with all functionality" },
  { board: "dev", column: "DASH", item: "document upload section on dash for each customer" },
  { board: "dev", column: "USER", item: "allow the user to set the default follow-up day" },
  { board: "dev", column: "TASK", item: "have the last note on the dashboard, have notes on customer page / return to quote button" },
  { board: "dev", column: "TASK", item: "fix attachment to customer notes" },
  { board: "dev", column: "TASK", item: "complete dash with full functionality" },
  { board: "dev", column: "TASK", item: "Cookies for user preferences" },
  { board: "dev", column: "TASK", item: "add attachment to customer notes" },
  { board: "dev", column: "TASK", item: "add reset password" },
  { board: "dev", column: "TASK", item: "automatically complete call when emailing from dashboard" },
  { board: "dev", column: "TASK", item: "add customer button to dash to quickly add customers" },
  { board: "dev", column: "TASK", item: "update state automatically based on what's chosen from the client card" },
  { board: "dev", column: "TASK", item: "just building a CRM - save customers and their vehicle sheets? Uploading to CRM should be good enough. The whole point is not to be a CRM and just help salespeople with speed. By pushing the data to the CRM immediately, there's no point to save it maybe. Have the user only ever update the database so it only has one entry, while keeping access to their quote in profile, show last and all the details" },
  { board: "dev", column: "TASK", item: "settings menu to set variables per salesperson" },
  { board: "dev", column: "TASK", item: "admin dashboard? - started" },
  { board: "dev", column: "TASK", item: "Instant print cash contacts" },
  { board: "dev", column: "TASK", item: "redesign checkbox" },
  { board: "dev", column: "TASK", item: "new navbar" },
  { board: "dev", column: "TASK", item: "backend" },
  { board: "dev", column: "TASK", item: "logos" },
  { board: "dev", column: "TASK", item: "auto payments calc" },
  { board: "dev", column: "TASK", item: "auto print spec sheet without visiting any site" },
  { board: "dev", column: "TASK", item: "page for every brand that we have information on" },
  { board: "dev", column: "TASK", item: "hidden discount inputs - one for $ amount, another for %" },
  { board: "dev", column: "TASK", item: "second print button so it prints the spec sheet of the model the customer is looking at, so you can give it to the customer without having to dig through the ones you already downloaded or go through 16 web pages on Can-Am's website to get to it - completed Kidoo, Can-Am - partial, Manitou, Switch, Sea-Doo" },
  { board: "dev", column: "TASK", item: "query website by stock number to see if it's in stock - not feasible across so many dealers" },

]
const getDoneNow = [
  { board: "dev", column: "ISSUE", item: "***** NEEDS TO BE DONE FOR RELEASE *****" },

  { board: "dev", column: "DONE NEEDS TESTING", item: "instead of input for tax on quotes do a drop down with actual provines taxes done in payument calc only!!!!" },
  { board: "dev", column: "IDEAS", item: "import / export allow to downlaod a template example so people can see the columns needed for that dataset" },

  { board: "dev", column: "ISSUE", item: "----- IN CONJUCTION WITH SMS AND EMAIL TESTING BEFORE RELEASE -----" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "email" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "email - update styling so its not akward" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "sms" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "webhook for incoming emails, save notifiation and messeages" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "use same system as notifications to check on new mail - USE SWR" },

  { board: "dev", column: "ISSUE", item: "----- FINAL TESTING ON PROD SITE -----" },
  { board: "dev", column: "ROLES", item: "service manager" },
  { board: "dev", column: "ROLES", item: "service writer" },
  { board: "dev", column: "ROLES", item: "service writer - menu needs to be fixed" },
  { board: "dev", column: "ROLES", item: "tech" },

  { board: "dev", column: "ROLES", item: "sales manager" },
  { board: "dev", column: "ROLES", item: "sales" },
  { board: "dev", column: "ROLES", item: "sales - clientid - financeid --- add commuinication not saving" },
  { board: "dev", column: "ROLES", item: "sales - clientid - financeid --- apt history not saving" },
  { board: "dev", column: "ROLES", item: "finance" },

  { board: "dev", column: "ROLES", item: "pac manager" },
  { board: "dev", column: "ROLES", item: "receiving" },
  { board: "dev", column: "ROLES", item: "accessories" },

  { board: "dev", column: "ROLES", item: "admin" },
  { board: "dev", column: "ROLES", item: "it" },
  { board: "dev", column: "ROLES", item: "dev" },


  { board: "dev", column: "ISSUE", item: "----- FINAL TESTING ON PROD SITE - COMPLETED -----" },
  { board: "dev", column: "ROLES", item: "----- STAFF AREA -----" },
  { board: "dev", column: "ROLES", item: "staff chat - need to send out notifications regarding messages for pedople in that dept mor maybe just use a tag system so everyone doesnt get blown up with messages" },
  { board: "dev", column: "ROLES", item: "staff leaderboard - does not work in prod" },

  { board: "dev", column: "ROLES", item: "----- USER -----" },
  { board: "dev", column: "ROLES", item: "payment calculator" },
  { board: "dev", column: "ROLES", item: "quote" },
  { board: "dev", column: "ROLES", item: "overview" },
  { board: "dev", column: "ROLES", item: "settings" },
  { board: "dev", column: "ROLES", item: "roadmap " },
  { board: "dev", column: "ROLES", item: "scripts " },
  { board: "dev", column: "ROLES", item: "templates " },
  { board: "dev", column: "ROLES", item: "getting started - may need a few more for dealers " },
  { board: "dev", column: "ROLES", item: "board - board not saving" },



  { board: "dev", column: "ISSUE", item: "***** BACKBURNER BUT NEEDS TO BE DONE ASAP DOES NOT NEED TO BE DONE FOR RELEASE *****" },
  { board: "dev", column: "GET DONE NOW", item: "order dash, same as inventory count but you go around scanning items and slecting a quantity to purchase in managers dash" },
  { board: "dev", column: "GET DONE NOW", item: "create the 'wall', a table of just stats and stats not for everyone but try to break everything down -- for range date pick see shad cd examples cards, middle row third from the top" },
  { board: "dev", column: "ISSUE", item: "FIX MANAGER SECTION" },
  { board: "dev", column: "ISSUE", item: "FIX ADMIN SECTION" },
  { board: "dev", column: "ISSUE", item: "Parts order printout and workorder printout for srevice" },
  { board: "dev", column: "GET DONE NOW", item: "saving doc templates, see if you can save big json strings in database - make template master sheets designated for specific purposes that way the values used are for that specific type of document with a legend on the side incase they delete something they should where they click and it copies the value it needs" },



  { board: "dev", column: "ISSUE", item: "----- IN CONJUCTION WITH USER DOCS -----" },
  { board: "dev", column: "ISSUE", item: "user docs button that is page dynamic so its just one button to press to learn about the page and it directs you to the right video to learn instead of having a doc section " },
  { board: "dev", column: "docs", item: "-----  VIDEOS FOR DOCS -----" },
  { board: "dev", column: "docs", item: "scripts / templates" },
  { board: "dev", column: "docs", item: "quotes" },
  { board: "dev", column: "docs", item: "sales" },
  { board: "dev", column: "docs", item: "finance" },
  { board: "dev", column: "docs", item: "calendar" },
  { board: "dev", column: "docs", item: "sales manager" },
  { board: "dev", column: "docs", item: "unit inventory" },

  { board: "dev", column: "docs", item: "pac manager" },
  { board: "dev", column: "docs", item: "accessories" },
  { board: "dev", column: "docs", item: "receiving" },

  { board: "dev", column: "docs", item: "service manager" },
  { board: "dev", column: "docs", item: "service writer" },
  { board: "dev", column: "docs", item: "techs" },

  { board: "dev", column: "docs", item: "admin" },

  { board: "dev", column: "docs", item: "user settings" },
  { board: "dev", column: "docs", item: "document builder" },
  { board: "dev", column: "docs", item: "whole overview" },
  { board: "dev", column: "docs", item: "leader board" },

]
const issue = [
  { board: "dev", column: "ISSUE", item: "end of day report, sales people arent printing out" },
  { board: "dev", column: "accessories", item: "dealer/accessories/newOrder/cm06lhi4u0001lb03xvaq4gwu print receipt not working in prod" },
  { board: "dev", column: "ISSUE", item: "man / dash fix sales stats section and finish page... just redo the leadersboard section in manager menu x sales people and have a section of all open contracts and have filters on the table to easily search for customers with refunds, certain amount of time not contacted etc tabs have dash like sales person then have a tab for each  sales person and their stats" },
]
const WIP = [
  { board: "dev", column: "WIP", item: "mass email - wip" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "mass sms - wip" },

  { board: "dev", column: "WIP", item: "have your own csi reporting for the dealer that can be sent to customers JUST NEED TO MAKE MOCK EMAIL FOR IT" },
  { board: "dev", column: "INFASTRUCTURE", item: "cell phone site versions for product ordering, unit inventory intake for service writers/managers to quickly take in unit orders, service quoting, search for products, search for units, orders so employees can work on them on the go, in the back getting items or on with customers on floor and as soon they are ready to buy they can just hit print receipt and collect the money instead of waiting for a till if there is none" },

  { board: "dev", column: "WIP", item: "clientfile/financeid cc user for notes" },
]
const doneneedstesting = [
  { board: "dev", column: "DONE NEEDS TESTING", item: "implement server to accommodate automation https://github.com/Saicharan0662/email-scheduler-client" },
]
const BACKBURNER = [
  { board: "dev", column: "BACKBURNER", item: "set up more parts pages - started - Manitou done - switch started" },
  { board: "dev", column: "BACKBURNER", item: "ADMIN DASH - have it populate api keys so managers can hand them out" },
  { board: "dev", column: "BACKBURNER", item: "email / sms campaigns" },
  { board: "dev", column: "WIP", item: "^^^^^ https://developers.klaviyo.com/en/reference/get_campaigns" },

]
const ideas = [
  { board: "dev", column: "SALES", item: "sales bot - take care of some of the sales process - uses natural language processing and machine learning to assist in automated contract negotiations based on predefined parameters." },
  { board: "dev", column: "SALES", item: "sales bot 2 - customer onboarding" },
  { board: "dev", column: "SALES", item: "sales bot 3 - after sales" },
  { board: "dev", column: "SALES", item: "payment processor for purchases?" },
  { board: "dev", column: "SALES", item: "cross platform ad manager, post it once here and push it to different providors" },
  { board: "dev", column: "SALES", item: "fb msgr integration" },



  { board: "dev", column: "IDEAS", item: "save form to local storage, never loose data for a internet hiccup or outage" },
  { board: "dev", column: "IDEAS", item: "have blue book values on quote section" },
  { board: "dev", column: "IDEAS", item: "service dash - tab where it shows customers who havent had a service in 6 months" },
  { board: "dev", column: "IDEAS", item: "idea for a chart current contact time, 1 day 7 days 14 days 30 days 60 days 90 days" },


  { board: "dev", column: "dash", item: "dynamic dashboard widgets" },


  { board: "dev", column: "INFASTRUCTURE", item: "have a second non-cloud option, either as a rack for a server or tower for a non tech orientated dealer to be hosted on site but would need a license key that needs a new token every 30 days/6 months/12 months to operate based on payment plan, hardware to be paid upfront before build, payments start once activated at dealer" },


  { board: "dev", column: "PAID FEATURE - ai", item: "Ai assistant to book apointments, complete and etc like gowrench or just a work flow to customers to guide themselves" },
  { board: "dev", column: "PAID FEATURE - ai", item: "Ai assistant to give hints on what to do next like a reminder" },
  { board: "dev", column: 'PAID FEATURE - ai', item: 'have ai take in last 5 emails with customer and suggest your next communication/script - not done yet but easy enough to complete in components folder' },
  { board: "dev", column: "PAID FEATURE - ai", item: "Predictive Customer Behavior Modeling, Utilize advanced machine learning models to predict future customer behaviors and preferences based on historical data. ie percentages on how liuekly the customer can be closed if asked at that time" },
  { board: "dev", column: "PAID FEATURE - ai", item: "predictive analysis of sales trends" },
  { board: "dev", column: "PAID FEATURE - ai", item: "customter analysis, retention, customer $ worth, visits, and more" },

]
const sales = [
  { board: "dev", column: "SALES", item: "make a bill of sale where it prints the items off of acc and parts orders - KIND OF ALREADY DONE BY PUSHING ACC TOTAL TO BOS BUT DOES NOT ITEMIZE ITEMS" },

  { board: "dev", column: "SALES", item: "finance section in finance file, have it where it can be switch to manual mode only where there are no calculations being done" },
  { board: "dev", column: "SALES", item: "finish className={${isCompleted ? bg-[#30A46C]: bg-primary} in finance file" },
  { board: "dev", column: "SALES", item: "Call center Section" },

]
const automation = [
  { board: "dev", column: "AUTOMATION", item: "customer set time before delivery of what to bring" },
  { board: "dev", column: "AUTOMATION", item: "auto email at 5, 2.5 months and 30, 7 days before consent expires, 2 years if bought, 6 months if not" },
  { board: "dev", column: "AUTOMATION", item: "customer 2 months after pick up to make sure everything is still good" },
]
const service = [
  { board: "dev", column: "service", item: "scan incoming crates and add them into inventory or something, maybe a inbox for the admin to convert them to inventory" },
]
const docs = [

]
const owner = [
  { board: "dev", column: "OWNER", item: "Owners dashboard" },
  { board: "dev", column: "OWNER", item: "Owner Section" },
]
const quote = [
]
const parts = [

]
const accessories = [

]
const manager = [
]
const admin = [
]
const dealerOnboarding = [
]
const infastructure = [
]
const dash = [
]
const communications = [

]
const paidfeature = [
  { board: "dev", column: "PAID FEATURE - ai", item: "*** currently working - need to attach to components and find a way to turn on or off pending payment by customer ***" },
  { board: "dev", column: "PAID FEATURE - ai", item: "speech to text for quicker input - done in components folder" },
  { board: "dev", column: "PAID FEATURE - ai", item: "AI writing partner for emails, templates and scripts - done in components folder" },
  { board: "dev", column: 'PAID FEATURE - ai', item: 'vercel has a nice write up on this to do in their platform - ai - wip - https://github.com/steven-tey/chathn/blob/main/app/api/chat/route.ts' },
]

export const roadMapItems = [
  ...getDoneNow,
  ...BACKBURNER,
  ...issue,
  ...doneneedstesting,
  ...WIP,
  ...ideas,
  ...sales,
  ...automation,
  ...service,
  ...docs,
  ...owner,
  ...paidfeature,
  ...dash,
  ...infastructure,
  ...quote,
  ...communications,
  ...dealerOnboarding,
  ...admin,
  ...manager,
  ...accessories,
  ...parts,
]
export {
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
}



function Roadmap() {



  const organizedTasks = {};
  roadMapItems.forEach((item) => {
    if (!organizedTasks[item.column]) {
      organizedTasks[item.column] = [];
    }
    organizedTasks[item.column].push(item);
  });

  const organizedTasksDone = {};
  completed.forEach((item) => {
    if (!organizedTasksDone[item.column]) {
      organizedTasksDone[item.column] = [];
    }
    organizedTasksDone[item.column].push(item);
  });


  return (
    <>
      <div className="w-[80%] mx-auto">
        <div>
          <h3 className="text-lg font-medium text-picton-blue-50">Roadmap</h3>
          <p className="text-picton-blue-50 text-sm text-picton-blue-50">
            Something you want/need but don't see it on here? Let us know!
          </p>
        </div>
        <Separator />

        <>
          <div>
            <h3 className="text-lg font-medium mt-10 text-picton-blue-50">To-Do</h3>
            <Separator />
            {Object.entries(organizedTasks).map(([type, tasks]) => (
              <div key={type}>
                <h4 className='mt-3 ml-3 text-picton-blue-50'>{type}</h4>
                <Separator />
                {tasks.map((task) => (
                  <div key={task.desc} className="ml-3 p-3 flex items-center  mt-3 shadow-md  bg-myColor-900 target:text-primary hover:text-primary text-slate4 active:bg-primary  uppercase  rounded  hover:shadow-md outline-none  ease-linear transition-all duration-150">
                    <p color="my-3 py-3 ">
                      {task.desc}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
        <>
          <div>
            <h3 className="text-lg font-medium mt-10 text-picton-blue-50">Completed</h3>
            <Separator />
            {Object.entries(organizedTasksDone).map(([type, tasks]) => (
              <div key={type}>
                <h4 className='mt-3 ml-3 text-picton-blue-50'>{type}</h4>
                <Separator />
                {tasks.map((task) => (
                  <div key={task.desc} className="ml-3 mr-3 p-3 flex items-center  mt-3 shadow-md  bg-myColor-900 target:text-primary hover:text-primary text-slate4 active:bg-primary  uppercase  rounded  hover:shadow-md outline-none  ease-linear transition-all duration-150">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                      className=" w-4 "
                      alt="Logo"
                    />
                    <p color="my-3 py-3 ml-3">
                      {task.desc}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      </div>
    </>
  );
}


export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/favicons/settings.svg", },
]





/**
//const todoRoadmap = roadMapItems
/*  docs,
  owner,
  quote,
  manager,
  ideas
  useEffect(() => {
    const issuesCount = issues();
    const needsTestCount = needsTesting();
    const wipCount = wip();
    const numberOfItems = completed.length;
    const numberOfItemstodo = completed.length;
   /** setgetDone(getDoneNows)
    setBACKBURN(BACKBURNERs)
    setDoneCount(numberOfItems)
    settobedoneCount(numberOfItemstodo)
    setissuesCount(issuesCount);
    setNeedsTestCount(needsTestCount);
    setwipCount(wipCount);
    setdealeronboarding(Dealeronboarding)
    setdealer(Dealer)
    // setsales(Sales)
    setservice(Service)
    setquote(Quote)
    setparts(Parts)
    setaccessories(Accessories)
    setadmin(Admin)
    setinfastructure(Infastructure)
    setdash(Dash)
    setcommunications(Communications)
    setpaidfeatureai(Paidfeatureai)
 *//**
const organizedTasks = {};
roadMapItems.forEach((item) => {
if (!organizedTasks[item.column]) {
organizedTasks[item.column] = [];
}
organizedTasks[item.column].push(item);
});

const organizedTasksDone = {};
completed.forEach((item) => {
if (!organizedTasksDone[item.column]) {
organizedTasksDone[item.column] = [];
}
organizedTasksDone[item.column].push(item);
});
}, []); // Empty dependenc
*/
/**
  const [doneCount, setDoneCount] = useState()
  const [tobedoneCount, settobedoneCount] = useState()
  const [issuesCount, setissuesCount] = useState()
  const [needsTestCount, setNeedsTestCount] = useState()
  const [wipCount, setwipCount] = useState()
  const [getDone, setgetDone] = useState()
  const [BACKBURN, setBACKBURN] = useState()
  const [dealeronboarding, setdealeronboarding] = useState()
  const [dealer, setdealer] = useState()
  const [sales, setsales] = useState()
  const [service, setservice] = useState()
  const [quote, setquote] = useState()
  const [parts, setparts] = useState()
  const [admin, setadmin] = useState()
  const [accessories, setaccessories] = useState()
  const [infastructure, setinfastructure] = useState()
  const [dash, setdash] = useState()
  const [communications, setcommunications] = useState()
  const [paidfeatureai, setpaidfeatureai] = useState()
  function issues() {
    const completedOrNeedsTestingItems = issue.filter(item => {
      return item.column && item.column.includes('ISSUE'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function getDoneNows() {
    const completedOrNeedsTestingItems = getDoneNow.filter(item => {
      return item.column && item.column.includes('ISSUE'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function BACKBURNERs() {
    const completedOrNeedsTestingItems = BACKBURNER.filter(item => {
      return item.column && item.column.includes('BACKBURNER'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function needsTesting() {
    const completedOrNeedsTestingItems = doneneedstesting.filter(item => {
      return item.column && item.column.includes('DONE NEEDS TESTING'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function wip() {
    const completedOrNeedsTestingItems = WIP.filter(item => {
      return item.column && item.column.includes('WIP'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Automation() {
    const completedOrNeedsTestingItems = automation.filter(item => {
      return item.column && item.column.includes('AUTOMATION'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Dealeronboarding() {
    const completedOrNeedsTestingItems = dealerOnboarding.filter(item => {
      return item.column && item.column.includes('DEALER ONBOARDING'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Dealer() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.column && item.column.includes('DEALER'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Service() {
    const completedOrNeedsTestingItems = service.filter(item => {
      return item.column && item.column.includes('SERVICE'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Quote() {
    const completedOrNeedsTestingItems = doneneedstesting.filter(item => {
      return item.column && item.column.includes('QUOTE'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Parts() {
    const completedOrNeedsTestingItems = parts.filter(item => {
      return item.column && item.column.includes('PARTS'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Accessories() {
    const completedOrNeedsTestingItems = accessories.filter(item => {
      return item.column && item.column.includes('ACCESSORIES'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Admin() {
    const completedOrNeedsTestingItems = admin.filter(item => {
      return item.column && item.column.includes('ADMIN'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Infastructure() {
    const completedOrNeedsTestingItems = infastructure.filter(item => {
      return item.column && item.column.includes('INFASTRUCTURE'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Dash() {
    const completedOrNeedsTestingItems = dash.filter(item => {
      return item.column && item.column.includes('DASH'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Communications() {
    const completedOrNeedsTestingItems = communications.filter(item => {
      return item.column && item.column.includes('COMMUNICATIONS'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Paidfeatureai() {
    const completedOrNeedsTestingItems = paidfeature.filter(item => {
      return item.column && item.column.includes('PAID FEATURE - ai'); // Check if item.column exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  } */
