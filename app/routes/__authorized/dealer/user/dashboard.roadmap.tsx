

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

export const metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export const todoRoadmap = [
  // ----------------------------------------------------------DONE NEEDS TESTING---------------------------------------
  { board: "dev", column: "done needs testing", item: "use same system as notifications to check on new mail, if different than whats saved, creatre notifaction evry 10 mins - done needs testing" },
  { board: "dev", column: "done needs testing", item: "webhook for incoming emails, save notifiation and messeages" },
  { board: "dev", column: "done needs testing", item: "when bike becomes available that customer is looking at or something similar set note in finance file and notifition for user" },
  // -----------------------------------------------------------WIP-----------------------------------------------------
  { board: "dev", column: "WIP", item: "have your own csi reporting for the dealer that can be sent to customers" },
  { board: "dev", column: "WIP", item: "implement server to accommodate automation https://github.com/Saicharan0662/email-scheduler-client" },
  { board: "dev", column: "WIP", item: "mass email/sms - wip" },
  { board: "dev", column: "WIP", item: "manager Dashboard" },
  { board: "dev", column: "WIP", item: "sales manager dash" },
  { board: "dev", column: "WIP", item: "dev control panel needs to send email to new dealers with sign in info" },
  { board: "dev", column: "WIP", item: "https://developers.klaviyo.com/en/reference/get_campaigns" },
  // ---------------------------------------------------------ISSUE-----------------------------------------------------
  { board: "dev", column: "issue", item: "export in managers section - export csv files of customers, inventory etc" },
  // -----------------------------------------------------OWNER---------------------------------------------------------
  { board: "dev", column: "owner", item: "Owners dashboard" },
  { board: "dev", column: "owner", item: "Owner Section" },
  // -----------------------------------------------------OWNER---------------------------------------------------------
  // -----------------------------------------------------DOCS----------------------------------------------------------
  { board: "dev", column: "docs", item: "Videos for docs" },
  // -----------------------------------------------------DOCS----------------------------------------------------------
  // -----------------------------------------------------DEALER--------------------------------------------------------
  // -----------------------------------------------------DEALER--------------------------------------------------------
  // -----------------------------------------------------------SALES---------------------------------------------------
  { board: "dev", column: "sales", item: "Call center Section" },
  { board: "dev", column: "sales", item: "Trade in pricing from the kelley blue book integrated right into our quoting system." },
  { board: "dev", column: "sales", item: "sales bot - take care of some of the sales process - uses natural language processing and machine learning to assist in automated contract negotiations based on predefined parameters." },
  { board: "dev", column: "sales", item: "sales bot 2 - customer onboarding" },
  { board: "dev", column: "sales", item: "sales bot 3 - after sales" },
  { board: "dev", column: "sales", item: "Add trello board to user section so they can use it if they want to" },
  { board: "dev", column: "sales", item: "finance dash neeed to add up totals from new package area" },
  // -------------------------------------------------------------SALES-------------------------------------------------
  // ------------------------------------------------------AUTOMATION---------------------------------------------------
  { board: "dev", column: "Automation", item: "for lead rotation, if customer pending after an hour it goes up onto a free for all board so anyone can respond to him" },
  { board: "dev", column: "Automation", item: "customer set time before delivery of what to bring" },
  { board: "dev", column: "Automation", item: "auto email at 5, 2.5 months and 30, 7 days before consent expires, 2 years if bought, 6 months if not" },
  { board: "dev", column: "Automation", item: "customer 2 months after pick up to make sure everything is still good" },
  // ----------------------------------------------------AUTOMATION-----------------------------------------------------
  // -------------------------------------------------------------SERVICE-----------------------------------------------
  { board: "dev", column: "service", item: "tech should just be aqble to look at his agenda and know what hes doing for the day, he should have access to all the information he needs from his terminal without having to go find anyone and bug them about it and no more paperwork" },
  { board: "dev", column: "service", item: "service writer dash" },
  { board: "dev", column: "service", item: "tech dash" },
  // ---------------------------------------------------------------SERVICE---------------------------------------------
  // --------------------------------------------------------------QUOTE------------------------------------------------
  { board: "dev", column: "quote", item: "set up more parts pages - started - Manitou done - switch started" },
  // ---------------------------------------------------------------QUOTE-----------------------------------------------
  // -------------------------------------------------------------PARTS-------------------------------------------------
  { board: "dev", column: "parts", item: "parts dash" },
  { board: "dev", column: "parts", item: "shpping and receiving dash" },
  { board: "dev", column: "parts", item: "parts specfic page to print label, make changes etc, have search table that switch from table to part view using use state like the one in newleads" },
  // -----------------------------------------------------------------PARTS---------------------------------------------
  // -----------------------------------------------------------accessories---------------------------------------------
  { board: "dev", column: "accessories", item: "acc dash" },
  // ----------------------------------------------------------accessories----------------------------------------------
  // -----------------------------------------------------------MANAGER-------------------------------------------------
  { board: "dev", column: "manager", item: "cross platform ad manager, post it once here and push it to different providors" },
  // ----------------------------------------------------------MANAGER--------------------------------------------------
  // ---------------------------------------------------------ADMIN-----------------------------------------------------

  { board: "dev", column: "admin", item: "have it populate api keys so managers can hand them out" },
  // ----------------------------------------------------------ADMIN----------------------------------------------------
  // ---------------------------------------------------DEALER ONBOARDING-----------------------------------------------
  { board: "dev", column: "dealer onboarding", item: "invite user section where it send an email with links to the crm and" },
  { board: "dev", column: "dealer onboarding", item: "role specific invites, for example when invitiing a tech only show him what hes going to be using maybe even see if you can book mark for them to make it super easy" },
  { board: "dev", column: "dealer onboarding", item: "free simple install with insructions, fee for total install - for dealer that already have an it team it would save them money" },
  // ------------------------------------------------------DEALER ONBOARDING--------------------------------------------
  // ------------------------------------------------INFASTRUCTURE------------------------------------------------------
  { board: "dev", column: "infastructure", item: "have a second non-cloud option, either as a rack for a server or tower for a non tech orientated dealer to be hosted on site but would need a license key that needs a new token every 30 days/6 months/12 months to operate based on payment plan, hardware to be paid upfront before build, payments start once activated at dealer" },
  // -------------------------------------------------INFASTRUCTURE-----------------------------------------------------
  // ------------------------------------------------DASH---------------------------------------------------------------
  { board: "dev", column: "dash", item: "dynamic dashboard widgets" },
  // ---------------------------------------------DASH------------------------------------------------------------------
  // ----------------------------------------COMMUINICATIONS------------------------------------------------------------
  { board: "dev", column: "communications", item: "email / sms campaigns" },
  { board: "dev", column: "communications", item: "fb msgr integration" },
  // ---------------------------------------COMMUINICATIONS-------------------------------------------------------------
  // ----------------------------------PAID FEATURE---------------------------------------------------------------------
  { board: "dev", column: "paid feature - ai", item: "predictive analysis of sales trends" },
  { board: "dev", column: "paid feature - ai", item: "customter analysis, retention, customer $ worth, visits, and more" },
  { board: "dev", column: "paid feature - ai", item: "Predictive Customer Behavior Modeling, Utilize advanced machine learning models to predict future customer behaviors and preferences based on historical data. ie percentages on how liuekly the customer can be closed if asked at that time" },
  { board: "dev", column: "paid feature - ai", item: "*** currently working - need to attach to components and find a way to turn on or off pending payment by customer ***" },
  { board: "dev", column: "paid feature - ai", item: "speech to text for quicker input - done in components folder" },
  { board: "dev", column: "paid feature - ai", item: "AI writing partner for emails, templates and scripts - done in components folder" },
  { board: "dev", column: 'paid feature - ai', item: 'have ai take in last 5 emails with customer and suggest your next communication/script - not done yet but easy enough to complete in components folder' },
  { board: "dev", column: 'paid feature - ai', item: 'vercel has a nice write up on this to do in their platform - ai - wip - https://github.com/steven-tey/chathn/blob/main/app/api/chat/route.ts' },
  { board: "dev", column: "paid feature - ai", item: "Ai assistant to book apointments, complete and etc like gowrench or just a work flow to customers to guide themselves" },
  // ----------------------------------PAID FEATURE---------------------------------------------------------------------
  // ----------------------------------IDEAS---------------------------------------------------------------------
  { board: "dev", column: "ideas", item: "saveform to local storage, never loose data for a internet hiccup or outage" },

  // ----------------------------------IDEAS---------------------------------------------------------------------


];

