import { json, type LoaderFunction, type ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigation } from '@remix-run/react'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent, CardDescription, Separator, CardFooter, Label, Input, } from '~/components';
import { ButtonLoading } from "~/components/ui/button-loading";
import { prisma } from "~/libs";
import { toast } from "sonner"
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Target } from 'lucide-react';

import { useState } from 'react';
import { DealerOnboarding } from './emails/dealerOnboarding';
import { Resend } from "resend";


// NEED PRO VERCEL ACCOPUNT FOR THIS TO WORK NOT TESTED YET BUT DOCS SUGGEST YOU CANNOT USE UR PERSONAL HOBBY ACCOUNT
//const vercelToken = process.env.BLOB_READ_WRITE_TOKEN;


const completed = [
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
  { board: "dev", column: "quote", item: "unit picker - once model is selected with customer=, table will render in modal with the avialble units for sale right on the quote if the customer wants to go for it" },
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
  { board: "dev", column: "sales process", item: "electronic handovers - when you're sitting there customer says yes let's go financing instead of clunkily or very like just not efficiently going to find the f&I if they're not in the office it's going to look for them you know bring them to folder all this garbage and then go back to the customer bring them over when they're ready instead push a buttoon so that way it immediately notifies them cuz like you know when they have customers or when they don't it's already done in the systewm, the deals already built in the system so they don't have to build it at all or anything and they could just run from there so they can either reply be there in 2 seconds or be there in 5 minutes cuz they're on a call or something like that and instead of salesperson getting up going over you know leaving the customer instead they could just be with the customer the entire time and then literally just have that right person just come up into the office and make it seem like a really tight run ship same thing with sales managers the offers that are in the office at his desk or whatever he gets a notification that this customer, your customer in front of you want to get a deal done and he wants to get an XYZ dollars he can just reply to you in the system immediately and get it done for you instead of you know let me go find find him you should never have to leave the customer and it tighters everything up as far as the process goes and the customers experience is going to be like wow these guys know what they're doing they're running a really tight ship everything's quick it's fast like they obviously know what they're doing include the ability to search the inventory on the unit u picked with the custoemr so without leaving the qquote u know its in styock with what colors" },
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
  { board: "dev", column: "GET DONE NOW", item: "need to swap out for financeUnit/tradeunit from just finance in schema" },

  { board: "dev", column: "GET DONE NOW", item: "use swr with auto revalidation for workorders so it updates in real time to get rid of the issue of 1 work order only open, set to fast on work orders for service writers but slow on tech's page" },

  { board: "dev", column: "GET DONE NOW", item: "end of day reports, choose date so you can print any day" },

  { board: "dev", column: "GET DONE NOW", item: "saving doc templates, see if you can save big json strings in database- this produces a problem of linking the database data to the end points on the persons template you either have to input each manually or have a legend where they click the data point they want and it copies the actual database value and they paste it into the value on the template" },

  { board: "dev", column: "GET DONE NOW", item: "order dash, same as inventory count but you go around scanning items and slecting a quantity to purchase in managers dash" },

  { board: "dev", column: "GET DONE NOW", item: "create the 'wall', a table of just stats and stats not for everyone but try to break everything down" },


]
const BACKBURNER = [
  { board: "dev", column: "BACKBURNER", item: "set up more parts pages - started - Manitou done - switch started" },
  { board: "dev", column: "BACKBURNER", item: "payment processor for purchases?" },
  { board: "dev", column: "BACKBURNER", item: "have it populate api keys so managers can hand them out" },
  { board: "dev", column: "BACKBURNER", item: "cross platform ad manager, post it once here and push it to different providors" },
]
const issue = [
  { board: "dev", column: "ISSUE", item: "man / imprt exprort test import and putmore exports and fix exports since we changed db" },
  { board: "dev", column: "ISSUE", item: "user docs instead of having a doc section have button where it brings them to utube video to teach them about page" },
  { board: "dev", column: "ISSUE", item: "man / dash fix sales stats section and finish page... just redo the leadersboard section in manager menu x sales people and have a section of all open contracts and have filters on the table to easily search for customers with refunds, certain amount of time not contacted etc tabs have dash like sales person then have a tab for each  sales person and their stats" },
  { board: "dev", column: "ISSUE", item: "FIX ADMIN AND MANAGER SECTIONS" },
]
const doneneedstesting = [
  { board: "dev", column: "DONE NEEDS TESTING", item: "use same system as notifications to check on new mail - USE SWR" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "webhook for incoming emails, save notifiation and messeages" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "mass sms - wip" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "email" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "sms" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "invite user section where it send an email with links to the crm and" },
  { board: "dev", column: "DONE NEEDS TESTING", item: "implement server to accommodate automation https://github.com/Saicharan0662/email-scheduler-client" },
]
const WIP = [

  { board: "dev", column: "WIP", item: "have your own csi reporting for the dealer that can be sent to customers JUST NEED TO MAKE MOCK EMAIL FOR IT" },
  { board: "dev", column: "WIP", item: "implement server to accommodate automation https://github.com/Saicharan0662/email-scheduler-client" },
  { board: "dev", column: "WIP", item: "mass email/sms - wip" },
  { board: "dev", column: "WIP", item: "https://developers.klaviyo.com/en/reference/get_campaigns" },
]
const ideas = [
  { board: "dev", column: "IDEAS", item: "save form to local storage, never loose data for a internet hiccup or outage" },
  { board: "dev", column: "IDEAS", item: "have blue book values on quote section" },
  { board: "dev", column: "IDEAS", item: "idea for a chart current contact time, 1 day 7 days 14 days 30 days 60 days 90 days" },
]
const sales = [
  { board: "dev", column: "SALES", item: "make a bill of sale where it prints the items off of acc and parts orders - KIND OF ALREADY DONE BY PUSHING ACC TOTAL TO BOS BUT DOES NOT ITEMIZE ITEMS" },
  { board: "dev", column: "SALES", item: "have it so if you sdelect clientfile it just goes to client file and then you can select a unit if you want to but it displays orders, and work orders under clients name not under a unit bought there" },
  { board: "dev", column: "SALES", item: "finance section in finance file, have it where it can be switch to manual mode only where there are no calculations being done" },
  { board: "dev", column: "SALES", item: "finish className={${isCompleted ? bg-[#30A46C]: bg-primary} in finance file" },
  { board: "dev", column: "SALES", item: "Call center Section" },
  { board: "dev", column: "SALES", item: "sales bot - take care of some of the sales process - uses natural language processing and machine learning to assist in automated contract negotiations based on predefined parameters." },
  { board: "dev", column: "SALES", item: "sales bot 2 - customer onboarding" },
  { board: "dev", column: "SALES", item: "sales bot 3 - after sales" },
]
const automation = [
  { board: "dev", column: "AUTOMATION", item: "customer set time before delivery of what to bring" },
  { board: "dev", column: "AUTOMATION", item: "auto email at 5, 2.5 months and 30, 7 days before consent expires, 2 years if bought, 6 months if not" },
  { board: "dev", column: "AUTOMATION", item: "customer 2 months after pick up to make sure everything is still good" },
]
const service = [
  { board: "dev", column: "service", item: "tech should just be aqble to look at his agenda and know what hes doing for the day, he should have access to all the information he needs from his terminal without having to go find anyone and bug them about it and no more paperwork" },
  { board: "dev", column: "service", item: "service writer dash" },
  { board: "dev", column: "service", item: "tech dash" },
  { board: "dev", column: "service", item: "scan incoming crates and add them into inventory or something, maybe a inbox for the admin to convert them to inventory" },
]
const docs = [
  { board: "dev", column: "docs", item: "Videos for docs" },
  { board: "dev", column: "docs", item: "scripts / templates" },
  { board: "dev", column: "docs", item: "whole overview" },
  { board: "dev", column: "docs", item: "quotes" },
  { board: "dev", column: "docs", item: "dashboard" },
  { board: "dev", column: "docs", item: "finance dashboard" },
  { board: "dev", column: "docs", item: "user settings" },
  { board: "dev", column: "docs", item: "document builder" },
]
const owner = [
  { board: "dev", column: "OWNER", item: "Owners dashboard" },
  { board: "dev", column: "OWNER", item: "Owner Section" },
]
const quote = [
  { board: "dev", column: "quote", item: "set up more parts pages - started - Manitou done - switch started" },
]
const parts = [
  { board: "dev", column: "parts", item: "parts dash" },
  { board: "dev", column: "parts", item: "shpping and receiving dash" },
  { board: "dev", column: "parts", item: "parts specfic page to print label, make changes etc, have search table that switch from table to part view using use state like the one in newleads" },
]
const accessories = [
  { board: "dev", column: "accessories", item: "acc dash" },
]
const manager = [
  { board: "dev", column: "MANAGER", item: "have all managers stuff within managers so dashboard would have sales, acc, parts, and service" },
  { board: "dev", column: "MANAGER", item: "manager / dash fix sales stats section and finish page... just redo the leadersboard section in manager menu x sales people and have a section of all open contracts and have filters on the table to easily search for customers with refunds, certain amount of time not contacted etc tabs have dash like sales person then have a tab for each  sales person and their stats" },
]
const admin = [
  { board: "dev", column: "admin", item: "have it populate api keys so managers can hand them out" },
  { board: "dev", column: "admin", item: "for making admin dash, go custom try to replicate sales dash but go all out... here you can even do context menu's aand everything, tab it by clientfile, finance, acc order, workorder, sales and in sales quickly sort by sales person by month user filters like u used in receivng" },
]
const dealerOnboarding = [
  { board: "dev", column: "DEALER ONBOARDING", item: "free simple install with insructions, fee for total install - for dealer that already have an it team it would save them money" },
]
const infastructure = [
  { board: "dev", column: "INFASTRUCTURE", item: "set up dummy dealer site, with all the needed data to fill everything, 5 customers or so with orders and units in the system this would give you a production enviroment to test and give you the ability to give out test accounts for people to try - this could also be - set up demo site where, sign in is just inputing the email like technician@email.com and theyre logged in as the tech, or service writer and etc" },
  { board: "dev", column: "INFASTRUCTURE", item: "cell phone site versions for product ordering, unit inventory intake for service writers/managers to quickly take in unit orders, service quoting, search for products, search for units, orders so employees can work on them on the go, in the back getting items or on with customers on floor and as soon they are ready to buy they can just hit print receipt and collect the money instead of waiting for a till if there is none" },
  { board: "dev", column: "INFASTRUCTURE", item: "have a second non-cloud option, either as a rack for a server or tower for a non tech orientated dealer to be hosted on site but would need a license key that needs a new token every 30 days/6 months/12 months to operate based on payment plan, hardware to be paid upfront before build, payments start once activated at dealer" },
]
const dash = [
  { board: "dev", column: "dash", item: "dynamic dashboard widgets" },
]
const communications = [
  { board: "dev", column: "communications", item: "email / sms campaigns" },
  { board: "dev", column: "communications", item: "fb msgr integration" },

]
const paidfeature = [
  { board: "dev", column: "PAID FEATURE - ai", item: "predictive analysis of sales trends" },
  { board: "dev", column: "PAID FEATURE - ai", item: "customter analysis, retention, customer $ worth, visits, and more" },
  { board: "dev", column: "PAID FEATURE - ai", item: "Predictive Customer Behavior Modeling, Utilize advanced machine learning models to predict future customer behaviors and preferences based on historical data. ie percentages on how liuekly the customer can be closed if asked at that time" },
  { board: "dev", column: "PAID FEATURE - ai", item: "*** currently working - need to attach to components and find a way to turn on or off pending payment by customer ***" },
  { board: "dev", column: "PAID FEATURE - ai", item: "speech to text for quicker input - done in components folder" },
  { board: "dev", column: "PAID FEATURE - ai", item: "AI writing partner for emails, templates and scripts - done in components folder" },
  { board: "dev", column: 'PAID FEATURE - ai', item: 'have ai take in last 5 emails with customer and suggest your next communication/script - not done yet but easy enough to complete in components folder' },
  { board: "dev", column: 'PAID FEATURE - ai', item: 'vercel has a nice write up on this to do in their platform - ai - wip - https://github.com/steven-tey/chathn/blob/main/app/api/chat/route.ts' },
  { board: "dev", column: "PAID FEATURE - ai", item: "Ai assistant to book apointments, complete and etc like gowrench or just a work flow to customers to guide themselves" },
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


export async function action({ request, }: ActionFunctionArgs) {
  const formPayload = Object.fromEntries(await request.formData())
  let formData = financeFormSchema.parse(formPayload)
  const resend = new Resend(process.env.resend_API_KEY);

  const intent = formPayload.intent
  const dealerName = formPayload.dealerName
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  const envVar = [
    {
      key: 'DEALER_NAME',
      target: 'production',
      type: 'system',
      value: dealerName
    },
    {
      key: 'REMIX_DEV_EMAIL',
      target: 'production',
      type: 'system',
      value: "skylerzanth@outlook.com"
    },
    {
      key: 'REMIX_ADMIN_EMAIL',
      target: 'production',
      type: 'system',
      value: formPayload.dealerEmailAdmin,
    },
    {

      key: 'MICRO_APP_ID',
      target: 'production',
      type: 'system',
      value: `0fa1346a-ab27-4b54-bffd-e76e9882fcfe`,
    },
    {
      key: 'MICRO_TENANT_ID',
      target: 'production',
      type: 'system',
      value: `fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6`,
    },
    {
      key: 'MICRO_CLIENT_SECRET',
      target: 'production',
      type: 'system',
      value: `rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D`,
    },
    {
      key: 'CLIENT_ID',
      target: 'production',
      type: 'system',
      value: `0fa1346a-ab27-4b54-bffd-e76e9882fcfe`,
    },
    {
      key: 'TENANT_ID',
      target: 'production',
      type: 'system',
      value: `fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6`,
    },
    {
      key: 'CLIENT_SECRET',
      target: 'production',
      type: 'system',
      value: `rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D`,
    },
    {
      key: 'REMIX_SESSION_SECRET',
      target: 'production',
      type: 'system',
      value: '3847ad8f0be06852c4b92b030fe1efe3',
    },
    {
      key: 'REMIX_ADMIN_EMAIL',
      target: 'production',
      type: 'system',
      value: 'skylerzanth@outlook.com',
    },
    {
      key: 'REMIX_ADMIN_PASSWORD',
      target: 'production',
      type: 'system',
      value: 'Ch3w8acca66',
    },
    {
      key: 'COOKIE_SECRET',
      target: 'production',
      type: 'system',
      value: 'cookiesecret_sauce66',
    },
    {
      key: 'REMIX_APP_NAME',
      target: 'production',
      type: 'system',
      value: 'dealersalesassistant',
    },
    {
      key: 'DATABASE_URL',
      target: 'production',
      type: 'system',
      value: 'postgres://default:Ub6EtAvk5jqV@ep-cool-wood-a44zvgt4-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require',
    },
    {
      key: 'STRIPE_SECRET_KEY',
      target: 'production',
      type: 'system',
      value: 'sk_live_pNtrt5zYNjHQtYrSrINfKyAJ',
    },
    {
      key: 'API_ACTIVIX',
      target: 'production',
      type: 'system',
      value: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk',
    },
  ]
  const createFirstVercel = async (newDealerRepoName) => {
    const data = {
      name: "freedomHD",
      environmentVariables: envVar,
      framework: "remix",
      gitRepository: {
        type: "github",
        repo: '8an3/thesalespersonscrmm',
      },
    }
    const res = await fetch(
      "https://api.vercel.com/v9/projects?teamId=team_wZNR5xSfpymdzh4R3rMBzz9V",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`
        },
        body: JSON.stringify(data)
      }
    );
    const project = await res.json();
    console.log('Project created successfully:', project.data);

    return ({ project })

  };
  if (intent === 'sendInitialEmail') {
    const email = await resend.emails.send({
      from: "Admin <admin@resend.dev>",//`${user?.name} <${user?.email}>`,
      reply_to: 'skylerzanth@gmail.com',
      to: [dealer.dealerContact, dealer.dealerEmailAdmin],
      subject: `Welcome to the DSA team, ${dealer.dealerName}.`,
      react: <DealerOnboarding dealer={dealer} />
    });
    const dealer = await prisma.dealer.create({
      where: { id: formData.dealerId },
      data: { sentWelcomeEmail: 'true', }
    })
    return json({ email })
  }

  if (intent === 'createDealer') {
    //const createFirstFirst = await createFirstVercel(dealerName)
    // console.log(createFirstFirst)
    //await delay(50);
    // const createSecondSecond = await createSecondVercel(dealerName)
    /// console.log(createSecondSecond)
    // console.log(dealerName)
    const dealer = await prisma.dealer.create({
      data: {
        dealerName: formData.dealerName,
        dealerAddress: formData.dealerAddress,
        dealerCity: formData.dealerCity,
        dealerProv: formData.dealerProv,
        dealerPostal: formData.dealerPostal,
        dealerPhone: formData.dealerPhone,
        dealerEmail: formData.dealerEmail,
        dealerContact: formData.dealerContact,
        dealerAdminContact: formData.dealerAdminContact,
        dealerEmailAdmin: formData.dealerEmailAdmin,
        dealerEtransferEmail: formData.dealerEtransferEmail,
        vercel: formData.vercel,
        github: formData.github,
        sentWelcomeEmail: 'true',
      }
    })
    const email = await resend.emails.send({
      from: "Admin <admin@resend.dev>",//`${user?.name} <${user?.email}>`,
      reply_to: 'skylerzanth@gmail.com',
      to: [dealer.dealerContact, dealer.dealerEmailAdmin],
      subject: `Welcome to the DSA team, ${dealer.dealerName}.`,
      react: <DealerOnboarding dealer={dealer} />
    });
    return json({ dealer, email })
  }
  if (intent === 'createLead') {
    const data = {
      email: 'skylerzanth@outlook.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123-456-7890',
      name: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      postal: 'A1B 2C3',
      province: 'Ontario',
      dl: 'D1234567',
      typeOfContact: 'email',
      timeToContact: 'Morning',
      iRate: '5.5',
      months: '60',
      discount: '1000',
      total: '25000',
      onTax: '3000',
      on60: '24000',
      biweekly: '300',
      weekly: '150',
      weeklyOth: '145',
      biweekOth: '295',
      oth60: '23500',
      weeklyqc: '148',
      biweeklyqc: '298',
      qc60: '23600',
      deposit: '2000',
      biweeklNatWOptions: '310',
      weeklylNatWOptions: '155',
      nat60WOptions: '24500',
      weeklyOthWOptions: '150',
      biweekOthWOptions: '300',
      oth60WOptions: '24000',
      biweeklNat: '305',
      weeklylNat: '152',
      nat60: '24200',
      qcTax: '2500',
      otherTax: '2600',
      totalWithOptions: '26000',
      otherTaxWithOptions: '2700',
      desiredPayments: '280',
      freight: '1200',
      admin: '300',
      commodity: '500',
      pdi: '200',
      discountPer: '4',
      // userLoanProt: null,
      userTireandRim: 'yes',
      // userGap: 'yes',
      userExtWarr: 'yes',
      // userServicespkg: 'yes',
      //deliveryCharge: '100',
      // vinE: '1HGCM82633A123456',
      //lifeDisability: 'no',
      // rustProofing: 'yes',
      //   userOther: 'no',
      paintPrem: 'yes',
      licensing: '150',
      stockNum: 'S12345',
      options: 'Sunroof, Leather Seats',
      //  accessories: 'Floor Mats',
      labour: '100',
      year: '2023',
      brand: 'Toyota',
      model: 'Camry',
      model1: 'SE',
      color: 'Blue',
      modelCode: 'CAMSE23',
      msrp: '27000',
      tradeValue: '5000',
      tradeDesc: '2015 Honda Civic',
      tradeColor: 'Red',
      tradeYear: '2015',
      tradeMake: 'Honda',
      tradeVin: '2HGFG12685H123456',
      tradeTrim: 'EX',
      tradeMileage: '60000',
      trim: 'SE',
      vin: '1HGCM82633A123456',
      lien: 'None',
      lastContact: '2024-05-28T15:59:02.192Z',
      nextAppointment: '2024-06-01T10:00:00.000Z',
      referral: 'off',
      visited: 'off',
      bookedApt: 'off',
      aptShowed: 'off',
      aptNoShowed: 'off',
      testDrive: 'off',
      metService: 'off',
      metManager: 'off',
      metParts: 'off',
      sold: 'off',
      depositMade: 'off',
      refund: 'off',
      turnOver: 'off',
      financeApp: 'off',
      approved: 'off',
      signed: 'off',
      pickUpSet: 'off',
      demoed: 'off',
      delivered: 'off',
      notes: 'off',
      metSalesperson: 'off',
      metFinance: 'off',
      financeApplication: 'off',
      pickUpTime: 'off',
      depositTakenDate: 'off',
      docsSigned: 'off',
      tradeRepairs: 'off',
      seenTrade: 'off',
      lastNote: 'off',
      dLCopy: 'off',
      insCopy: 'off',
      testDrForm: 'off',
      voidChq: 'off',
      loanOther: 'off',
      signBill: 'off',
      ucda: 'off',
      tradeInsp: 'off',
      customerWS: 'off',
      otherDocs: 'off',
      urgentFinanceNote: 'off',
      funded: 'off',
      status: 'Active',
      result: 'Approved',
      customerState: 'New',
      timesContacted: '3',
      followUpDay: '2024-06-10',
      deliveredDate: '2024-06-15',
      pickUpDate: '2024-06-15'
    };

    const createLead = await fetch('http://localhost:3000/dealer/leads/inbound/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    return json({ createLead })
  }
  return null
}
/**  const createSecondVercel = async (newDealerRepoName) => {
    const data = {
      name: "freedomHD",
      environmentVariables: envVar,
      framework: "remix",
      gitRepository: {
        type: "github",
        repo: '8an3/crmsat',
      },
    }
    const res = await fetch(
      "https://api.vercel.com/v9/projects",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`
        },
        body: JSON.stringify(data)
      }
    );
    const project = await res.json();
    delay(100)

    const deployRes = await fetch(
      "https://api.vercel.com/v13/deployments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`
        },
        body: JSON.stringify({
          "gitSource": {
            "ref": "main",
            "repoId": '8an3/thesalespersonscrmm',
            "type": "github"
          },
          "name": "freedomHD",
          "projectSettings": {
            "framework": data.framework
          }
        })
      }
    )

    return ({ project, deployRes })
  } */
