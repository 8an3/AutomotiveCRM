
import { useState, useEffect, } from 'react'
import canamIndex from '~/logos/canamIndex.png'
import manitouIndex from '~/logos/manitouIndex.png'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, } from '~/components/ui/card'
import { redirect, json, type LinksFunction, type DataFunctionArgs, type LoaderArgs, type MetaFunction, } from '@remix-run/node'
import { Form, Link, useLoaderData, useFetcher, Links } from '@remix-run/react';
import Overview from '~/images/overview.png'
import Salestracker from '~/images/salestracker.png'
import Features from '~/images/features.png'
import Dealerfees from '~/images/dealerfees.png'
import harleyDavidson from '~/logos/hd.png'
import activix from '~/logos/activix.svg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import Parts from '~/images/parts.png'
import Quoeimage from '~/images/quote.png'
import { Input, Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Label, Separator, Badge, RemixNavLinkText, } from "~/components/ui/index"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import { getSession, } from "~/sessions/auth-session.server";
import { NavigationMenuSales } from '~/components/shared/navMenu'
import { AlertCircle } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { GetUser } from "~/utils/loader.server";
import base from "~/styles/base.css";
import secondary from '~/styles/indexSecondary.css'
import index from '~/styles/index.css'
import React from 'react'




export default function FunFunction() {
  return (
    <>
      <div className='bg-background mt-5'>
        <NavigationMenuSales />

        <div className='bg-background mt-[60px]' >
          <div className="mx-auto max-w-2xl py-[55px] ">

            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Generate vehicle pricing in less than 60 seconds or saving your sales people 125+ mins a day, individually
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground">
                Experience crystal-clear and effortlessly legible displays of weekly, bi-weekly, and monthly payment options, all while receiving a detailed breakdown of every dollar involved in the deal.
              </p>
              <p className="mt-6 text-lg leading-8 text-foreground">
                Inquire about a free demo of our new CRM! Garaunteed better results than any other crm on the market. Developed and tested by a team of sales professionals, instead of programmers and developers who never sold a car in their life.
              </p>
              <Form method="post" action="/emails/send/contact" className='mt-5 flex items-center  justify-center'>
                <Input name="email" placeholder="example@gmail.com" className='mr-2 w-[300px] border border-white bg-black text-foreground focus:border-primary' />

                <Button name='intent' value='demoInquiry' type='submit' className=" ml-2 mr-2 w-[75px]  rounded bg-primary  text-center text-xs font-bold   uppercase  text-foreground shadow outline-none transition-all duration-150  ease-linear hover:shadow-md focus:outline-none active:bg-background"
                >
                  Email
                </Button>
              </Form>
            </div>
          </div>
        </div>


        <p>NewSection</p>
        <div className="mt-[100px] ">
          <div className='bg-background text-foreground border-border'>
            <div className='mt-[50px] w-[80%] mx-auto space-y-3'>
              <p>Dealer Sales Assistant</p>
            </div>

            <div className='mt-[15px] mb-[15px] w-[80%] mx-auto space-y-3'>
              <RemixNavLinkText to='/' className='mt-[100px]'>
                <p className='hover:underline'>Home</p>
              </RemixNavLinkText>
              <RemixNavLinkText to='/roadmap'>
                <p className='hover:underline'>Roadmap</p>
              </RemixNavLinkText>
              <RemixNavLinkText to='/crm'>
                <p className='hover:underline'>CRM</p>
              </RemixNavLinkText>
              <RemixNavLinkText to='/contact'>
                <p className='hover:underline'>Contact</p>
              </RemixNavLinkText>
              <RemixNavLinkText to='/privacy' className='mb-[50px]'>
                <p className='hover:underline'>Privacy Policy</p>
              </RemixNavLinkText>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