const DoneRoadMap = [
  { board: "dev", column: "WIP", item: "Finance Dashboard" },

  { board: "dev", column: "Dev", item: "need to make function that addes prisma statemnt to save alll communucations" },
  { board: "dev", column: "Dev", item: "mobile frendly dash and calendar" },
  { board: "dev", column: "Dev", item: "automation - instead of doing it like activxi... that no one can use anyways - just have options of different automation tasks like follow up after pick up, or reminders before appts, you can always offer customized automations but theres no point having a system no one uses but the person choose the time frames" },
  { board: "dev", column: "WIP", item: "UserEmailTemplates so users can add their own templates to the template drop down in overview" },
  { board: "dev", column: "Dev", item: "Dealer Onboarding - done" },
  { board: "dev", column: "Dev", item: "in quote loader there is updateReadStatus() instead of it being triggered here this should be converted to an automation" },
  { board: "dev", column: "Dev", item: "welcome email for sales people" },
  { board: "dev", column: "Dev", item: "once dealer signs up, send welcome email bringing them to the page they need to fill out for the informatoin to build their site" },
  { board: "dev", column: "Dev", item: "file upload in customer file - done " },
  { board: "dev", column: "Dev", item: "emails in overview - done" },
  { board: "dev", column: "Dev", item: "employee onboarding - done - be need to redo admin dashbaoard that deals with usrs" },
  { board: "dev", column: "Dev", item: "Dealer Onboarding - done - automate creation of vercel need to get the url and save it in our database, just use the one repo once you sync it upgrades evrvyones vercel sites" },
  { board: "dev", column: "issue", item: "add ping system for notes - COMPLETED BUT NEEDS TESTING" },
  { board: "dev", column: "issue", item: "need to change how to load overview,   by financeId maybe save the financeId to local storage or a cookie to always have acxcess to the last one u made" },
  { board: "dev", column: "WIP", item: "Dept Leaderboards" },
  { board: "dev", column: "WIP", item: "finish automation dash - wip" },
  { board: "dev", column: "dealer onboarding", item: "automate on boarding" },
  { board: "dev", column: "admin", item: "employee onboarding" },
  { board: "dev", column: "issue", item: "overview emails" },
  { board: "dev", column: "google", item: "utilize other services from google, notes, to-do, sms, voice chat, call recording, video calling, teaam chat?, tasks and plans,  " }, { board: "dev", column: "done needs testing", item: "API file upload will be released once google approves gmail as its still in the process right now - done needs testing" },
  { board: "dev", column: 'google', item: 'has a push notiications for new incoming emails' },
  { board: "dev", column: "dealer onboarding", item: "initial data can be put into seed file filed out by dealer" },
  { board: "dev", column: "done needs testing", item: "roles based access - done needs testing" },
  { board: "dev", column: "NTBC", item: "API Docs" }, { board: "dev", column: "issue", item: "notifications" },
  { board: "dev", column: "sales", item: "Demo Day Dashboard" },
  { board: "dev", column: "quote", item: "Save form to LOCAL STORASGE(CHECK REMIX SITE FOR SOLUTIONp) incase something happens to connection or if they srep awway from their computer that way whenever you come back the form is filled out the way you left it" }, { board: "dev", column: "admin", item: "import customers" },
  { board: "dev", column: "admin", item: "import parts" }, { board: "dev", column: "admin", item: "export parts" },
  { board: "dev", column: "admin", item: "export acc" },
  { board: "dev", column: "dealer onboarding", item: "new sales page with upgrades" },
  { board: "dev", column: "admin", item: "import acc" },
  { board: "dev", column: "dealer onboarding", item: "docs videos" },
  { board: "dev", column: "dealer onboarding", item: "quote how-to" },
  { board: "dev", column: "dealer onboarding", item: "sales dashboard how-to" },
  { board: "dev", column: "dealer onboarding", item: "calendar how-to" },
  { board: "dev", column: "dealer onboarding", item: "automation how-to" },
  { board: "dev", column: "dealer onboarding", item: "template how-to" },
  { board: "dev", column: "dealer onboarding", item: "inventory how-to" },
  { board: "dev", column: "dealer onboarding", item: "document builder how-to" },
  { board: "dev", column: "dealer onboarding", item: "sales process start to finsih" },
  { board: "dev", column: "WIP", item: "calendar to set store hours" },
  { board: "dev", column: "nonUrgent", item: "to add onto the last one - unit sold in territories, report already out there owners of dealers get them" },
  { board: "dev", column: "WIP", item: "redesign subscription page to include 2 optoinns for stand alone sales people and dealers" },
  { board: "dev", column: "issue", item: "move staff chat to sms messenger" },
  { board: "dev", column: "website sales", item: "try out section where people can see how much quicker the process can be" },
  { board: "dev", column: "NTBC", item: "Dept and General Staff Chat" },
  { board: "dev", column: 'google', item: 'tasks' },
  { board: "dev", column: 'google', item: 'Calendar' },
  { board: "dev", column: "Automation", item: "sales person schedule for lead rotation" },
  { board: "dev", column: 'google', item: 'Keep note' },
  { board: "dev", column: "issue", item: "add customer on dashboard needs to be updated to be the same as on calendar" },
  { board: "dev", column: "sales process", item: "update finance mgr lock so that the sales person can have a in queue timer" },
  { board: "dev", column: "issue", item: "need mileage for new vehciles for printing paperwork" },
  { board: "dev", column: "wip - crm integration", item: "complete first integration" },
  { board: "dev", column: "issue", item: "everything google on hold - google is asking for requirments that they were never upfront about" },
  { board: "dev", column: "done needs testing", item: "have all features off of the same platform/project - done needs testing" },
  { board: "dev", column: "Automation", item: "have it so you can tag a customers file so when a test drive cmoes around it just reminds you to get them on  ti or on wish ist" },
  { board: "dev", column: "dealer onboarding", item: "script how-to" },
  { board: "dev", column: "dealer onboarding", item: "payment calc how-to" },
  { board: "dev", column: "issue", item: "need to redo email templates in overview - wip move email templates to template section??? and just have a email client in its place then it would really just be three choices instead of 100 and something because it would just take whatewver payments that are saved" },
  { board: "dev", column: "issue", item: "to get notified when new useed units come in for customers wish list - just generate brand / model list to choose from instead of letting them type it in" },
  { board: "dev", column: "paid feature", item: "sms messenger" },
  { board: "dev", column: "dealer onboarding", item: "each dealer will have their own server on vercel, own database on planetscale, and so forth find a way to automate this even though it doesnt take any time to do so" },
  { board: "dev", column: "quote", item: "find source with API with up-to-date model information - Kelly Black Book - they have the product take picutre of blue ages for now and just ocr scan - just going to use dealer binders of dealers that sign up - alkmost completed" },
  { board: "dev", column: "issue", item: "google auth fixed need to verify, put in root " },
  { board: "dev", column: "issue", item: "email not currently working in overview" },
  { board: "dev", column: "issue", item: "to get notified when new useed units come in for customers wish list" },
  { board: "dev", column: "issue", item: "lien payout - COMPLETED BUT NEEDS TESTING" },
  { board: "dev", column: "issue", item: "csv upload for prodcuts and inventory" },
  { board: "dev", column: "communications", item: "set up whatsap for dealing with dealer customers affiliate marketers" },
  { board: "dev", column: "dash", item: "dash switcher in settings to change from integration to integration or not" },
  { board: "dev", column: "communications", item: "whats app integration" },
  { board: "dev", column: "issue", item: "put customer coms in cuterom file not bike file - DID NOT COMPLETE REVISIT AFTER BETA " },
  { board: "dev", column: "notifications", item: "push notifications - cheat way to do it in terms of cost and coding - just send a email along with the in app notfication as long as your phone is hooked up to your computer, you will get notified through your phone and computer" },
  { board: "dev", column: "issue", item: "last note column" },
  { board: "dev", column: "issue", item: "sms messenger" },
  { board: "dev", column: "issue", item: "calendar - complete appointment" },
  { board: "dev", column: "issue", item: "email refresh token use revalidateOnFocus from swr to refresh tokens https://swr.vercel.app/docs/revalidation" },
  { board: "dev", column: "Automation", item: "integration with vercel app - wip" },
  { board: "dev", column: "user", item: "fields to add - triggerFieldList in automations" },
  { board: "dev", column: "customer", item: "add api to import new leads" },
  { board: "dev", column: "notifications", item: "upcoming appt - wip" },
  { board: "dev", column: "quote", item: "unit picker - once model is selected with customer=, table will render in modal with the avialble units for sale right on the quote if the customer wants to go for it" },
  { board: "dev", column: "notifications", item: "instead of somweething fancy and expensive jsut use db and have it laod on each render, and have page reload afdter 10 mins or something of inactivty - wip" },
  { board: "dev", column: "sales process", item: "internal IM system would help with these things, relying on the note system within the custemer files is just stupid - https://github.com/remix-run/examples/tree/main/sse-chat" },
  { board: "dev", column: "issue", item: "pre populate random dealer info to start customer can always change it" },
  { board: "dev", column: "crm integration", item: "inital api function" },
  { board: "dev", column: "crm integration", item: "create matching records - figure out the best way to then integrate the data into our system" },
  { board: "dev", column: "crm integration", item: "SyncLeadData - should we update leads from activix each time login? or refresh?" },
  { board: "dev", column: "issue", item: "production enviroment with new google implmentation" },
  { board: "dev", column: "issue", item: "registration" },
  { board: "dev", column: "calendar", item: "render sms or email clients in claendsar appointments to take care of that right then and ther" },
  { board: "dev", column: "user", item: "add 2FA" },
  { board: "dev", column: "issue", item: "QUOTE/USED - wip" },
  { board: "dev", column: "issue", item: "internal chat" },
  { board: "dev", column: "issue", item: "notifications" },
  { board: "dev", column: "admin", item: "import of lists like inventory, customers, parts, acc" },
  { board: "dev", column: "admin", item: "add new users through admin protal" },
  { board: "dev", column: "dash", item: "pop up to display entire conversation history non interactive because that wont work" },
  { board: "dev", column: "dev", item: "project is getting to big to continue testing, need a page to automate testing" },
  { board: "dev", column: "issue", item: "Calendar missing 2 of its views" },
  { board: "dev", column: "issue", item: "admin add user not working properly" },
  { board: "dev", column: "dash", item: "import / export customer base" },
  { board: "dev", column: "admin", item: "import inventory" },
  { board: "dev", column: "admin", item: "export inventory" },
  { board: "dev", column: "admin", item: "import users" },
  { board: "dev", column: "admin", item: "export users" },
  { board: "dev", column: "dash", item: "demo day list like the wish list?" },
  { board: "dev", column: "dash", item: "have a quick contact option at the top of the page where you can skip account creation to send an email or text as your typing email or phone it searches for the client file, onc esent the next page would be go to create client file or go to client file " },
  { board: "dev", column: "user", item: "need heavy hitter finance manager to accommodate them for CRM" },
  { board: "dev", column: "quote", item: "hook up communication counter" },
  { board: "dev", column: 'google', item: 'gmail done' },
  { board: "dev", column: "dash", item: "import / export inventory" },
  { board: "dev", column: "admin", item: "redesign admin page" },
  { board: "dev", column: "dash", item: "finance manager dash" },
  { board: "dev", column: "sales process", item: "electronic handovers - when you're sitting there customer says yes let's go financing instead of clunkily or very like just not efficiently going to find the f&I if they're not in the office it's going to look for them you know bring them to folder all this garbage and then go back to the customer bring them over when they're ready instead push a buttoon so that way it immediately notifies them cuz like you know when they have customers or when they don't it's already done in the systewm, the deals already built in the system so they don't have to build it at all or anything and they could just run from there so they can either reply be there in 2 seconds or be there in 5 minutes cuz they're on a call or something like that and instead of salesperson getting up going over you know leaving the customer instead they could just be with the customer the entire time and then literally just have that right person just come up into the office and make it seem like a really tight run ship same thing with sales managers the offers that are in the office at his desk or whatever he gets a notification that this customer, your customer in front of you want to get a deal done and he wants to get an XYZ dollars he can just reply to you in the system immediately and get it done for you instead of you know let me go find find him you should never have to leave the customer and it tighters everything up as far as the process goes and the customers experience is going to be like wow these guys know what they're doing they're running a really tight ship everything's quick it's fast like they obviously know what they're doing include the ability to search the inventory on the unit u picked with the custoemr so without leaving the qquote u know its in styock with what colors" },
  { board: "dev", column: "sales process", item: "to add to last item - put a non removablew modal for when client is ready to finance when at the dealer that will lock the app of the finance managers till someone clicks accept unless they are already currently in a file, need to find a way to kick them off the file after a period of inactivty to ensure they dont cheat the system" },
  { board: "dev", column: "client file", item: "change checkbox section so only finance can change finance items but display once they are checked off" },
  { board: "dev", column: "admin", item: "redesign admin page" },
  { board: "dev", column: "quote", item: "once sold, do all the stupid stuff behind the scenes rather than having to do it multiple times when u sell a unit" },
  { board: "dev", column: "inventory", item: "have inventory hooked to the quotes so the sales perosn can see in while pricing the customer you can see if its in stock and what colors are available" },
  { board: "dev", column: "Auto print", item: " have AI component attached to the email client to rewrite emails if needed - huge cost wip" },
  { board: "dev", column: "user", item: "statistics page based on data from dash and CRM" },
  { board: "dev", column: "user", item: "for sales tracker, add up delivered and add it to sales tracker, whatever the value is now" },
  { board: "dev", column: "user", item: "utilize user notifications - sns providor has this option WIP" },
  { board: "dev", column: "user", item: "have dealer staff able to edit others' clients" },
  { board: "dev", column: "Templates", item: "have an option on the text editor to be able to save as template on text and email so you can quickly savew it and review again later rather than praying you dont close that tab, which u do anyways" },
  { board: "dev", column: "dash", item: "make an assigned to area on purchasing tab" },
  { board: "dev", column: "deployment", item: "look at some github actions so when you update the main repo it would push the update to all the repos or look into vercel, have one repo for multiple deployments" },
  { board: "dev", column: "dash", item: "search to find a customer placed at root WIP" },
  { board: "dev", column: "dash", item: "combine customers? idk how i feel about that, would rather have the ability to 'meld' them, becoming one but with multiple units." },
  { board: "dev", column: "task", item: "Hide feature buttons if unavailable" },
  { board: "dev", column: "task", item: "Move feature buttons to sidebar" },
  { board: "dev", column: "task", item: "See if auto email will work in sidebar" },
  { board: "dev", column: "user", item: "sms" },
  { board: "dev", column: "user", item: "add dealer roles - WIP" },
  { board: "dev", column: "external link", item: "https://stackoverflow.com/questions/75189762/how-to-save-contact-details-from-a-website-to-an-android-or-iphone-using-html-bu" },
  { board: "dev", column: "text client", item: "chatgpt integration to reply or create or edit emails on the fly with only a short description from you  - huge cost" },
  { board: "dev", column: "email client", item: "chatgpt integration to reply or create or edit emails on the fly with only a short description from you  - huge cost" },
  { board: "dev", column: "quote", item: "put follow-up buttons on quote as well" },
  { board: "dev", column: "website", item: "change favicon based on brand" },
  { board: "dev", column: "dash", item: "mass sms" },
  { board: "dev", column: "dash", item: "payment calc with no ability to select a unit" },
  { board: "dev", column: "user", item: "Allow users to store their own custom emails" },
  { board: "dev", column: "dash", item: "lock fields on delivered" },
  { board: "dev", column: "dash", item: "mass sms" },
  { board: "dev", column: "dash", item: "sms" },
  { board: "dev", column: "user", item: "Give the ability for people to upload their own worksheets, contracts, and such - https://pspdfkit.com/guides/web/downloads/" },
  { board: "dev", column: "email client", item: "create client - like short wave, they stole my idea for it" },
  { board: "dev", column: "customer profile", item: "print area on customer profile to print pre-populated paperwork" },
  { board: "dev", column: "email client", item: "email client near completion - utilize other services from azure, notes, to-do, sms, voice chat, call recording, video calling, teaam chat?, tasks and plans,  " },
  { board: "dev", column: "dash", item: "crm integration - along with our CRM - WIP" },
  { board: "dev", column: "Auto print", item: " customer work sheets - WIP" },
  { board: "dev", column: "Auto print", item: " test drive waiver - WIP" },
  { board: "dev", column: "Auto print", item: " UCDA - WIP" },
  { board: "dev", column: "email", item: "more scriptied emails" },
  { board: "dev", column: "customer profile", item: "implement DocuSign" },
  { board: "dev", column: "user", item: "send email to salesperson when someone else enters yellow or red notes" },
  { board: "dev", column: "calendar", item: "service cal" },
  { board: "dev", column: "calendar", item: "parts cal" },
  { board: "dev", column: "calendar", item: "sales manager" },
  { board: "dev", column: "calendar", item: "finance manager" },
  { board: "dev", column: "client", item: "implement server to accommodate automation" },
  { board: "dev", column: "dash", item: "record and show all previous interaction" },
  { board: "dev", column: "dash", item: "have drop down for notes with ones you use most i.e. was supposed to come in, followed up, no answer so speed up follow up reschedule" },
  { board: "dev", column: "dash", item: "calendar" },
  { board: "dev", column: "user", item: "Microsoft Outlook has an API for email, can make your own mail page in the app, along with calendar and Todo. Check other services from Microsoft" },
  { board: "dev", column: "dash", item: "look at making table from scratch, would alleviate all the problems you're having, and allow for more customization" },
  { board: "dev", column: "dash", item: "check this out for a table alternative - https://github.com/bvaughn/react-virtualized" },
  { board: "dev", column: "dash", item: "for advanced filtering - https://www.youtube.com/watch?v=MY6ZZIn93V8" },
  { board: "dev", column: "dash", item: "date range filter for calls" },
  { board: "dev", column: "dash", item: "different tables for different views, i.e., sold, not delivered, pending" },
  { board: "dev", column: "dash", item: "under settings have a table that displays delivered and to be delivered" },
  { board: "dev", column: "dash", item: "save current filter/sort to cookie so it doesn't interrupt your workflow" },
  { board: "dev", column: "dash", item: "implement a way to show reached till phone service is working" },
  { board: "dev", column: "dash", item: "filter per column" },
  { board: "dev", column: "quote", item: "along with DocuSign, digitize any other docs for a smoother paperwork process" },
  { board: "dev", column: "user", item: "allow users to opt out of 2-day auto follow-up" },
  { board: "dev", column: "dash", item: "Texting is broken in scripts" },
  { board: "dev", column: "auto email", item: "customer set time after delivery thanking them and asking for referrals" },
  { board: "dev", column: "auto email", item: "finance - reminders to clients if missing anything from finance or sales" },
  { board: "dev", column: "task", item: "Put a copy text button for each script" },
  { board: "dev", column: "user", item: "Take off contact and script upload since it's in the menu now" },
  { board: "dev", column: "dash", item: "instead of sorting the table to see what deliveries are, have a 3-day rolling list, one less thing to sort on the table, the same in-person appt, not follow-up calls" },
  { board: "dev", column: "quote", item: "apt list breakdown on profile with delete and edit options" },
  { board: "dev", column: "dash", item: "change filter input to dropdown based on column selection" },
  { board: "dev", column: "dash", item: "have it on top of the dashboard so it displays every morning and you can select a button to hide so you never forget about deliveries" },
  { board: "dev", column: "dash", item: "change filter input to dropdown based on column selection" },
  { board: "dev", column: "task", item: "API file upload does not work in production folder API is already in use by platform Procidor move API/file upload to dealerapi/fileupload" },
  { board: "dev", column: "task", item: "Cookies for user preferences" },
  { board: "dev", column: "task", item: "Cookies for user preferences" },
  { board: "dev", column: "dash", item: "have the dash just be able to send texts and call, have the messenger somewhere else" },
  { board: "dev", column: "dash", item: "make full CRM - once done with the original app - WIP" },
  { board: "dev", column: "user", item: "instant messenger - to not use LoaderData, that god-awful messenger anymore - started but didn't work out" },
  { board: "dev", column: "user", item: "phone working but not on a wide scale" },
  { board: "dev", column: "quote", item: "finish customer profile with all functionality" },
  { board: "dev", column: "dash", item: "document upload section on dash for each customer" },
  { board: "dev", column: "user", item: "allow the user to set the default follow-up day" },
  { board: "dev", column: "task", item: "have the last note on the dashboard, have notes on customer page / return to quote button" },
  { board: "dev", column: "task", item: "fix attachment to customer notes" },
  { board: "dev", column: "task", item: "complete dash with full functionality" },
  { board: "dev", column: "task", item: "Cookies for user preferences" },
  { board: "dev", column: "task", item: "add attachment to customer notes" },
  { board: "dev", column: "task", item: "add reset password" },
  { board: "dev", column: "task", item: "automatically complete call when emailing from dashboard" },
  { board: "dev", column: "task", item: "add customer button to dash to quickly add customers" },
  { board: "dev", column: "task", item: "update state automatically based on what's chosen from the client card" },
  { board: "dev", column: "task", item: "just building a CRM - save customers and their vehicle sheets? Uploading to CRM should be good enough. The whole point is not to be a CRM and just help salespeople with speed. By pushing the data to the CRM immediately, there's no point to save it maybe. Have the user only ever update the database so it only has one entry, while keeping access to their quote in profile, show last and all the details" },
  { board: "dev", column: "task", item: "settings menu to set variables per salesperson" },
  { board: "dev", column: "task", item: "admin dashboard? - started" },
  { board: "dev", column: "task", item: "Instant print cash contacts" },
  { board: "dev", column: "task", item: "redesign checkbox" },
  { board: "dev", column: "task", item: "new navbar" },
  { board: "dev", column: "task", item: "backend" },
  { board: "dev", column: "task", item: "logos" },
  { board: "dev", column: "task", item: "auto payments calc" },
  { board: "dev", column: "task", item: "auto print spec sheet without visiting any site" },
  { board: "dev", column: "task", item: "page for every brand that we have information on" },
  { board: "dev", column: "task", item: "hidden discount inputs - one for $ amount, another for %" },
  { board: "dev", column: "task", item: "second print button so it prints the spec sheet of the model the customer is looking at, so you can give it to the customer without having to dig through the ones you already downloaded or go through 16 web pages on Can-Am's website to get to it - completed Kidoo, Can-Am - partial, Manitou, Switch, Sea-Doo" },
  { board: "dev", column: "task", item: "query website by stock number to see if it's in stock - not feasible across so many dealers" },
  { name: "dash - Use twilio conversations so that way you can also talk to Facebook from the messenger with one click" },
  { name: "user - Give the ability for p ople to upload there own work sheets, contracts and such" },
  { name: "dash - Have the dash just be able to send twxts and call have the messenger somewhere else  	" },
  { name: "dash - Icrosoft outlook has an API for email, can make your own mail page in app Along with calendar and Todo check other services from microsoft" },

];