export async function loader() {
  return null
}

export default function DashboardPage() {
  const navigation = useNavigation();
  const fetcher = useFetcher()
  const isSubmitting = navigation.state === "submitting";
  const organizedTasks = {};
  const [selectedDealer, setSelectedDealer] = useState()

  roadMapItems.forEach((item) => {
    if (!organizedTasks[item.type]) {
      organizedTasks[item.type] = [];
    }
    organizedTasks[item.type].push(item);
  });

  const devTasks = {};
  roadMapItems.getDoneNow.forEach((item) => {
    if (!devTasks[item.type]) {
      devTasks[item.type] = [];
    }
    devTasks[item.type].push(item);
  });


  const dealerList = [
    {
      id: "1",
      dealerName: "Motorcycle World",
      dealerAddress: "1234 st",
      dealerCity: "motocity",
      dealerProv: "ON",
      dealerPostal: "k1k1k1",
      dealerPhone: "6136136134",
      dealerContact: "Mr moto",
      dealerEmail: "moto@moto.com",
      adminContact: "mr Admin",
      dealerEmailAdmin: "admin@moto.com",
      vercel: "verceladdress.com",
      github: "githubaddress.com",
      database: 'databaseurl',
      sentWelcomeEmail: "no",
    }
  ]

  return (
    <>
      <div className="hidden flex-col md:flex text-foreground">
        <div className="flex-1 space-y-4 p-8 pt-6mt-3 ">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="Dealers"  >
                Dealers
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
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Dealers
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      Total Salespeople
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-2 border border-border ">
                  <CardHeader>
                    <CardTitle className='text-foreground'>Add New Dealer</CardTitle>
                    <p>First need to create the github and vercel pages for the dealer in order to put them in and be sent in the email.</p>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="space-y-6">
                      <Separator />
                      <div className="ml-5  h-auto max-h-[60vh] overflow-y-scroll">
                        <Form method='post' className="space-y-4">
                          <div className="grid gap-3 mx-3 mb-3">
                            <div className="relative mt-3">
                              <Input
                                name='dealerName'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Name</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerPhone'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Phone</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerAddress'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Address</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerCity'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer City</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerProvince'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Province</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerPostal'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Postal Code</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerContact'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Contact</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerEmail'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Email</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerAdminContact'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Admin Contact</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerEmailAdmin'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Admin Email</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='dealerEtransferEmail'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Etransfer Email</label>
                            </div>

                            <div className="relative mt-3">
                              <Input
                                name='vercel'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Vercel Domain</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                name='github'
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Github Domain</label>
                            </div>
                          </div>
                          <div className='grid grid-cols-2 justify-between' >
                            <div></div>
                            <ButtonLoading
                              size="sm"
                              value='createDealer'
                              className="bg-primary ml-auto w-auto cursor-pointer mt-5   text-foreground border border-border"
                              name="intent"
                              type="submit"
                              isSubmitting={isSubmitting}
                              onClick={() => toast.success(`Dealer added!`)}
                              loadingText="Adding new dealer..."
                            >
                              Add
                            </ButtonLoading>
                          </div>

                        </Form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-2 border border-border text-foreground">
                  <CardHeader>
                    <CardTitle>Dev Eyes Only To-do List</CardTitle>
                    <CardDescription>
                      What needs to get dont in order for this to be useable
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className=' h-auto max-h-[60vh] overflow-y-scroll'>
                      {Object.entries(devTasks).map(([type, tasks]) => (
                        <div key={type}>
                          {tasks.map((task) => (
                            <div key={task.desc} className="ml-3 p-3 mr-3 flex items-center  mt-3 shadow-md border border-border text-foreground  rounded ">
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
                <Card className="col-span-3 border border-border text-foreground">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex">
                      To-do
                      <Target color="#ff0000" className='text-2xl ml-2  ' />
                    </CardTitle>

                  </CardHeader>
                  <CardContent>
                    <div className=' h-auto max-h-[65vh] overflow-y-scroll'>
                      {Object.entries(organizedTasks).map(([column, tasks]) => (
                        <div key={column}>
                          <h4 className='mt-3 ml-3 text-picton-blue-50'>{column}</h4>
                          <Separator />
                          {tasks.map((task) => (
                            <div key={task.desc} className="ml-3 p-3 mr-3 flex items-center  mt-3 shadow-md border border-border text-foreground  rounded-lg">
                              <p color="my-3  ">
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
            <TabsContent value="Dealers" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Github Setup?
                    </CardTitle>

                  </CardHeader>
                  <CardContent>

                    <p className="text-xs text-muted-foreground">
                      {selectedDealer && (
                        <p>
                          {selectedDealer.github}
                        </p>
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Vercel Setup?
                    </CardTitle>

                  </CardHeader>
                  <CardContent>

                    <p className="text-xs text-muted-foreground">
                      {selectedDealer && (
                        <p>
                          {selectedDealer.vercel}
                        </p>
                      )}
                    </p>

                  </CardContent>
                </Card>
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Database Setup?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>

                    <p className="text-xs text-muted-foreground">
                      {selectedDealer && (
                        <p>
                          {selectedDealer.database}
                        </p>
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-border text-foreground'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Initial email sent to dealer principal?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>

                    <p className="text-xs text-muted-foreground">
                      {selectedDealer && selectedDealer.sentWelcomeEmail !== 'true' ? (
                        <>
                          <Form method='post' className="space-y-4">
                            <input type='hidden' name='dealerId' defaultValue={selectedDealer.id} />
                            <ButtonLoading
                              size="sm"
                              value='sendInitialEmail'
                              className="bg-primary ml-auto w-auto cursor-pointer mt-5   text-foreground border border-border"
                              name="intent"
                              type="submit"
                              isSubmitting={isSubmitting}
                              onClick={() => toast.success(`Dealer sent initial email!`)}
                              loadingText="Dealer sent initial email!"
                            >
                              Save
                            </ButtonLoading>
                          </Form>
                        </>

                      ) : (
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                          className=" w-4 "
                          alt="Logo"
                        />
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-2 border border-border ">
                  <CardHeader>
                    <CardTitle className='text-foreground'>Dealers</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className=' h-auto max-h-[60vh] overflow-y-scroll'>

                      {dealerList.map((dealer) => (
                        <Button type='submit' variant='ghost' className='text-left mb-4'
                          onClick={() => {
                            setSelectedDealer(dealer)
                          }}>
                          <input type='hidden' name='id' value={dealer.id} />
                          <div className="cursor-pointer hover:bg-muted/50 rounded-md">
                            <ul className="grid gap-3 text-sm mt-2">
                              <li className="grid grid-cols-1 items-center">
                                <span>{dealer.dealerName}</span>
                                <span className="text-muted-foreground text-xs">{dealer.dealerPhone}</span>
                                <span className="text-muted-foreground text-xs">
                                  {dealer.dealerEmail}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </Button>
                      ))}
                    </div>

                  </CardContent>
                </Card>
                <Card className="col-span-2 border border-border text-foreground">
                  <CardHeader>
                    <CardTitle>Dealer Details</CardTitle>
                    <CardDescription>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedDealer && (
                      <div className="space-y-6">
                        <Separator />
                        <div className="mx-auto">
                          <Form method='post' className="space-y-4">
                            <div className="grid gap-3 mx-3 mb-3">
                              <div className="relative ">
                                <Input
                                  name='dealerName'
                                  defaultValue={selectedDealer.dealerName}

                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Name</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerPhone'
                                  defaultValue={selectedDealer.dealerPhone}

                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Phone</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerAddress'
                                  type="text"
                                  defaultValue={selectedDealer.dealerAddress}

                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Address</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerCity'
                                  type="text"
                                  defaultValue={selectedDealer.dealerCity}

                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer City</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerProvince'
                                  defaultValue={selectedDealer.dealerProv}

                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Province</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerPostal'
                                  type="text"
                                  defaultValue={selectedDealer.dealerPostal}

                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Postal Code</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerContact'
                                  type="text"
                                  defaultValue={selectedDealer.dealerContact}

                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Contact</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerEmail'
                                  type="text"
                                  defaultValue={selectedDealer.dealerEmail}

                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Email</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='adminContact'
                                  type="text"
                                  defaultValue={selectedDealer.adminContact}

                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Admin Contact</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='dealerEmailAdmin'
                                  type="text"
                                  defaultValue={selectedDealer.dealerEmailAdmin}

                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Admin Email</label>
                              </div>

                              <div className="relative mt-3">
                                <Input
                                  name='vercel'
                                  defaultValue={selectedDealer.vercel}

                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Vercel Domain</label>
                              </div>

                              <div className="relative mt-3">
                                <Input
                                  name='github'
                                  defaultValue={selectedDealer.github}
                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Github Domain</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name='github'
                                  defaultValue={selectedDealer.database}
                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Database URL</label>
                              </div>
                            </div>
                            <div className='grid grid-cols-2 justify-between' >
                              <div></div>
                              <ButtonLoading
                                size="sm"
                                value='createDealer'
                                className="bg-primary ml-auto w-auto cursor-pointer mt-5   text-foreground border border-border"
                                name="intent"
                                type="submit"
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Dealer saved!`)}
                                loadingText="Saved dealer details..."
                              >
                                Save
                              </ButtonLoading>
                            </div>

                          </Form>
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
                <Card className="col-span-3 border border-border text-foreground">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex">
                      Running proccesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3 text-sm mt-2">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Vercel running?
                        </span>
                        <span>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                            className=" w-4 "
                            alt="Logo"
                          />
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Github issues?
                        </span>
                        <span>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                            className=" w-4 "
                            alt="Logo"
                          />
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Database issues?
                        </span>
                        <span>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                            className=" w-4 "
                            alt="Logo"
                          />
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Payments up to date?
                        </span>
                        <span>
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                            className=" w-4 "
                            alt="Logo"
                          />
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="tests" className="space-y-4">
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Tests</CardTitle>
                  <CardDescription>Run tests to test app functions.</CardDescription>
                </CardHeader>
                <CardContent>

                  <ul className="grid gap-3 text-sm mt-2">
                    <fetcher.Form method='post' >
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Create lead - API
                        </span>
                        <span>
                          <Button
                            type='submit'
                            name='intent'
                            value='createLead'
                            size='sm'
                            className=' bg-primary'
                            onClick={() => {
                              toast.success('Sent http request to api to create lead')
                            }}
                          >
                            Create
                          </Button>
                        </span>
                      </li>
                    </fetcher.Form>
                  </ul>
                </CardContent>

              </Card>
            </TabsContent>
          </Tabs >
        </div >
      </div >
    </>
  )
}
/**  const createFirstRepo = async (newDealerRepoName) => {
    const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
    const templateOwner = '8an3';
    const templateRepo = 'thesalespersonscrmm';
    const newRepoName = newDealerRepoName;
    const newRepoOwner = '8an3';

    const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

    const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

    const data = { name: newRepoName, owner: newRepoOwner, };
    return axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
      .catch(error => { console.error('Error creating repository:', error.response.data); });
  };
  const createSecondRepo = async (newDealerRepoName) => {
    const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
    const templateOwner = '8an3';
    const templateRepo = 'crmsat';
    const newRepoName = newDealerRepoName;
    const newRepoOwner = '8an3';

    const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

    const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

    const data = { name: newRepoName, owner: newRepoOwner, };
    return axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
      .catch(error => { console.error('Error creating repository:', error.response.data); });
  }; */
