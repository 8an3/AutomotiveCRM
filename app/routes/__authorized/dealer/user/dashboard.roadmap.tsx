

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
  { type: "done needs testing", desc: "use same system as notifications to check on new mail, if different than whats saved, creatre notifaction evry 10 mins - done needs testing" },
  { type: "done needs testing", desc: "webhook for incoming emails, save notifiation and messeages" },
  { type: "done needs testing", desc: "when bike becomes available that customer is looking at or something similar set note in finance file and notifition for user" },
  // -----------------------------------------------------------WIP-----------------------------------------------------
  { type: "WIP", desc: "have your own csi reporting for the dealer that can be sent to customers" },
  { type: "WIP", desc: "implement server to accommodate automation https://github.com/Saicharan0662/email-scheduler-client" },
  { type: "WIP", desc: "Finance Dashboard" },
  { type: "WIP", desc: "mass email/sms - wip" },
  { type: "WIP", desc: "manager Dashboard" },
  { type: "WIP", desc: "sales manager dash" },
  { type: "WIP", desc: "dev control panel needs to send email to new dealers with sign in info" },
  { type: "WIP", desc: "https://developers.klaviyo.com/en/reference/get_campaigns" },
  // ---------------------------------------------------------ISSUE-----------------------------------------------------
  { type: "issue", desc: "export in managers section - export csv files of customers, inventory etc" },
  // -----------------------------------------------------OWNER---------------------------------------------------------
  { type: "owner", desc: "Owners dashboard" },
  { type: "owner", desc: "Owner Section" },
  // -----------------------------------------------------OWNER---------------------------------------------------------
  // -----------------------------------------------------DOCS----------------------------------------------------------
  { type: "docs", desc: "Videos for docs" },
  // -----------------------------------------------------DOCS----------------------------------------------------------
  // -----------------------------------------------------DEALER--------------------------------------------------------
  // -----------------------------------------------------DEALER--------------------------------------------------------
  // -----------------------------------------------------------SALES---------------------------------------------------
  { type: "sales", desc: "Call center Section" },
  { type: "sales", desc: "Trade in pricing from the kelley blue book integrated right into our quoting system." },
  { type: "sales", desc: "sales bot - take care of some of the sales process - uses natural language processing and machine learning to assist in automated contract negotiations based on predefined parameters." },
  { type: "sales", desc: "sales bot 2 - customer onboarding" },
  { type: "sales", desc: "sales bot 3 - after sales" },
  // -------------------------------------------------------------SALES-------------------------------------------------
  // ------------------------------------------------------AUTOMATION---------------------------------------------------
  { type: "Automation", desc: "for lead rotation, if customer pending after an hour it goes up onto a free for all board so anyone can respond to him" },
  { type: "Automation", desc: "customer set time before delivery of what to bring" },
  { type: "Automation", desc: "auto email at 5, 2.5 months and 30, 7 days before consent expires, 2 years if bought, 6 months if not" },
  { type: "Automation", desc: "customer 2 months after pick up to make sure everything is still good" },
  // ----------------------------------------------------AUTOMATION-----------------------------------------------------
  // -------------------------------------------------------------SERVICE-----------------------------------------------
  { type: "service", desc: "tech should just be aqble to look at his agenda and know what hes doing for the day, he should have access to all the information he needs from his terminal without having to go find anyone and bug them about it and no more paperwork" },
  { type: "service", desc: "service writer dash" },
  { type: "service", desc: "tech dash" },
  // ---------------------------------------------------------------SERVICE---------------------------------------------
  // --------------------------------------------------------------QUOTE------------------------------------------------
  { type: "quote", desc: "set up more parts pages - started - Manitou done - switch started" },
  // ---------------------------------------------------------------QUOTE-----------------------------------------------
  // -------------------------------------------------------------PARTS-------------------------------------------------
  { type: "parts", desc: "parts dash" },
  { type: "parts", desc: "shpping and receiving dash" },
  { type: "parts", desc: "parts specfic page to print label, make changes etc, have search table that switch from table to part view using use state like the one in newleads" },
  // -----------------------------------------------------------------PARTS---------------------------------------------
  // -----------------------------------------------------------accessories---------------------------------------------
  { type: "accessories", desc: "acc dash" },
  // ----------------------------------------------------------accessories----------------------------------------------
  // -----------------------------------------------------------MANAGER-------------------------------------------------
  { type: "manager", desc: "cross platform ad manager, post it once here and push it to different providors" },
  // ----------------------------------------------------------MANAGER--------------------------------------------------
  // ---------------------------------------------------------ADMIN-----------------------------------------------------

  { type: "admin", desc: "have it populate api keys so managers can hand them out" },
  // ----------------------------------------------------------ADMIN----------------------------------------------------
  // ---------------------------------------------------DEALER ONBOARDING-----------------------------------------------
  { type: "dealer onboarding", desc: "invite user section where it send an email with links to the crm and" },
  { type: "dealer onboarding", desc: "role specific invites, for example when invitiing a tech only show him what hes going to be using maybe even see if you can book mark for them to make it super easy" },
  { type: "dealer onboarding", desc: "free simple install with insructions, fee for total install - for dealer that already have an it team it would save them money" },
  // ------------------------------------------------------DEALER ONBOARDING--------------------------------------------
  // ------------------------------------------------INFASTRUCTURE------------------------------------------------------
  { type: "infastructure", desc: "have a second non-cloud option, either as a rack for a server or tower for a non tech orientated dealer to be hosted on site but would need a license key that needs a new token every 30 days/6 months/12 months to operate based on payment plan, hardware to be paid upfront before build, payments start once activated at dealer" },
  // -------------------------------------------------INFASTRUCTURE-----------------------------------------------------
  // ------------------------------------------------DASH---------------------------------------------------------------
  { type: "dash", desc: "dynamic dashboard widgets" },
  // ---------------------------------------------DASH------------------------------------------------------------------
  // ----------------------------------------COMMUINICATIONS------------------------------------------------------------
  { type: "communications", desc: "email / sms campaigns" },
  { type: "communications", desc: "fb msgr integration" },
  // ---------------------------------------COMMUINICATIONS-------------------------------------------------------------
  // ----------------------------------PAID FEATURE---------------------------------------------------------------------
  { type: "paid feature - ai", desc: "predictive analysis of sales trends" },
  { type: "paid feature - ai", desc: "customter analysis, retention, customer $ worth, visits, and more" },
  { type: "paid feature - ai", desc: "Predictive Customer Behavior Modeling, Utilize advanced machine learning models to predict future customer behaviors and preferences based on historical data. ie percentages on how liuekly the customer can be closed if asked at that time" },
  { type: "paid feature - ai", desc: "*** currently working - need to attach to components and find a way to turn on or off pending payment by customer ***" },
  { type: "paid feature - ai", desc: "speech to text for quicker input - done in components folder" },
  { type: "paid feature - ai", desc: "AI writing partner for emails, templates and scripts - done in components folder" },
  { type: 'paid feature - ai', desc: 'have ai take in last 5 emails with customer and suggest your next communication/script - not done yet but easy enough to complete in components folder' },
  { type: 'paid feature - ai', desc: 'vercel has a nice write up on this to do in their platform - ai - wip - https://github.com/steven-tey/chathn/blob/main/app/api/chat/route.ts' },
  { type: "paid feature - ai", desc: "Ai assistant to book apointments, complete and etc like gowrench or just a work flow to customers to guide themselves" },
  // ----------------------------------PAID FEATURE---------------------------------------------------------------------
  // ----------------------------------IDEAS---------------------------------------------------------------------
  { type: "ideas", desc: "saveform to local storage, never loose data for a internet hiccup or outage" },

  // ----------------------------------IDEAS---------------------------------------------------------------------


];