export default function DashboardPage() {

  const [doneCount, setDoneCount] = useState()
  const [tobedoneCount, settobedoneCount] = useState()
  const [issuesCount, setissuesCount] = useState()
  const [needsTestCount, setNeedsTestCount] = useState()
  const [wipCount, setwipCount] = useState()



  function issues() {
    const completedOrNeedsTestingItems = DoneRoadMap.filter(item => {
      return item.type && item.type.includes('issue'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }

  function needsTesting() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('done needs testing'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }

  function wip() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('WIP'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  function Automation() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('Automation'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [dealeronboarding, setdealeronboarding] = useState()

  function Dealeronboarding() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('dealer onboarding'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [dealer, setdealer] = useState()

  function Dealer() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('dealer'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [sales, setsales] = useState()

  function Sales() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('sales'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [service, setservice] = useState()

  function Service() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('service'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [quote, setquote] = useState()

  function Quote() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('quote'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [parts, setparts] = useState()

  function Parts() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('parts'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [accessories, setaccessories] = useState()

  function Accessories() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('accessories'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [admin, setadmin] = useState()

  function Admin() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('admin'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [infastructure, setinfastructure] = useState()

  function Infastructure() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('infastructure'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [dash, setdash] = useState()

  function Dash() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('dash'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [communications, setcommunications] = useState()

  function Communications() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('communications'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }
  const [paidfeatureai, setpaidfeatureai] = useState()
  function Paidfeatureai() {
    const completedOrNeedsTestingItems = todoRoadmap.filter(item => {
      return item.type && item.type.includes('paid feature - ai'); // Check if item.type exists before calling includes
    });
    return completedOrNeedsTestingItems.length;
  }

  // Assuming you are using React state to store these counts
  useEffect(() => {
    // Calculate counts and update state once on component mount
    const issuesCount = issues();
    const needsTestCount = needsTesting();
    const wipCount = wip();
    const numberOfItems = DoneRoadMap.length;
    const numberOfItemstodo = todoRoadmap.length;
    setDoneCount(numberOfItems)
    settobedoneCount(numberOfItemstodo)
    setissuesCount(issuesCount);
    setNeedsTestCount(needsTestCount);
    setwipCount(wipCount);
    setdealeronboarding(Dealeronboarding)
    setdealer(Dealer)
    setsales(Sales)
    setservice(Service)
    setquote(Quote)
    setparts(Parts)
    setaccessories(Accessories)
    setadmin(Admin)
    setinfastructure(Infastructure)
    setdash(Dash)
    setcommunications(Communications)
    setpaidfeatureai(Paidfeatureai)

  }, []); // Empty dependenc

  const organizedTasks = {};
  todoRoadmap.forEach((item) => {
    if (!organizedTasks[item.type]) {
      organizedTasks[item.type] = [];
    }
    organizedTasks[item.type].push(item);
  });

  const organizedTasksDone = {};
  DoneRoadMap.forEach((item) => {
    if (!organizedTasksDone[item.type]) {
      organizedTasksDone[item.type] = [];
    }
    organizedTasksDone[item.type].push(item);
  });
  return (
    <>

      <div className="hidden flex-col md:flex">

        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Roadmap</h2>

          </div>
          <Tabs defaultValue="overview" className="space-y-4 text-foreground">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex">
                      <p className='mr-3'>
                        Total Completed
                      </p>
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                        className=" w-4 ml-2 "
                        alt="Logo"
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{doneCount}</div>
                    <p className="text-xs text-muted-foreground">
                      Current projects in progess: {wipCount}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex">
                      Current plans/ideas that need completion!
                      <Target color="#ff0000" className='text-2xl ml-2  ' />
                    </CardTitle>

                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tobedoneCount}</div>
                    <p className="text-xs text-muted-foreground">
                      Current issues:  {issuesCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Needs testing: {needsTestCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-xs text-muted-foreground">
                      What we have planned out
                    </p>
                  </CardHeader>
                  <CardContent className='grid grid-cols-2 justify-between mx-2 '>
                    <p className="text-xs text-muted-foreground">
                      Service: {service}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Communications: {communications}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dash: {dash}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Infastructure: {infastructure}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Admin: {admin}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Accessories: {accessories}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      AI - paid features: {paidfeatureai}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Parts: {parts}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quote: {quote}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dealer: {dealer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sales: {sales}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dealeronboarding: {dealeronboarding}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      If you think of something that we can improve on let us know! Were always looking for feedback.
                    </p>

                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>To do</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className=' h-auto max-h-[40vh] overflow-y-scroll'>
                      {Object.entries(organizedTasks).map(([column, tasks]) => (
                        <div key={column}>
                          <h4 className='mt-3 ml-3 text-picton-blue-50'>{column}</h4>
                          <Separator />
                          {tasks.map((task, index) => (
                            <div key={index} className="ml-3 p-3 flex items-center  mt-3 shadow-md  bg-muted/40 target:text-primary hover:text-primary text-foreground active:bg-primary  text-md uppercase  rounded  hover:shadow-md outline-none  ease-linear transition-all duration-150 rounded-lg">
                              <p color="my-3 text-foreground ">
                                {task.item}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className=' h-auto max-h-[40vh] overflow-y-scroll'>
                      {Object.entries(organizedTasksDone).map(([type, tasks]) => (
                        <div key={type}>
                          <h4 className='mt-3 ml-3 text-picton-blue-50'>{type}</h4>
                          <Separator />
                          {tasks.map((task, index) => (
                            <div key={index} className="ml-3 mr-3 p-3 flex items-center  mt-3 shadow-md   bg-muted/40 target:text-primary hover:text-primary text-foreground active:bg-primary  uppercase text-sm  rounded  hover:shadow-md outline-none  ease-linear transition-all duration-150 rounded-lg">
                              <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                                className=" w-4 "
                                alt="Logo"
                              />
                              <p color="my-3 py-3 ml-3">
                                {task.item}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div >
    </>
  )
}



function Roadmap() {



  const organizedTasks = {};
  todoRoadmap.forEach((item) => {
    if (!organizedTasks[item.type]) {
      organizedTasks[item.type] = [];
    }
    organizedTasks[item.type].push(item);
  });

  const organizedTasksDone = {};
  DoneRoadMap.forEach((item) => {
    if (!organizedTasksDone[item.type]) {
      organizedTasksDone[item.type] = [];
    }
    organizedTasksDone[item.type].push(item);
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