const DoneRoadMap = [
  { type: "Dev", desc: "need to make function that addes prisma statemnt to save alll communucations" },
  { type: "Dev", desc: "mobile frendly dash and calendar" },
  { type: "Dev", desc: "automation - instead of doing it like activxi... that no one can use anyways - just have options of different automation tasks like follow up after pick up, or reminders before appts, you can always offer customized automations but theres no point having a system no one uses but the person choose the time frames" },
  { type: "Dev", desc: "Dealer Onboarding - done" },
  { type: "Dev", desc: "in quote loader there is updateReadStatus() instead of it being triggered here this should be converted to an automation" },
  { type: "Dev", desc: "welcome email for sales people" },
  { type: "Dev", desc: "once dealer signs up, send welcome email bringing them to the page they need to fill out for the informatoin to build their site" },
  { type: "Dev", desc: "file upload in customer file - done " },
  { type: "Dev", desc: "emails in overview - done" },
  { type: "Dev", desc: "employee onboarding - done - be need to redo admin dashbaoard that deals with usrs" },
  { type: "Dev", desc: "Dealer Onboarding - done - automate creation of vercel need to get the url and save it in our database, just use the one repo once you sync it upgrades evrvyones vercel sites" },
  { type: "issue", desc: "add ping system for notes - COMPLETED BUT NEEDS TESTING" },
  { type: "issue", desc: "need to change how to load overview,   by financeId maybe save the financeId to local storage or a cookie to always have acxcess to the last one u made" },
  { type: "WIP", desc: "Dept Leaderboards" },
  { type: "WIP", desc: "finish automation dash - wip" },
  { type: "dealer onboarding", desc: "automate on boarding" },
  { type: "admin", desc: "employee onboarding" },
  { type: "issue", desc: "overview emails" },
  { type: "google", desc: "utilize other services from google, notes, to-do, sms, voice chat, call recording, video calling, teaam chat?, tasks and plans,  " }, { type: "done needs testing", desc: "API file upload will be released once google approves gmail as its still in the process right now - done needs testing" },
  { type: 'google', desc: 'has a push notiications for new incoming emails' },
  { type: "dealer onboarding", desc: "initial data can be put into seed file filed out by dealer" },
  { type: "done needs testing", desc: "roles based access - done needs testing" },
  { type: "NTBC", desc: "API Docs" }, { type: "issue", desc: "notifications" },
  { type: "sales", desc: "Demo Day Dashboard" },
  { type: "quote", desc: "Save form to LOCAL STORASGE(CHECK REMIX SITE FOR SOLUTIONp) incase something happens to connection or if they srep awway from their computer that way whenever you come back the form is filled out the way you left it" }, { type: "admin", desc: "import customers" },
  { type: "admin", desc: "import parts" }, { type: "admin", desc: "export parts" },
  { type: "admin", desc: "export acc" },
  { type: "dealer onboarding", desc: "new sales page with upgrades" },
  { type: "admin", desc: "import acc" },
  { type: "dealer onboarding", desc: "docs videos" },
  { type: "dealer onboarding", desc: "quote how-to" },
  { type: "dealer onboarding", desc: "sales dashboard how-to" },
  { type: "dealer onboarding", desc: "calendar how-to" },
  { type: "dealer onboarding", desc: "automation how-to" },
  { type: "dealer onboarding", desc: "template how-to" },
  { type: "dealer onboarding", desc: "inventory how-to" },
  { type: "dealer onboarding", desc: "document builder how-to" },
  { type: "dealer onboarding", desc: "sales process start to finsih" },
  { type: "WIP", desc: "calendar to set store hours" },
  { type: "nonUrgent", desc: "to add onto the last one - unit sold in territories, report already out there owners of dealers get them" },
  { type: "WIP", desc: "redesign subscription page to include 2 optoinns for stand alone sales people and dealers" },
  { type: "issue", desc: "move staff chat to sms messenger" },
  { type: "website sales", desc: "try out section where people can see how much quicker the process can be" },
  { type: "NTBC", desc: "Dept and General Staff Chat" },
  { type: 'google', desc: 'tasks' },
  { type: 'google', desc: 'Calendar' },
  { type: "Automation", desc: "sales person schedule for lead rotation" },
  { type: 'google', desc: 'Keep note' },
  { type: "issue", desc: "add customer on dashboard needs to be updated to be the same as on calendar" },
  { type: "sales process", desc: "update finance mgr lock so that the sales person can have a in queue timer" },
  { type: "issue", desc: "need mileage for new vehciles for printing paperwork" },
  { type: "wip - crm integration", desc: "complete first integration" },
  { type: "issue", desc: "everything google on hold - google is asking for requirments that they were never upfront about" },
  { type: "done needs testing", desc: "have all features off of the same platform/project - done needs testing" },
  { type: "Automation", desc: "have it so you can tag a customers file so when a test drive cmoes around it just reminds you to get them on  ti or on wish ist" },
  { type: "dealer onboarding", desc: "script how-to" },
  { type: "dealer onboarding", desc: "payment calc how-to" },
  { type: "issue", desc: "need to redo email templates in overview - wip move email templates to template section??? and just have a email client in its place then it would really just be three choices instead of 100 and something because it would just take whatewver payments that are saved" },
  { type: "issue", desc: "to get notified when new useed units come in for customers wish list - just generate brand / model list to choose from instead of letting them type it in" },
  { type: "paid feature", desc: "sms messenger" },
  { type: "dealer onboarding", desc: "each dealer will have their own server on vercel, own database on planetscale, and so forth find a way to automate this even though it doesnt take any time to do so" },
  { type: "quote", desc: "find source with API with up-to-date model information - Kelly Black Book - they have the product take picutre of blue ages for now and just ocr scan - just going to use dealer binders of dealers that sign up - alkmost completed" },
  { type: "issue", desc: "google auth fixed need to verify, put in root " },
  { type: "issue", desc: "email not currently working in overview" },
  { type: "issue", desc: "to get notified when new useed units come in for customers wish list" },
  { type: "issue", desc: "lien payout - COMPLETED BUT NEEDS TESTING" },
  { type: "issue", desc: "csv upload for prodcuts and inventory" },
  { type: "communications", desc: "set up whatsap for dealing with dealer customers affiliate marketers" },
  { type: "dash", desc: "dash switcher in settings to change from integration to integration or not" },
  { type: "communications", desc: "whats app integration" },
  { type: "issue", desc: "put customer coms in cuterom file not bike file - DID NOT COMPLETE REVISIT AFTER BETA " },
  { type: "notifications", desc: "push notifications - cheat way to do it in terms of cost and coding - just send a email along with the in app notfication as long as your phone is hooked up to your computer, you will get notified through your phone and computer" },
  { type: "issue", desc: "last note column" },
  { type: "issue", desc: "sms messenger" },
  { type: "issue", desc: "calendar - complete appointment" },
  { type: "issue", desc: "email refresh token use revalidateOnFocus from swr to refresh tokens https://swr.vercel.app/docs/revalidation" },
  { type: "Automation", desc: "integration with vercel app - wip" },
  { type: "user", desc: "fields to add - triggerFieldList in automations" },
  { type: "customer", desc: "add api to import new leads" },
  { type: "notifications", desc: "upcoming appt - wip" },
  { type: "quote", desc: "unit picker - once model is selected with customer=, table will render in modal with the avialble units for sale right on the quote if the customer wants to go for it" },
  { type: "notifications", desc: "instead of somweething fancy and expensive jsut use db and have it laod on each render, and have page reload afdter 10 mins or something of inactivty - wip" },
  { type: "sales process", desc: "internal IM system would help with these things, relying on the note system within the custemer files is just stupid - https://github.com/remix-run/examples/tree/main/sse-chat" },
  { type: "issue", desc: "pre populate random dealer info to start customer can always change it" },
  { type: "crm integration", desc: "inital api function" },
  { type: "crm integration", desc: "create matching records - figure out the best way to then integrate the data into our system" },
  { type: "crm integration", desc: "SyncLeadData - should we update leads from activix each time login? or refresh?" },
  { type: "issue", desc: "production enviroment with new google implmentation" },
  { type: "issue", desc: "registration" },
  { type: "calendar", desc: "render sms or email clients in claendsar appointments to take care of that right then and ther" },
  { type: "user", desc: "add 2FA" },
  { type: "issue", desc: "QUOTE/USED - wip" },
  { type: "issue", desc: "internal chat" },
  { type: "issue", desc: "notifications" },
  { type: "admin", desc: "import of lists like inventory, customers, parts, acc" },
  { type: "admin", desc: "add new users through admin protal" },
  { type: "dash", desc: "pop up to display entire conversation history non interactive because that wont work" },
  { type: "dev", desc: "project is getting to big to continue testing, need a page to automate testing" },
  { type: "issue", desc: "Calendar missing 2 of its views" },
  { type: "issue", desc: "admin add user not working properly" },
  { type: "dash", desc: "import / export customer base" },
  { type: "admin", desc: "import inventory" },
  { type: "admin", desc: "export inventory" },
  { type: "admin", desc: "import users" },
  { type: "admin", desc: "export users" },
  { type: "dash", desc: "demo day list like the wish list?" },
  { type: "dash", desc: "have a quick contact option at the top of the page where you can skip account creation to send an email or text as your typing email or phone it searches for the client file, onc esent the next page would be go to create client file or go to client file " },
  { type: "user", desc: "need heavy hitter finance manager to accommodate them for CRM" },
  { type: "quote", desc: "hook up communication counter" },
  { type: 'google', desc: 'gmail done' },
  { type: "dash", desc: "import / export inventory" },
  { type: "admin", desc: "redesign admin page" },
  { type: "dash", desc: "finance manager dash" },
  { type: "sales process", desc: "electronic handovers - when you're sitting there customer says yes let's go financing instead of clunkily or very like just not efficiently going to find the f&I if they're not in the office it's going to look for them you know bring them to folder all this garbage and then go back to the customer bring them over when they're ready instead push a buttoon so that way it immediately notifies them cuz like you know when they have customers or when they don't it's already done in the systewm, the deals already built in the system so they don't have to build it at all or anything and they could just run from there so they can either reply be there in 2 seconds or be there in 5 minutes cuz they're on a call or something like that and instead of salesperson getting up going over you know leaving the customer instead they could just be with the customer the entire time and then literally just have that right person just come up into the office and make it seem like a really tight run ship same thing with sales managers the offers that are in the office at his desk or whatever he gets a notification that this customer, your customer in front of you want to get a deal done and he wants to get an XYZ dollars he can just reply to you in the system immediately and get it done for you instead of you know let me go find find him you should never have to leave the customer and it tighters everything up as far as the process goes and the customers experience is going to be like wow these guys know what they're doing they're running a really tight ship everything's quick it's fast like they obviously know what they're doing include the ability to search the inventory on the unit u picked with the custoemr so without leaving the qquote u know its in styock with what colors" },
  { type: "sales process", desc: "to add to last item - put a non removablew modal for when client is ready to finance when at the dealer that will lock the app of the finance managers till someone clicks accept unless they are already currently in a file, need to find a way to kick them off the file after a period of inactivty to ensure they dont cheat the system" },
  { type: "client file", desc: "change checkbox section so only finance can change finance items but display once they are checked off" },
  { type: "admin", desc: "redesign admin page" },
  { type: "quote", desc: "once sold, do all the stupid stuff behind the scenes rather than having to do it multiple times when u sell a unit" },
  { type: "inventory", desc: "have inventory hooked to the quotes so the sales perosn can see in while pricing the customer you can see if its in stock and what colors are available" },
  { type: "Auto print", desc: " have AI component attached to the email client to rewrite emails if needed - huge cost wip" },
  { type: "user", desc: "statistics page based on data from dash and CRM" },
  { type: "user", desc: "for sales tracker, add up delivered and add it to sales tracker, whatever the value is now" },
  { type: "user", desc: "utilize user notifications - sns providor has this option WIP" },
  { type: "user", desc: "have dealer staff able to edit others' clients" },
  { type: "Templates", desc: "have an option on the text editor to be able to save as template on text and email so you can quickly savew it and review again later rather than praying you dont close that tab, which u do anyways" },
  { type: "dash", desc: "make an assigned to area on purchasing tab" },
  { type: "deployment", desc: "look at some github actions so when you update the main repo it would push the update to all the repos or look into vercel, have one repo for multiple deployments" },
  { type: "dash", desc: "search to find a customer placed at root WIP" },
  { type: "dash", desc: "combine customers? idk how i feel about that, would rather have the ability to 'meld' them, becoming one but with multiple units." },
  { type: "task", desc: "Hide feature buttons if unavailable" },
  { type: "task", desc: "Move feature buttons to sidebar" },
  { type: "task", desc: "See if auto email will work in sidebar" },
  { type: "user", desc: "sms" },
  { type: "user", desc: "add dealer roles - WIP" },
  { type: "external link", desc: "https://stackoverflow.com/questions/75189762/how-to-save-contact-details-from-a-website-to-an-android-or-iphone-using-html-bu" },
  { type: "text client", desc: "chatgpt integration to reply or create or edit emails on the fly with only a short description from you  - huge cost" },
  { type: "email client", desc: "chatgpt integration to reply or create or edit emails on the fly with only a short description from you  - huge cost" },
  { type: "quote", desc: "put follow-up buttons on quote as well" },
  { type: "website", desc: "change favicon based on brand" },
  { type: "dash", desc: "mass sms" },
  { type: "dash", desc: "payment calc with no ability to select a unit" },
  { type: "user", desc: "Allow users to store their own custom emails" },
  { type: "dash", desc: "lock fields on delivered" },
  { type: "dash", desc: "mass sms" },
  { type: "dash", desc: "sms" },
  { type: "user", desc: "Give the ability for people to upload their own worksheets, contracts, and such - https://pspdfkit.com/guides/web/downloads/" },
  { type: "email client", desc: "create client - like short wave, they stole my idea for it" },
  { type: "customer profile", desc: "print area on customer profile to print pre-populated paperwork" },
  { type: "email client", desc: "email client near completion - utilize other services from azure, notes, to-do, sms, voice chat, call recording, video calling, teaam chat?, tasks and plans,  " },
  { type: "dash", desc: "crm integration - along with our CRM - WIP" },
  { type: "Auto print", desc: " customer work sheets - WIP" },
  { type: "Auto print", desc: " test drive waiver - WIP" },
  { type: "Auto print", desc: " UCDA - WIP" },
  { type: "email", desc: "more scriptied emails" },
  { type: "customer profile", desc: "implement DocuSign" },
  { type: "user", desc: "send email to salesperson when someone else enters yellow or red notes" },
  { type: "calendar", desc: "service cal" },
  { type: "calendar", desc: "parts cal" },
  { type: "calendar", desc: "sales manager" },
  { type: "calendar", desc: "finance manager" },
  { type: "client", desc: "implement server to accommodate automation" },
  { type: "dash", desc: "record and show all previous interaction" },
  { type: "dash", desc: "have drop down for notes with ones you use most i.e. was supposed to come in, followed up, no answer so speed up follow up reschedule" },
  { type: "dash", desc: "calendar" },
  { type: "user", desc: "Microsoft Outlook has an API for email, can make your own mail page in the app, along with calendar and Todo. Check other services from Microsoft" },
  { type: "dash", desc: "look at making table from scratch, would alleviate all the problems you're having, and allow for more customization" },
  { type: "dash", desc: "check this out for a table alternative - https://github.com/bvaughn/react-virtualized" },
  { type: "dash", desc: "for advanced filtering - https://www.youtube.com/watch?v=MY6ZZIn93V8" },
  { type: "dash", desc: "date range filter for calls" },
  { type: "dash", desc: "different tables for different views, i.e., sold, not delivered, pending" },
  { type: "dash", desc: "under settings have a table that displays delivered and to be delivered" },
  { type: "dash", desc: "save current filter/sort to cookie so it doesn't interrupt your workflow" },
  { type: "dash", desc: "implement a way to show reached till phone service is working" },
  { type: "dash", desc: "filter per column" },
  { type: "quote", desc: "along with DocuSign, digitize any other docs for a smoother paperwork process" },
  { type: "user", desc: "allow users to opt out of 2-day auto follow-up" },
  { type: "dash", desc: "Texting is broken in scripts" },
  { type: "auto email", desc: "customer set time after delivery thanking them and asking for referrals" },
  { type: "auto email", desc: "finance - reminders to clients if missing anything from finance or sales" },
  { type: "task", desc: "Put a copy text button for each script" },
  { type: "user", desc: "Take off contact and script upload since it's in the menu now" },
  { type: "dash", desc: "instead of sorting the table to see what deliveries are, have a 3-day rolling list, one less thing to sort on the table, the same in-person appt, not follow-up calls" },
  { type: "quote", desc: "apt list breakdown on profile with delete and edit options" },
  { type: "dash", desc: "change filter input to dropdown based on column selection" },
  { type: "dash", desc: "have it on top of the dashboard so it displays every morning and you can select a button to hide so you never forget about deliveries" },
  { type: "dash", desc: "change filter input to dropdown based on column selection" },
  { type: "task", desc: "API file upload does not work in production folder API is already in use by platform Procidor move API/file upload to dealerapi/fileupload" },
  { type: "task", desc: "Cookies for user preferences" },
  { type: "task", desc: "Cookies for user preferences" },
  { type: "dash", desc: "have the dash just be able to send texts and call, have the messenger somewhere else" },
  { type: "dash", desc: "make full CRM - once done with the original app - WIP" },
  { type: "user", desc: "instant messenger - to not use LoaderData, that god-awful messenger anymore - started but didn't work out" },
  { type: "user", desc: "phone working but not on a wide scale" },
  { type: "quote", desc: "finish customer profile with all functionality" },
  { type: "dash", desc: "document upload section on dash for each customer" },
  { type: "user", desc: "allow the user to set the default follow-up day" },
  { type: "task", desc: "have the last note on the dashboard, have notes on customer page / return to quote button" },
  { type: "task", desc: "fix attachment to customer notes" },
  { type: "task", desc: "complete dash with full functionality" },
  { type: "task", desc: "Cookies for user preferences" },
  { type: "task", desc: "add attachment to customer notes" },
  { type: "task", desc: "add reset password" },
  { type: "task", desc: "automatically complete call when emailing from dashboard" },
  { type: "task", desc: "add customer button to dash to quickly add customers" },
  { type: "task", desc: "update state automatically based on what's chosen from the client card" },
  { type: "task", desc: "just building a CRM - save customers and their vehicle sheets? Uploading to CRM should be good enough. The whole point is not to be a CRM and just help salespeople with speed. By pushing the data to the CRM immediately, there's no point to save it maybe. Have the user only ever update the database so it only has one entry, while keeping access to their quote in profile, show last and all the details" },
  { type: "task", desc: "settings menu to set variables per salesperson" },
  { type: "task", desc: "admin dashboard? - started" },
  { type: "task", desc: "Instant print cash contacts" },
  { type: "task", desc: "redesign checkbox" },
  { type: "task", desc: "new navbar" },
  { type: "task", desc: "backend" },
  { type: "task", desc: "logos" },
  { type: "task", desc: "auto payments calc" },
  { type: "task", desc: "auto print spec sheet without visiting any site" },
  { type: "task", desc: "page for every brand that we have information on" },
  { type: "task", desc: "hidden discount inputs - one for $ amount, another for %" },
  { type: "task", desc: "second print button so it prints the spec sheet of the model the customer is looking at, so you can give it to the customer without having to dig through the ones you already downloaded or go through 16 web pages on Can-Am's website to get to it - completed Kidoo, Can-Am - partial, Manitou, Switch, Sea-Doo" },
  { type: "task", desc: "query website by stock number to see if it's in stock - not feasible across so many dealers" },
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
                      {Object.entries(organizedTasks).map(([type, tasks]) => (
                        <div key={type}>
                          <h4 className='mt-3 ml-3 text-picton-blue-50'>{type}</h4>
                          <Separator />
                          {tasks.map((task) => (
                            <div key={task.desc} className="ml-3 p-3 flex items-center  mt-3 shadow-md  bg-myColor-900 target:text-primary hover:text-primary text-slate4 active:bg-primary  text-md uppercase  rounded  hover:shadow-md outline-none  ease-linear transition-all duration-150">
                              <p color="my-3  ">
                                {task.desc}
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
                          {tasks.map((task) => (
                            <div key={task.desc} className="ml-3 mr-3 p-3 flex items-center  mt-3 shadow-md  bg-myColor-900 target:text-primary hover:text-primary text-slate4 active:bg-primary  uppercase text-sm  rounded  hover:shadow-md outline-none  ease-linear transition-all duration-150">
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

