import { Form, Link, NavLink, useLoaderData, useNavigation } from '@remix-run/react'
import { Button, ButtonLoading, Checkbox, Separator, } from '~/components/ui/index'
import { json, type ActionFunction, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'
import { Bird, Rabbit, Turtle } from "lucide-react"
import {
  TextArea, Select, Input,
  SelectContent, Label,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, buttonVariants
} from "~/components/"
import { model } from '~/models'
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { prisma } from "~/libs";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'
import { toast } from 'sonner'
import CheckingDealerPlan from '../__customerLandingPages/welcome/contactUsEmail'
import * as React from "react";
import FirstImage from '~/images/Capture.jpg'
import Second from '~/images/123.jpg'
import overview1 from '~/images/overview1.jpg'
import models from '~/images/models.png'
import harleyDavidson from '~/images/logos/hd.png'
import kawasaki from '~/overviewUtils/images/kawa.png'
import activix from '~/images/logos/activix.svg'
import canamIndex from '~/images/logos/canamIndex.png'
import manitouIndex from '~/images/logos/manitouIndex.png'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
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
  communications,
  roadMapItems
} from '~/routes/__authorized/dealer/user/dashboard.roadmap'
import { cn } from "~/components/ui/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { useLocation } from '@remix-run/react'

export default function MyComponent() {
  const [features, setFeatures] = useState('features')

  const columnsWithItems = [
    { name: 'DONE NEEDS TESTING', items: doneneedstesting },
    { name: 'WIP', items: WIP },
    { name: 'GET IT DONE NOW', items: getDoneNow },
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
    { name: 'COMPLETED', items: completed },

  ];

  const [name, setName] = useState('')
  const [pickedRoadmap, setPickedRoadmap] = useState([])



  return (
    <div className="flex  bg-zinc-100 mx-auto overflow-x-clip">
      <div className="flex flex-col pb-28 w-screen max-md:pb-24 max-md:max-w-full">
        <div className="flex flex-col w-full max-md:max-w-full">
          <div className="flex flex-wrap gap-5 justify-between px-9 py-6 w-full text-lg uppercase whitespace-nowrap bg-zinc-100 max-md:px-5 max-md:max-w-full">
            <p className='text-black text-2xl'>
              <NavLink to='/'>
                DSA
              </NavLink>
            </p>
            <div className="flex items-start p-0.5 leading-none text-black bg-white border-2 border-solid border-neutral-900 rounded-[32px] max-md:max-w-full">
              <div className="flex flex-wrap gap-0 items-start min-w-[240px] max-md:max-w-full">
                <div className="px-7 pt-4 pb-4 max-md:px-5">
                  <Link to="#why">
                    Why
                  </Link>
                </div>
                <div className="pt-4 pr-7 pb-4 pl-7 text-base leading-none max-md:px-5">
                  <NavLink to='#why'>
                    Custom Features
                  </NavLink>
                </div>
                <div className="px-7 pt-4 pb-4 max-md:px-5">
                  <NavLink to='/contact'>
                    Contact
                  </NavLink>
                </div>
                <div className="pt-4 pr-7 pb-4 pl-7 max-md:px-5">
                  <NavLink to='#subscribe'>
                    Subscribe
                  </NavLink>
                </div>
              </div>
            </div>
            <NavLink to='/auth/login'>
              <div className="self-start pt-4 pr-9 pb-5 pl-9 font-semibold leading-none text-gray-50 border-2 border-solid bg-neutral-900 border-neutral-900 rounded-[32px] max-md:px-5">
                Login
              </div>
            </NavLink>
          </div>
          <div className="xl:relative grid grid-cols-1 md:grid-cols-2 flex-wrap gap-5 justify-between self-center mt-20 w-full max-w-full max-md:mt-10 max-md:max-w-full ">
            <div className="flex mx-auto justify-center py-1 pr-40 pl-1 mt-20 text-4xl leading-none text-black  rounded-full  bg-opacity-10 max-md:pr-5 max-md:mt-10">
              <p className="py-0.5 pr-2.5 pl-2 rounded-full max-w-[95%] md:max-w-[95%] text-center">
                Meet the CRM of today, the management system anyone can use with ease. Focus on the sale, not the processes. Designed and brought to life by sales people, who still hit the floor everyday. COMING SOON: Free for individual sales people.
              </p>

            </div>
            <div className="flex mx-auto flex-col justify-center p-1.5 border-2 border border-solid bg-zinc-100 rounded-[38px] text-neutral-900 max-md:max-w-[85%]">
              <div className="flex flex-wrap items-start p-0.5 border-2 border-solid border-neutral-900 rounded-[32px] max-md:max-w-[85%] overflow-clip ">
                <img src={FirstImage} alt='what' className=' rounded-[38px] ' />
              </div>
            </div>
            <div className="xl:absolute xl:mt-[250px] flex flex-col pr-11 pb-px mx-9 text-neutral-900 max-md:pr-5 max-md:mr-2.5 max-md:max-w-full w-full">
              <div className="  mt-6 text-8xl tracking-tight  border-solid leading-[117px] max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
                Customer
                <br />
                managment for every <span className="text-muted-foreground">role</span> in the dealer.
              </div>
            </div>
          </div>

          <div className="flex mx-auto gap-6 w-full max-w-full max-md:mr-2.5 max-md:max-w-full mt-5 md:mt-[150px] justify-center">
            <div className="flex overflow-hidden  p-0.5 whitespace-nowrap bg-gray-50 border-2 border-solid border-neutral-900 rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] max-md:max-w-[75%] md:max-w-[75%] items-center">
              <div className="pt-8 pr-16 pb-8 pl-14 leading-none border-r-2 bg-neutral-200 border-neutral-900 text-neutral-900 max-md:px-5 text-xl">

                Designed for use by any salesperson at any dealership.
              </div>
              <div className="flex flex-col grow shrink-0 justify-center px-9 py-8 text-xl font-medium text-gray-500 bg-gray-50 basis-0 w-fit max-md:px-5 max-md:max-w-full">
                <div className="overflow-hidden pt-px pr-[662px] max-md:pr-5">
                  You can trust that we are here to support you in achieving greater sales success.
                </div>
              </div>
            </div>
            <div className="flex shrink gap-5 px-10 py-9 text-xl font-semibold leading-none text-center uppercase bg-gray-50 border-2 border-solid basis-auto border-neutral-900 grow-0 rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] text-neutral-900 max-md:px-5 items-center">
              <div className="grow">Coming Soon</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/99ee96b8a0884c62fd428f86d9672907ab021e3fefd9a0480f6f1982d3fbf3ff?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 self-start mt-1.5 aspect-square w-[15px]"
              />
            </div>
          </div>
          <div className="flex overflow-hidden relative flex-col items-start pt-14 pb-28 pl-16 mx-9 mt-20 pr-[485px] rounded-[32px] max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:mr-2.5 max-md:max-w-full">
            <div className="flex absolute inset-0 z-0 max-w-full bg-neutral-900 min-h-[690px] w-full" />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a19c4a401657e1ccc16d91de9e395aa6a2643cd720e2ab604843b10232df305?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
              className="object-contain absolute inset-y-0 right-0 z-0 max-w-full aspect-[2.03] w-full"
            />
            <div className="flex absolute top-0 right-0 z-0 max-w-full h-[276px] min-h-[276px] rounded-[32px_32px_0px_0px] w-full" />
            <div className="z-0 self-stretch text-6xl text-gray-50 leading-[62px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
              Let us worry about everything.
            </div>
            <div className="flex relative z-0 items-start pt-10 pb-48 max-w-full text-zinc-500 w-[100%] max-md:pb-24 mb-[75px]">
              <div className="flex z-0 flex-col pt-2 pr-6 pb-8 text-gray-50 min-w-[240px] w-[70%]">
                <div className="self-start text-3xl leading-none">
                  Chase down that next lead.
                </div>
                <div className="mt-3 text-2xl leading-8">
                  Instead of getting bogged down by the various details of daily interactions with customers, you can focus on pursuing your next client without distraction.
                </div>
              </div>
              <div className="absolute left-0 z-0 text-3xl leading-none bottom-[159px] right-[122px] top-[204px] w-[70%]">
                Every process we undertake is thoroughly analyzed and redesigned to minimize the time you spend on repetitive tasks.
              </div>
              <div className="absolute left-0 right-48 z-0 text-3xl leading-none bottom-[95px] top-[268px]  w-[70%]">
                This approach saves you valuable time when it matters most—when you’re not in front of a customer.
              </div>
              <div className="absolute left-0 z-0 text-3xl leading-10 bottom-[-31px] right-[63px] top-[356px] w-[70%]">

                Ultimately, our goal is to empower you to drive sales and build stronger relationships with your clients.
              </div>
            </div>
          </div>
          <div className="self-center mt-28 text-8xl tracking-tighter text-center leading-[93px] text-neutral-900 max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
            Everything you need in a CRM
          </div>
          <div className="flex overflow-clip flex-col py-0.5 pr-0.5 pl-4 mx-9 mt-9 rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 max-md:mr-2.5 max-md:max-w-full">
            <div className="flex overflow-clip relative flex-col items-start px-8 pt-8 pb-96 min-h-[400px] max-md:px-5 max-md:pb-24 max-md:max-w-full mb-3">
              <img
                loading="lazy"
                srcSet={Second}
                className="absolute inset-0 w-[90%] ml-auto"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/321fa2c23382f68dda9bd8991ff047d27d7cf62d0986a9dcf9dcdc65d23e3ae8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain mb-0 rounded-full aspect-square w-[72px] max-md:mb-2.5"
              />
            </div>
            <div className="flex flex-wrap gap-5 justify-between px-8 pt-5 pb-10 border-t-2 border-neutral-900 text-neutral-900 max-md:px-5 max-md:max-w-full">
              <div className="self-start text-3xl leading-none max-md:max-w-full">
                A personalized user experience designed specifically for salespeople.
              </div>
              <div className="text-xl leading-8">
                We ensure that you avoid unnecessary steps in everything we do. As salespeople ourselves, using the same system every day, we constantly look for ways to improve. When we spot an area for enhancement, we immediately implement changes and test them with our customers firsthand. Our goal is to save time wherever possible, allowing you to spend less time on paperwork and administrative tasks, and more time making calls and sending emails to close your next deal.
              </div>
            </div>
          </div>
          <div className="mx-9 mt-8 max-md:mr-2.5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex overflow-hidden flex-col pt-9 pb-0.5 w-full rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 max-md:mt-6 max-md:max-w-full">
                  <div className="ml-12 max-w-full w-[488px]">
                    <div className="flex gap-5 max-md:flex-col">
                      <div className="flex flex-col w-[16%] max-md:ml-0 max-md:w-full">
                        <img
                          loading="lazy"

                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9df34bf0d9f5826ecbaf1e18bc2e8148bbf0e0e36ba3938ab1c9061983abb01d?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                          className="object-contain shrink-0 rounded-full aspect-square w-[72px] max-md:mt-8"
                        />
                      </div>
                      <div className="flex flex-col ml-5 w-[84%] max-md:ml-0 max-md:w-full">
                        <div className="flex gap-6 p-4 mt-12 w-full bg-white rounded-2xl shadow-[0px_4px_0px_rgba(229,231,235,1)] max-md:mt-10">
                          <div className="flex gap-3 text-sm font-semibold text-neutral-900">
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9da44c047f25e66276eaa4c309b0b44b06f87fc6b1a41d3d0c38a913a2847968?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                              className="object-contain shrink-0 aspect-square w-[35px]"
                            />
                            <div className="my-auto">Add to calendar</div>
                          </div>
                          <div className="flex self-start px-2.5 py-2 text-xs font-medium leading-none rounded-md border border-solid bg-white bg-opacity-70 border-gray-300 border-opacity-70 text-stone-950 text-opacity-70">
                            <div className="overflow-hidden z-10 self-start pr-11 max-md:mr-0">
                              Meetings (rickastley@...)
                            </div>
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/185a527195ed8c31b9c1e7cd0a238fc20038ee95304d6e973f67c05ce3fb83fc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                              className="object-contain shrink-0 aspect-square w-[18px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                      <div className="flex flex-col w-[26%] max-md:ml-0 max-md:w-full">
                        <div className="flex overflow-hidden flex-col mx-auto text-xs leading-none rounded-2xl bg-white bg-opacity-50 h-[171px] shadow-[0px_4px_0px_rgba(229,231,235,0.5)] w-[171px] max-md:mt-4">
                          <div className="flex items-start pt-5 pr-32 pb-4 whitespace-nowrap text-gray-600 text-opacity-50 max-md:pr-5">
                            <div className="pt-4 pr-2.5">
                              rickastley@outlook.com
                            </div>
                          </div>
                          <div className="flex items-start pt-4 pr-4 pb-16 font-medium border-t border-gray-200 border-opacity-50 text-neutral-900 text-opacity-50">
                            <div className="py-px pr-36">
                              Get Rickrolled at work
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex overflow-hidden flex-col mx-auto w-full bg-white rounded-2xl shadow-[0px_4px_0px_rgba(229,231,235,1)] max-md:mt-4">
                          <div className="flex gap-3 items-center pt-5 pr-28 pb-4 pl-5 max-md:pr-5">
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2650eea6278b90d996401f901bbf2c62eaf3252a7b64a8ff5d458fdcd42223ec?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
                            />
                            <div className="flex flex-col self-stretch my-auto w-[136px]">
                              <div className="flex gap-2.5 w-full max-w-[136px]">
                                <div className="grow text-xs font-semibold leading-none text-neutral-900">
                                  Google Calendar
                                </div>
                                <div className="self-start pt-px pr-1.5 pb-1 pl-1 text-xs font-medium leading-none text-green-600 whitespace-nowrap bg-emerald-100 rounded">
                                  Default
                                </div>
                              </div>
                              <div className="text-xs leading-none text-gray-600">
                                rickastley@gmail.com
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col px-4 pt-4 pb-4 border border-t">
                            <div className="flex gap-3 items-center pr-44 max-md:pr-5">
                              <div className="flex flex-col justify-center items-start self-stretch px-1.5 py-1 my-auto bg-gray-800 rounded-[85px] w-[30px]">
                                <div className="flex shrink-0 w-3 h-3 bg-white rounded-md shadow-[0px_1px_1px_rgba(0,0,0,0.1)]" />
                              </div>
                              <div className="self-stretch my-auto text-xs font-medium leading-none text-neutral-900">
                                Get Rickrolled
                              </div>
                            </div>
                            <div className="flex gap-3 items-center pr-24 mt-2 max-md:pr-5">
                              <div className="flex flex-col justify-center items-start self-stretch px-1.5 py-1 my-auto bg-gray-800 rounded-[85px] w-[30px]">
                                <div className="flex shrink-0 w-3 h-3 bg-white rounded-md shadow-[0px_1px_1px_rgba(0,0,0,0.1)]" />
                              </div>
                              <div className="flex gap-3 items-center self-stretch my-auto font-medium">
                                <div className="self-stretch my-auto text-xs leading-none text-neutral-900">
                                  Meetings
                                </div>
                                <div className="overflow-hidden self-stretch pt-px pr-3 pb-1 pl-1 my-auto text-xs leading-none text-gray-800 bg-gray-100 rounded">
                                  &lt;- Adding events to
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center pr-36 mt-2 max-md:pr-5">
                              <div className="flex flex-col justify-center items-start self-stretch px-1.5 py-1 my-auto bg-gray-200 rounded-[85px] w-[30px]">
                                <div className="flex shrink-0 w-3 h-3 bg-white rounded-md shadow-[0px_1px_1px_rgba(0,0,0,0.1)]" />
                              </div>
                              <div className="self-stretch my-auto text-xs font-medium leading-none text-neutral-900">
                                Holidays in Canada
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-[24%] max-md:ml-0 max-md:w-full">
                        <div className="flex overflow-hidden flex-col mx-auto w-full rounded-2xl bg-white bg-opacity-50 shadow-[0px_4px_0px_rgba(229,231,235,0.5)] max-md:mt-4">
                          <div className="flex gap-3 items-center pt-5 pb-4 pl-5">
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1fe4d489a83a3942af2cbfc9690535056edf3db0c11227448989aef6ec822792?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
                            />
                            <div className="flex flex-col self-stretch my-auto">
                              <div className="text-xs font-semibold leading-none text-neutral-900 text-opacity-50">
                                Apple Calendar
                              </div>
                              <div className="text-xs leading-none text-gray-600 text-opacity-50">
                                rickastley@icloud.com
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start pt-4 pb-4 pl-4 border-t border-gray-200 border-opacity-50">
                            <div className="flex gap-3 items-center">
                              <div className="flex flex-col justify-center items-start self-stretch px-1.5 py-1 my-auto bg-gray-800 bg-opacity-50 rounded-[85px] w-[30px]">
                                <div className="flex shrink-0 w-3 h-3 rounded-md bg-white bg-opacity-50 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]" />
                              </div>
                              <div className="self-stretch my-auto text-xs font-medium leading-none text-neutral-900 text-opacity-50">
                                Get Rickrolled at home
                              </div>
                            </div>
                            <div className="flex gap-3 items-center pr-3.5 mt-2">
                              <div className="flex flex-col justify-center items-start self-stretch px-1.5 py-1 my-auto bg-gray-800 bg-opacity-50 rounded-[85px] w-[30px]">
                                <div className="flex shrink-0 w-3 h-3 rounded-md bg-white bg-opacity-50 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]" />
                              </div>
                              <div className="self-stretch my-auto text-xs font-medium leading-none text-neutral-900 text-opacity-50">
                                Events at home
                              </div>
                            </div>
                            <div className="flex gap-3 items-center mt-2">
                              <div className="flex flex-col justify-center items-start self-stretch px-1.5 py-1 my-auto bg-gray-200 bg-opacity-50 rounded-[85px] w-[30px]">
                                <div className="flex shrink-0 w-3 h-3 rounded-md bg-white bg-opacity-50 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]" />
                              </div>
                              <div className="self-stretch my-auto text-xs font-medium leading-none text-neutral-900 text-opacity-50">
                                Holidays in Canada
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-8 pt-5 pb-10 mt-20 ml-4 border-t-2 border-neutral-900 max-md:px-5 max-md:mt-10 max-md:mr-0.5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                      <div className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
                        <div className="text-3xl leading-8 text-neutral-900 max-md:mt-10">
                          From the owners perspective
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
                        <div className="text-lg leading-7 text-neutral-900 max-md:mt-10">
                          Every role is currently inefficient, costing you money in both salaries and missed opportunities. We analyze each position to ensure this no longer happens—not just by making it easier for employees to be efficient, but by driving them to excel in their roles. Our system is designed with an intuitive interface that ensures everyone, regardless of their tech skills, knows exactly what to do. This also reduces training time for new hires. With just one of our implementations, you could save $14,000 in salary costs per role.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex overflow-hidden flex-col pt-9 pr-0.5 pb-0.5 pl-4 w-full rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 max-md:mt-6 max-md:max-w-full">
                  <div className="flex z-10 flex-col items-end ml-8 max-w-full w-[450px]">
                    <div className="self-stretch max-md:max-w-full">
                      <div className="flex gap-5 max-md:flex-col">
                        <div className="flex flex-col w-1/5 max-md:ml-0 max-md:w-full">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a94fef0b92bf64b82c0e8961b338be7576fb74e31a02381ffc9baac984b52d9b?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                            className="object-contain shrink-0 rounded-full aspect-[1.04] w-[75px] max-md:mt-10"
                          />
                        </div>
                        <div className="flex flex-col ml-5 w-4/5 max-md:ml-0 max-md:w-full">
                          <div className="flex flex-col mt-8 w-full text-sm font-semibold leading-4 max-md:mt-10">
                            <div className="flex overflow-hidden gap-2 px-5 py-8 bg-white rounded-2xl shadow-[0px_4px_0px_rgba(229,231,235,1)] text-neutral-900">
                              <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fb6a62bb36e65467216886fea86aaf68271a559badebede91430db81f3d2441?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                                className="object-contain shrink-0 aspect-[1.03] w-[38px]"
                              />
                              <div className="my-auto">
                                Send SMS reminder 24 hours before event starts
                                to Host
                              </div>
                            </div>
                            <div className="flex overflow-hidden gap-2 px-5 py-7 mt-4 rounded-2xl bg-white bg-opacity-70 shadow-[0px_4px_0px_rgba(229,231,235,0.7)] text-neutral-900 text-opacity-70">
                              <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8932a5bc55cf71d027a30a14346bc420d8a1207cf21f16b7a25076af9fd2f0b7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                                className="object-contain shrink-0 aspect-[1.03] w-[38px]"
                              />
                              <div>
                                Send custom email when event is cancelled to
                                host
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex overflow-hidden gap-2 px-5 py-8 mt-4 text-sm font-semibold leading-4 rounded-2xl bg-white bg-opacity-40 shadow-[0px_4px_0px_rgba(229,231,235,0.4)] text-neutral-900 text-opacity-40">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c242c90c9195b6f1b16bbfc381d4e194fe6d74a499043a70c0f392f2bb1a83db?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                        className="object-contain shrink-0 aspect-[1.03] w-[38px]"
                      />
                      <div className="my-auto">
                        Send reminder email 24 hours before event starts to
                        attendee
                      </div>
                    </div>
                    <div className="flex overflow-hidden flex-col mt-4 max-w-full rounded-2xl bg-white bg-opacity-10 shadow-[0px_4px_0px_rgba(229,231,235,0.1)] w-[306px]">
                      <div className="flex items-start py-7 pr-60 pl-5 max-md:pr-5">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/692b7b32307cdc671dff3adf330533d4429e3287943629d4caaf715be0bc7d65?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                          className="object-contain aspect-[1.03] w-[38px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-8 pt-5 pb-10 -mt-16 border-t-2 border-neutral-900 max-md:px-5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                      <div className="flex flex-col w-[35%] max-md:ml-0 max-md:w-full">
                        <div className="text-3xl leading-8 text-neutral-900 max-md:mt-10">
                          A significant, measurable improvement for every department.
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-[65%] max-md:ml-0 max-md:w-full">
                        <div className="text-lg leading-7 text-neutral-900 max-md:mt-10">
                          Every department was approached with the same meticulous attention to detail throughout the development of the application. Each role’s interface was redesigned countless times—some even over 100's iterations—then rigorously tested and improved as needed. And still, our work isn’t done. If there’s a way to streamline a process or shorten the time to complete a task, let us know, and we’ll make it right. As sales professionals, we’ve refined it as much as possible from our perspective, but with your feedback—and that of our colleagues—we can keep improving, striving toward the perfect solution for everyone.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-9 mt-8 max-md:mr-2.5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                <div className="flex overflow-hidden flex-col pt-9 pr-0.5 pb-0.5 pl-4 w-full rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 max-md:mt-6 max-md:max-w-full">
                  <div className="flex gap-9 self-end  mb-3">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/26b0d7405bee7a6011938dc202f2ffb1918253bc13098b1aafd8488bde88eaa0?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 self-start w-14 rounded-full aspect-square"
                    />
                    <div className="flex flex-col grow shrink-0 justify-center py-1 border-solid basis-0 border-[14px] border-neutral-900 rounded-[32px_32px_0px_0px] w-fit">
                      <img
                        loading="lazy"
                        srcSet={overview1}
                        className="object-contain w-full aspect-[1.43]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col pt-6 pr-20 pb-10 pl-8 border-t-2 border-neutral-900 text-neutral-900 max-md:px-5 max-md:max-w-full">
                    <div className="text-2xl leading-none">
                      More for less
                    </div>
                    <div className="mt-2 text-lg leading-7">
                      We offer more features for less. For example, we have a bespoked quoting system. Inteligently designed that even someone on their first day, can walk someone through a deal and go for the close. No more missed oppurtunities because upselling is too difficult or too complex to easily explain to your customer.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                <div className="flex overflow-hidden flex-col grow py-0.5 pr-0.5 pl-4 rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 text-neutral-900 max-md:mt-6 max-md:max-w-full">
                  <div className="flex shrink-0 h-[248px] max-md:max-w-full" >
                    <img src={models} alt='what' className='scale-100' />
                  </div>
                  <div className="flex flex-col pt-6 pr-14 pb-10 pl-8 border-t-2 border-neutral-900 max-md:px-5 max-md:max-w-full">
                    <div className="text-2xl leading-loose">
                      Each deal right the first time.
                    </div>
                    <div className="mt-2 text-lg leading-7">
                      The system does not allow you to make mistakes when it comes to every $ in every deal. You select the brand, then the units that are available for that model year can be chosen from. If model options are available, you are presented with a page and can only select the options that can be fitted to that model with pricing. Finnaly you are met with a break down of the deal, that can be edited so when a customer makes a last minute addition or change, it can be done on the spot easily. Not only that, but gives you information for any selling oppurtunity. Whether its finance products, or maybe they tell you at the last minute they need to be charged another tax rate, our system lets you make these changes on the fly with ease.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                <div className="flex overflow-hidden flex-col grow py-0.5 pr-0.5 pl-4 rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 text-neutral-900 max-md:mt-6 max-md:max-w-full">
                  <div className="flex shrink-0 h-[248px] max-md:max-w-full" />
                  <div className="flex flex-col pt-6 pr-20 pb-10 pl-8 border-t-2 border-neutral-900 max-md:px-5 max-md:max-w-full">
                    <div className="text-2xl leading-none">
                      For individual sales people
                    </div>
                    <div className="mt-2 text-lg leading-7">
                      To top it off, free. You will not have all the features that are available, because they require the whole dealer to be used. But you will have everything else. Quoting, sales dashboard, calendar and more. Even you if change dealerships you can start using the same crm you have been using previously, to jump right back in to sales action. With 0 downside and 100% upside, and does not require skill or salesmanship to see an increase, this will be the best change you have made to your sales game in years.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex overflow-hidden flex-col pb-3 mx-9 mt-8 text-xl leading-loose text-white bg-neutral-900 rounded-[32px] max-md:mr-2.5 max-md:max-w-full">
            <div className="flex items-start pt-3 pb-3.5 max-w-full border border-b-2 w-[1372px]">
              <div className="flex overflow-hidden flex-col min-w-[240px] w-[1372px] max-md:max-w-full">
                <div className="flex flex-wrap gap-3 items-start pr-2.5">
                  <div className="flex gap-3 py-px text-xl leading-loose w-[138px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/376beb61b4a1cf07c807d8c2bdd50faea34ecc29d3520493a2336ffa1e755d71?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-2 aspect-square"
                    />
                    <div className="basis-auto">Sales Calendar</div>
                  </div>
                  <div className="flex gap-3 py-px w-[150px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/387a6384b3a2c59cdb39d59615ee5b75287b3997867d6bbbbb24ddb536c236ff?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-2 aspect-square"
                    />
                    <div className="basis-auto">Script builder</div>
                  </div>
                  <div className="flex gap-3 py-px w-[181px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/dae6e33e344e146ec7e1394031e326eaaeae8f254259990be4fc80011adb6b84?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-2 aspect-square"
                    />
                    <div className="basis-auto">Instant Documents</div>
                  </div>
                  <div className="flex gap-3 py-px w-[222px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/45283cefda64cd442209278d2cc5824ee1ec996ac947a15e9e72e48913bf3f61?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-2 aspect-square"
                    />
                    <div className="basis-auto">Payment Calculator</div>
                  </div>
                  <div className="flex gap-3 py-px text-xl leading-loose w-[218px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/3893f89aedff2c8cc074033bd44ec65f8d1dcd9a0b484d0d5e3d1298a2062326?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-2 aspect-square"
                    />
                    <div className="flex-auto">
                      Revolutionary Process Design
                    </div>
                  </div>
                  <div className="flex gap-3 py-px w-[232px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/4b1efac0c0531a8792984cae483f0e863b9141fdb4578bc03e82533e4f1e2390?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-2 aspect-square"
                    />
                    <div className="basis-auto">Staff Scheduler</div>
                  </div>
                  <div className="flex gap-3 w-[150px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/90c4717abb701bf2c88ad525a37070ccc59fb099262e24b033e731e0337b9616?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-2 aspect-square"
                    />
                    <div className="basis-auto"> Email Client</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex overflow-hidden flex-col mt-3 w-full max-w-full max-md:max-w-full">
              <div className="flex flex-wrap gap-3 items-start pr-2.5 max-md:max-w-full">

                <div className="flex gap-3  text-xl leading-loose w-[150px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5e5cc1c42c38a61ccdf2ab73004f4e1fc542df41fcf4ee42a43cfbcfaa316b99?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-2 aspect-square"
                  />
                  CRM Integration
                </div>
                <div className="flex gap-3 w-[212px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5e5cc1c42c38a61ccdf2ab73004f4e1fc542df41fcf4ee42a43cfbcfaa316b99?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-2 aspect-square"
                  />
                  <div className="basis-auto">Sales Statistics Breakdown</div>
                </div>
                <div className="flex gap-3 w-[250px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/265579aa2b8e94b278704916b13b86346d4d4a38ad92db200968c5bcfd8e56e7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-2 aspect-square"
                  />
                  <div className="basis-auto">Hard To Soft Document Storage</div>
                </div>
                <div className="flex gap-3 w-[222px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/349c4d78ed5b11b48fa1b49afdfe7583b7e0b979f2b08229c79d1c98d4b83bfe?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-2 aspect-square"
                  />
                  <div className="basis-auto">Inventory Mangement</div>
                </div>
                <div className="flex gap-3 text-xl leading-loose w-[175px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/647e6af2041d11395a80af31cf4b123de378223a10571ce80d8b1207609fc298?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-2 aspect-square"
                  />
                  <div className="flex-auto">
                    Import / Export Data
                  </div>
                </div>
                <div className="flex gap-3 w-[200px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/90c4717abb701bf2c88ad525a37070ccc59fb099262e24b033e731e0337b9616?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-2 aspect-square"
                  />
                  <div className="basis-auto">Specialized Dashboards</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex overflow-hidden flex-col mt-28 w-full text-center text-neutral-900 max-md:mt-10 max-md:max-w-full">
            <div className="flex relative flex-col justify-center items-center px-20 py-28 w-full min-h-[597px] max-md:px-5 max-md:py-24 max-md:max-w-full">
              <div className='flex flex-wrap justify-center py-4 gap-8 object-cover absolute inset-0 size-full overflow-clip'>
                <TooltipProvider>
                  {Array.from({ length: Math.ceil(800 / 64) }) // Adjust 64 based on logo height
                    .map((_, rowIndex) => {
                      // Generate a random starting index for each row, including the first row
                      const randomStartIndex = Math.floor(Math.random() * logos.length);
                      return (
                        <div className='flex justify-center w-full' key={rowIndex}>
                          {logos.map((img, index) => {
                            // Calculate the logo index for the current row based on the random start index
                            const logoIndex = (randomStartIndex + index) % logos.length; // Wrap around using modulus
                            return (
                              <Tooltip key={logos[logoIndex].href}>
                                <TooltipTrigger asChild>
                                  <a
                                    href={logos[logoIndex].href}
                                    className="flex h-[90px] w-[180px] justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0 mx-3"
                                  >
                                    <img
                                      alt={logos[logoIndex].alt}
                                      src={logos[logoIndex].src}
                                      className="object-contain"
                                    />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent className='border-border bg-background text-foreground'>{logos[logoIndex].alt}</TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      );
                    })}
                </TooltipProvider>
              </div>
              <div className="flex relative flex-col mb-0 max-w-full w-[90%] md:w-2/3 max-md:mb-2.5 border-border border rounded-[38px] bg-white ">
                <div className="text-6xl leading-[62px] max-md:mr-1.5 max-md:ml-2 max-md:text-4xl max-md:leading-[50px] mt-16">
                  Connected with your brands
                </div>
                <div className="mt-10 text-xl leading-8">
                  Don't see your brand? Let us know and we can get it up and running in no time.
                </div>
                <div className="flex gap-5 px-14 py-9 mt-9 mr-3.5 ml-4 text-xl font-semibold leading-none uppercase bg-gray-50 border-2 border-solid border-neutral-900 rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] max-md:px-5 max-md:mx-2.5 mb-16 w-1/2 mx-auto justify-center place-self-center">
                  <div className="grow">Explore all brands</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed47eae7a15ea000ab4095efae43a3cacb0d08a11c6134381ce07fa5850b34b1?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 self-start mt-1.5 aspect-square w-[15px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='why' className="  mt-8 max-md:mr-2.5 w-2/3 mx-auto justify-center">
          <div className="flex flex-col">
            <div className="flex overflow-hidden flex-col pt-9 pb-0.5 w-full rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 max-md:mt-6 ">
              <div className="flex items-start p-0.5 leading-none text-black bg-white border-2 border-solid border-neutral-900 rounded-[32px] w-[575px] mx-auto">

                <div className="flex flex-wrap gap-0 items-start min-w-[240px] mx-auto justify-center">
                  <div className="px-7 pt-4 pb-4 max-md:px-5">
                    <Button
                      onClick={() => setFeatures('features')}
                      variant='ghost'
                      className='rounded-[32px]' >
                      Features
                    </Button>
                  </div>
                  <div className="pt-4 pr-8 pb-4 pl-7 text-base leading-none max-md:px-5">
                    <Button
                      onClick={() => setFeatures('why')}
                      variant='ghost' className='rounded-[32px]'>
                      Why
                    </Button>
                  </div>
                  <div className="pt-4 pr-7 pb-4 pl-7 text-base leading-none max-md:px-5">
                    <Button
                      onClick={() => setFeatures('faq')}
                      variant='ghost' className='rounded-[32px]'>
                      FAQ
                    </Button>
                  </div>
                  <div className="px-7 pt-4 pb-4 max-md:px-5">
                    <Button
                      onClick={() => setFeatures('mission')}
                      variant='ghost' className='rounded-[32px]'>
                      Mission
                    </Button>
                  </div>
                  <div className="px-7 pt-4 pb-4 max-md:px-5">
                    <Button
                      onClick={() => setFeatures('reason')}
                      variant='ghost' className='rounded-[32px]'>
                      The Reason
                    </Button>
                  </div>

                </div>
              </div>

              <div className="flex flex-col pt-6 pr-20 pb-10 pl-8 text-neutral-900 max-md:px-5 max-md:max-w-full overflow-y-auto h-full max-h-[555px]">
                {features === 'features' ? <Features /> :
                  features === 'why' ? <Why /> :
                    features === 'faq' ? <FAQ /> :
                      features === 'mission' ? <Mission /> :
                        features === 'reason' ? <Reason /> : null}
              </div>


            </div>
          </div>
        </div>

        <div id='subscribe' className=" mx-auto mt-10 flex relative flex-col mb-0 max-w-full w-[90%] md:w-2/3 max-md:mb-2.5 border-border border rounded-[38px] bg-white  text-neutral-900 ">
          <p className="text-6xl leading-[62px] max-md:mr-1.5 max-md:ml-2 max-md:text-4xl max-md:leading-[50px] mt-16 text-center">
            Start using the CRM that was built with care,   and works for all of you.
          </p>
          <p className="mt-10 text-xl leading-8 text-center mx-5">
            No headaches, and you save hundreds of thousands in salaries each year. Not switching would be detrimental to your business, your dealership, and your bottom line. With no downside, the only direction is up. So why hesitate? You don’t have to. It’s like I’ve come down from the heavens to offer you the perfect solution to your problems—some you didn’t even realize existed. There are no drawbacks. Do you really dislike the idea of your employees working more efficiently, making you even more money? If you’re still unsure, you must love losing money and enduring unnecessary headaches. To make it even better, there are no contracts, if you want to run a test pilot, on a few of your sales staff, great. If it doesn't work out, you can stop using it at anytime you want. So if you’re ready for a smarter path, click the button below.
          </p>
          <NavLink to='/subscribe' className='mx-auto justify-center' >
            <div className="flex gap-5 px-14 py-9 mt-9 mr-3.5 ml-4 text-xl font-semibold leading-none uppercase bg-gray-50 border-2 border-solid border-neutral-900 rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] max-md:px-5 max-md:mx-2.5 mb-16  mx-auto justify-center place-self-center w-[250px] items-center">
              <div className="grow">Start now!</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed47eae7a15ea000ab4095efae43a3cacb0d08a11c6134381ce07fa5850b34b1?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 self-start mt-1.5 aspect-square w-[15px]"
              />
            </div>
          </NavLink>
        </div>

        <p className="mt-10 leading-8 text-center mx-5 text-neutral-900 text-xl mb-10">
          If your still unsure, you can request a demo through our <NavLink to='/contact' className='underline' >contact page.</NavLink>
        </p>


        <div id='roadmap' className="max-w-2/3 w-2/3 mx-auto mt-10 text-neutral-900 rounded-[32px] border border-border p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-auto">
            <div>
              <p className='text-2xl'>Roadmap</p>
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
                          ? "bg-[#232324] hover:bg-muted/50 w-[90%]  text-white   rounded-[32px]  "
                          : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%] rounded-[32px]  ",
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
                <div className='flex justify-between'>
                  <p className="text-xs text-neutral-900">
                    Projects in progess: {WIP.length +
                      paidfeature.length +
                      dash.length +
                      parts.length +
                      docs.length +
                      owner.length +
                      quote.length +
                      automation.length +
                      admin.length +
                      service.length +
                      accessories.length +
                      manager.length +
                      dealerOnboarding.length +
                      infastructure.length +
                      sales.length +
                      WIP.length +
                      getDoneNow.length +
                      doneneedstesting.length +
                      BACKBURNER.length +
                      issue.length +
                      ideas.length +
                      communications.length}
                  </p>
                  <div className="flex-col font-bold mt-3">

                    {name === 'GET IT DONE NOW' && (
                      <p className="text-xs "> Items to complete:  {getDoneNow.length}</p>
                    )}
                    {name === 'BACKBURNER' && (
                      <p className="text-xs ">  Items to complete:  {BACKBURNER.length}</p>
                    )}
                    {name === 'ISSUES' && (
                      <p className="text-xs "> Current issues:  {issue.length}</p>
                    )}
                    {name === 'DONE NEEDS TESTING' && (
                      <p className="text-xs ">  Needs testing: {doneneedstesting.length}</p>
                    )}
                    {name === 'SERVICE' && (
                      <p className="text-xs "> Service: {service.length} </p>
                    )}
                    {name === 'COMMUNICATIONS' && (
                      <p className="text-xs "> Communications: {communications.length}</p>
                    )}
                    {name === 'DASH' && (
                      <p className="text-xs "> Dash: {dash.length}</p>
                    )}
                    {name === 'INFASTRUCTURE' && (
                      <p className="text-xs ">  Infastructure: {infastructure.length}</p>
                    )}
                    {name === 'ADMIN' && (
                      <p className="text-xs "> Admin: {admin.length}</p>
                    )}
                    {name === 'ACCESSORIES' && (
                      <p className="text-xs ">Accessories: {accessories.length}</p>
                    )}
                    {name === 'PAID FEATURE' && (
                      <p className="text-xs ">AI - paid features: {paidfeature.length}</p>
                    )}
                    {name === 'PARTS' && (
                      <p className="text-xs "> Parts: {parts.length}</p>
                    )}
                    {name === 'QUOTE' && (
                      <p className="text-xs "> Quote: {quote.length}</p>
                    )}
                    {name === 'SALES' && (
                      <p className="text-xs ">  Sales: {sales.length}</p>
                    )}
                    {name === 'DEALER ONBOARDING' && (
                      <p className="text-xs "> Dealer on-boarding: {dealerOnboarding.length}</p>
                    )}
                  </div>

                </div>

              </div>
            </div>
            <div className="lg:col-span-2  bg-[#f4f4f5] overflow-y-clip mt-[50px] ">

              <div className="flex-grow !grow  max-h-[500px] h-full overflow-y-auto  ">
                <ul className="grid gap-3 text-sm mt-2">
                  {pickedRoadmap.map((item, index) => (
                    <li key={index} className="flex mt-2">
                      <p className='text-neutral-900 text-left'>{index + 1}{") "} {item.item}</p>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div >



        <div className="flex flex-col justify-center items-center px-16 py-20 mx-9 mt-32 text-lg leading-loose text-gray-50 bg-neutral-900 rounded-[32px] max-md:px-5 max-md:mt-10 max-md:mr-2.5 max-md:max-w-full">
          <div className="flex flex-wrap gap-5 justify-between items-start w-full max-w-[1126px] max-md:max-w-full">
            <p>DSA</p>
            <div className="flex flex-col items-start mt-8">
              <div className="text-base font-semibold leading-7 uppercase">
                Solutions
              </div>
              <div className="self-stretch mt-4 text-base leading-7 max-md:mr-0.5">
                SaaS Hosting
              </div>
              <div className="mt-4">Platform</div>
              <div className="self-stretch mt-4">Desktop App</div>
              <div className="self-stretch mt-4">Mobile Web App</div>
            </div>
            <div className="flex flex-col items-start mt-8">
              <div className="self-stretch font-semibold uppercase">
                Documentation
              </div>
              <div className="mt-6">Product</div>
              <div className="mt-4">Developers</div>
              <div className="mt-4">Public API</div>
              <div className="mt-4">Docker</div>
            </div>
            <div className="flex flex-col items-start self-end mt-8">
              <div className="font-semibold uppercase">resources</div>
              <div className="mt-6">Blog</div>
              <div className="mt-4">Merch Store</div>
              <div className="self-stretch mt-4 max-md:mr-2">Open Startup</div>
              <div className="mt-4">Embed</div>
              <div className="mt-4">Developers</div>
              <div className="self-stretch mt-4">Routing Forms</div>
              <div className="mt-4">Workflows</div>
              <div className="mt-4">App Store</div>
            </div>
            <div className="flex flex-col items-start mt-8 whitespace-nowrap">
              <div className="self-stretch font-semibold uppercase">
                Company
              </div>
              <div className="mt-6">About</div>
              <div className="mt-4 text-base leading-7">Privacy</div>
              <div className="mt-4">Terms</div>
              <div className="mt-4">License</div>
              <div className="mt-4">Security</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
/** <div className="self-center mt-32 text-8xl tracking-tighter text-center leading-[93px] text-neutral-900 max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
            Scheduling that adapts to any business
          </div>
          <div className="flex relative flex-col self-center mt-14 w-full max-w-[1050px] max-md:mt-10 max-md:max-w-full">
            <div className="flex absolute -right-6 -bottom-14 z-0 gap-5 px-8 py-9 max-w-full text-xl font-semibold leading-none uppercase bg-gray-50 border-2 border-solid border-neutral-900 h-[90px] left-[842px] rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] text-neutral-900 w-[232px] max-md:px-5">
              <div className="grow shrink w-[133px]">Learn more</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/43bac2022d2bdacf8c9f863f275ccfaf315b25fa9ba0e690188ad2b5191bd00e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 self-start mt-1.5 aspect-square w-[15px]"
              />
            </div>
            <div className="flex overflow-hidden z-0 items-start pb-6 w-full text-base font-semibold leading-none text-center uppercase text-neutral-900 max-md:max-w-full">
              <div className="flex overflow-hidden flex-wrap gap-5 justify-between min-w-[240px] w-[1050px] max-md:max-w-full">
                <div className="pt-4 pr-6 pb-5 pl-7 text-gray-50 border-2 border-solid bg-neutral-900 border-neutral-900 rounded-[32px] max-md:px-5">
                  Doctors → Patients
                </div>
                <div className="pt-4 pr-7 pb-5 pl-7 border-2 border-dashed bg-zinc-100 border-neutral-900 rounded-[32px] max-md:px-5">
                  Companies → Candidates
                </div>
                <div className="px-6 pt-4 pb-5 border-2 border-dashed bg-zinc-100 border-neutral-900 rounded-[32px] max-md:px-5">
                  Teachers → Students
                </div>
                <div className="pt-4 pr-6 pb-5 pl-7 border-2 border-dashed bg-zinc-100 border-neutral-900 rounded-[32px] max-md:px-5">
                  Experts → Fellows
                </div>
              </div>
            </div>
            <div className="overflow-hidden z-0 p-0.5 w-full rounded-2xl border-2 border-solid border-neutral-900">
              <div className="flex gap-5 max-md:flex-col">
                <div className="flex flex-col w-[71%] max-md:ml-0 max-md:w-full">
                  <div className="flex overflow-hidden flex-col justify-center px-8 py-12 w-full border-r-2 border-neutral-900 text-neutral-900 max-md:px-5 max-md:max-w-full">
                    <div className="flex flex-wrap gap-4 items-start">
                      <div className="flex flex-col p-8 bg-white rounded-2xl border-8 border-solid border-neutral-900 min-w-[240px] w-[279px] max-md:px-5">
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b9fc14d6113e6319c3a15d79db3a69b02ab77062e1b94b3037949d101232c3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                          className="object-contain rounded-full aspect-square w-[52px]"
                        />
                        <div className="flex flex-col pt-5 pr-7 pb-px max-md:pr-5">
                          <div className="text-lg font-medium leading-loose">
                            Julian Erics, MD
                          </div>
                          <div className="mt-3 text-base leading-6">
                            Licensed therapist with 10 years of experience.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col p-8 bg-white rounded-2xl border-8 border-solid border-neutral-900 min-w-[240px] w-[374px] max-md:px-5">
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/8fa8e95822ff436980e775eb7033d08c2c610cf44db4ce7b51945d319dadd975?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                          className="object-contain rounded-full aspect-square w-[52px]"
                        />
                        <div className="flex flex-col pt-5 pr-1.5 pb-px">
                          <div className="text-xl font-medium leading-none">
                            Lawrence Hunter, MD
                          </div>
                          <div className="mt-3 text-base leading-6">
                            Cardiologists from California focussing on fitness
                            and performance
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[29%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow justify-center items-start px-9 py-20 w-full bg-white text-neutral-900">
                    <div className="flex flex-col pr-9 pb-px max-md:pr-5">
                      <div className="text-3xl font-bold leading-none">
                        Telemedicine
                      </div>
                      <div className="mt-2 text-xl leading-8">
                        Build Telemedicine to allow patients to book
                        appointments with doctors and therapists.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-10 items-center self-center mt-64 w-full text-6xl text-center leading-[62px] max-w-[1156px] text-neutral-900 max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/447989481ab3914dc4b72838a6f3b8a39f2408fd19f4b3cc5ca02fb3181ddbe6?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
              className="object-contain shrink-0 self-stretch my-auto aspect-[1.15] w-[68px]"
            />
            <div className="grow shrink self-stretch w-[817px] max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
              &quot;cal.com (@calcom) is awesome AND built on open source&quot;
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d620f047542f8c0fe6ff0739a069c916b6f4f877fe492882fe0ee838bb7dbf34?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
              className="object-contain shrink-0 self-stretch my-auto aspect-[1.15] w-[68px]"
            />
          </div>
          <div className="flex gap-5 self-center mt-24 max-w-full text-xl font-medium leading-loose text-neutral-900 w-[204px] max-md:mt-10">
            <div className="grow my-auto">Andy Randall</div>
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/cf3cd9594961f192afa643e1c3661b6d1e57853ca5cec3e6fc472a5c8f910766?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
              className="object-contain shrink-0 w-14 rounded-full aspect-square"
            />
          </div>



            <div className="flex z-10 items-start pt-96 pb-24 mt-72 text-lg font-semibold leading-none text-center text-gray-50 uppercase px-[623px] max-md:px-5 max-md:pt-24 max-md:mt-10 max-md:max-w-full">
          <div className="pt-4 pr-9 pb-5 pl-9 border-2 border-solid bg-neutral-900 border-neutral-900 rounded-[32px] max-md:px-5">
            Show more +
          </div>
        </div>
        <div className="flex flex-wrap gap-6 items-start mx-9 mt-0 max-md:mt-0 max-md:mr-2.5">
          <div className="flex flex-col pb-48 min-w-[240px] w-[325px] max-md:pb-24">
            <div className="flex flex-col items-start p-7 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5">
              <div className="flex gap-4">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e8a8e8a86de9648dadb58609ddc17d6e564223bdec6704968c18b23e00641eef?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col self-start pr-1 pb-px">
                  <div className="text-xl font-medium leading-none text-neutral-900">
                    Guillermo Rauch
                  </div>
                  <div className="text-lg leading-loose text-gray-400">
                    @rauchg
                  </div>
                </div>
              </div>
              <div className="mt-2.5 text-xl leading-7 text-neutral-900">
                Coolest domain. Check
                <br /> Coolest mission. Check
                <br /> Coolest product. Check
                <br />
              </div>
              <div className="flex flex-col self-stretch mt-2.5 w-full text-gray-400">
                <div className="flex gap-5 items-start pr-28 pb-px text-sm leading-6 max-md:pr-5">
                  <div>5:48 PM</div>
                  <div>Sep 15, 2021</div>
                </div>
                <div className="flex gap-4 items-start py-px pr-14 mt-4 w-full text-base leading-relaxed whitespace-nowrap max-w-[273px] max-md:pr-5">
                  <div className="flex gap-2 self-start">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/4caaa466ade7376d4c85792ba099808aa4bd5cc0b3a9296c1b17aa5dab4da7f8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                      className="object-contain shrink-0 my-auto w-5 aspect-[1.54]"
                    />
                    <div>36</div>
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/581901f9a14c023efd51de7a15499f2e495ed2cdabf86ede5c1326413c494f41?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-4 aspect-[1.23]"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col px-7 pt-7 pb-24 mt-6 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5 max-md:pb-24">
              <div className="flex gap-4 pr-14 w-full max-md:pr-5">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/5238caac4d3c739933cb94662af8db10c3413cd8ea12491bb867c1d1725ce15a?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col pr-px pb-px my-auto">
                  <div className="text-xl font-medium leading-none text-neutral-900">
                    Matt Galligan
                  </div>
                  <div className="text-lg leading-loose text-gray-400">@mg</div>
                </div>
              </div>
              <div className="mt-2.5 text-2xl leading-7 text-neutral-900">
                The more tools I use like @logseq @raycastapp and @calcom the
                more I believe in the power of an extension platform. Being able
                to tailor a tool to fit my needs is huge.
                <br />
                <br /> So: can we please do the above for an email app, contacts
                app?
                <br />
              </div>
            </div>
          </div>
          <div className="flex flex-col pb-80 min-w-[240px] w-[325px] max-md:pb-24">
            <div className="flex flex-col p-7 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5">
              <div className="flex gap-4 self-start">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/b4326fa27cc190ed2f1aedf7b331020f40900156584dcad038fb8edfd03400d2?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col self-start pr-2 pb-px">
                  <div className="text-xl font-medium leading-none text-neutral-900">
                    Thomas Paul Mann
                  </div>
                  <div className="text-lg leading-loose text-gray-400">
                    @thomaspaulmann
                  </div>
                </div>
              </div>
              <div className="mt-2.5 text-xl leading-7 text-neutral-900">
                I'm already rocking the new @calcom extension to coordinate my
                meetings 😎
                <br />
              </div>
              <div className="flex flex-col mt-2.5 w-full text-gray-400">
                <div className="flex gap-5 items-start pr-32 pb-px text-sm leading-6 max-md:pr-5">
                  <div>6:19 AM</div>
                  <div>Sep 7, 2022</div>
                </div>
                <div className="flex gap-2 items-center py-px pr-14 mt-4 w-full text-base whitespace-nowrap max-md:pr-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/af57ea4d4c399c5917eab94beeab03384a4abd5d15dbd2f7ff55b296f97fe01c?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.54]"
                  />
                  <div className="self-stretch">3</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d1e9bcfe565f9d0ec1675b17b2f0203c7af230c6a50280736193cad2d622ce9?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.23]"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col p-7 mt-6 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5">
              <div className="flex gap-4">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/7e2d833f06b7e54f7827108f2f64d3ddfbbb49220bd0806e03fdbbdaeffd11a3?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 my-auto w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col pr-6 pb-px">
                  <div className="text-2xl font-medium leading-7 text-neutral-900">
                    Farhaj May00n (in Dilli 🇮🇳)
                  </div>
                  <div className="text-lg leading-loose text-gray-400">
                    @farhajmayan
                  </div>
                </div>
              </div>
              <div className="mt-2.5 mr-5 text-2xl leading-7 text-neutral-900 max-md:mr-2.5">
                As of today I'm officially a @calcom maxi. The product is epic.
                @peer_rich where can I buy merch??
                <br />
              </div>
              <div className="flex flex-col mt-2.5 w-full text-gray-400">
                <div className="flex gap-5 items-start pr-28 pb-px text-sm leading-6 max-md:pr-5">
                  <div>6:31 AM</div>
                  <div>Feb 17, 2022</div>
                </div>
                <div className="flex gap-2 items-center py-px pr-14 mt-4 w-full text-base whitespace-nowrap max-md:pr-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f3340ae7b35ac159f745c6b3de25478f842a5b8d8601776214093ad7738d349?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.54]"
                  />
                  <div className="self-stretch">3</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/f637dc4183cacaf79b51a80531d8c06cc0d4f63483020fd1c63370040a20ff62?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.23]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-w-[240px] w-[325px]">
            <div className="flex flex-col p-7 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5">
              <div className="flex gap-4 self-start whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/530eba834cff237810c438be5913a133944db0114efeb1388cc3908821e14263?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col self-start pr-0.5 pb-px">
                  <div className="text-xl font-medium leading-none text-neutral-900">
                    KP
                  </div>
                  <div className="text-lg leading-loose text-gray-400">
                    @thisiskp_
                  </div>
                </div>
              </div>
              <div className="mt-2.5 text-2xl leading-7 text-neutral-900 max-md:mr-2">
                SaaS is eating the world
                <br />
                <br /> And Open Source is eating SaaS for breakfast
                <br />
                <br /> A lot of alternatives are rising up
                <br />
                <br /> Here are a few:
                <br />
                <br /> Calendly - @calcom
                <br /> Airtable - @baserow
                <br /> Zapier - @n8n_io
                <br />
                <br /> What else?
                <br />
              </div>
              <div className="flex flex-col mt-2.5 w-full text-gray-400">
                <div className="flex gap-4 items-start pr-28 pb-px text-sm leading-6 max-md:pr-5">
                  <div>12:27 PM</div>
                  <div>Jun 21, 2022</div>
                </div>
                <div className="flex gap-2 py-px mt-4 w-full text-base whitespace-nowrap">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/fa0534f3ec1a8132559bd2b6024af779cba4a27deb29938a75d18bbb1070c152?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto w-5 aspect-[1.54]"
                  />
                  <div className="grow shrink w-[241px]">9</div>
                </div>
              </div>
            </div>
            <div className="flex items-start px-7 pt-7 pb-72 mt-6 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5 max-md:pb-24">
              <div className="flex gap-4 items-start py-px pr-14 min-w-[240px] w-[273px]">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/06fa2258185639c964fc974f73502db5cdb43fe59951ea01030eeb939a6c3595?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 w-14 rounded-full aspect-[1.06]"
                />
                <div className="flex flex-col pr-px pb-px">
                  <div className="text-xl font-medium leading-none text-neutral-900">
                    joel ⛈
                  </div>
                  <div className="text-lg leading-loose text-gray-400">
                    @jhooks
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col pb-52 min-w-[240px] w-[325px] max-md:pb-24">
            <div className="flex flex-col p-7 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5">
              <div className="flex gap-4 self-start whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/353f3b6ad4bf6a22b3db876fc3f21ea9fc1599931a1f93fb19113bc4e726e4ce?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col self-start pr-px pb-px">
                  <div className="text-xl font-medium leading-none text-neutral-900">
                    Sharath
                  </div>
                  <div className="text-lg leading-loose text-gray-400">
                    @5harath
                  </div>
                </div>
              </div>
              <div className="mt-2.5 text-xl leading-7 text-neutral-900 max-md:mr-2.5">
                Probably the first calendar app in web3 space!
                <br />
                <br /> Great work @peer_rich and @calcom team!
                <br />
              </div>
              <div className="flex flex-col mt-2.5 w-full text-gray-400">
                <div className="flex gap-4 items-start pr-32 pb-px max-md:pr-5">
                  <div className="text-sm leading-6">1:51 PM</div>
                  <div className="text-base leading-relaxed">Feb 8, 2022</div>
                </div>
                <div className="flex gap-2 items-center py-px pr-14 mt-4 w-full text-base whitespace-nowrap max-md:pr-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/866fdd1df97ea1db89f88bbdf243bca1da228b9df4c898269ecc127cf8ef2661?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.54]"
                  />
                  <div className="self-start">2</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/3989dc9ed1ef4afbde9a0a8ed6bf776cbefc66b5393bbd3a6010b4c80843a53f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.23]"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col px-7 pt-7 pb-24 mt-6 w-full bg-gray-50 border-2 border-solid border-neutral-900 max-w-[325px] rounded-[32px] max-md:px-5 max-md:pb-24">
              <div className="flex gap-4 pr-14 w-full max-md:pr-5">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/34273711fcea5a345feecf76c9aeac7b7685e6fbd3b80070c5fb930d881b43c8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col self-start pr-1.5 pb-px">
                  <div className="text-xl font-medium leading-none text-neutral-900">
                    Talha Altinel
                  </div>
                  <div className="text-lg leading-loose text-gray-400">
                    @mr_wormhole
                  </div>
                </div>
              </div>
              <div className="mt-2.5 text-xl leading-7 text-neutral-900">
                I am amazed by @calcom (Calendso) 's success, I was quite
                pessimistic that it would take off as a project in 2020 but here
                we are using Calendso and trying to self-host with improved
                documentation 🤣🤣
                <br />
              </div>
            </div>
          </div>
        </div>
        */
export async function loader({ request, params, placeholder }) {
  return null
}


export const meta: MetaFunction = () => {
  return [
    { title: 'Home Page | Dealer Sales Assistant' },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',

    },
  ];
};

export const logos = [
  {
    src: activix,
    alt: 'Activix',
  },
  {
    src: "https://searchlogovector.com/wp-content/uploads/2020/04/ski-doo-logo-vector.png",
    alt: 'Ski-Doo',
  },
  {
    src: "https://searchlogovector.com/wp-content/uploads/2020/04/sea-doo-logo-vector.png",
    alt: 'Sea-Doo',
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/500px-Suzuki_logo_2.svg.png",
    alt: 'Suzuki',
  },
  {
    src: "https://www.bmw-motorrad.ca/content/dam/bmwmotorradnsc/common/mnm/graphics/bmw_motorrad_logo.svg.asset.1585209612412.svg",
    alt: 'bmw',
  },

  {
    src: manitouIndex,
    alt: 'Manitou',
  },

  {
    src: "https://www.brp.com/content/dam/global/logos/brands/logo-brp.svg",
    alt: 'brp',
  },
  {
    src: canamIndex,
    alt: 'canam',
  },
  {
    src: harleyDavidson,
    alt: 'h-d',
  },

  {
    src: "https://media.triumphmotorcycles.co.uk/image/upload/f_auto/q_auto/SitecoreMediaLibrary//_images/apple-touch-icon-180x180.png",
    alt: 'Triumph',
  },
  {
    src: kawasaki,
    alt: 'Kawasaki',
  },
  {
    src: "",
    alt: 'Yamaha',
  },
  {
    src: "",
    alt: 'Honda',
  },
  {
    src: "",
    alt: 'Indian',
  },


]

export function FAQ() {
  return (
    <div className='text-neutral-900 '>

      <legend className="-ml-1 px-1 text-lg font-medium">FAQ</legend>
      <div className="font-semibold">Q: How much set-up am I required to do?</div>
      <p className='px-[8px] pt-[5px] text-left text-sm    '>
        Aside from setting up your employees, virtually none. The server and database will be hosted off site that we will set up for you. Once up and you will have full access to your new crm to start taking advantage of it. If you would like your line-up included for the quoting capabilities, we just require your dealer binder, if it's a brand we already do not have. If your not technically savvy or do not have a tech dept of some kind, we can set everything up for you, even your employee accounts. If you would like to take it a step farther and include parts, accessories and such for your sales team to help increase sales while they sell their units, let us know and we can discuss it.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">
        Q: You don't have as big as a customer base using this crm in comparison to other brand names, how can I trust it will do the job?
      </div>
      <p className='px-[8px]   text-left text-sm    selection:'>
        You think yours is actually doing the job? 9.5 people out of 10 reading this... unfortunately your crm is costing you a lot of money. Exponentially more, than you could even imagine. You will throw away more money by not completely switching in salary costs alone, then trying and failing.
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        Don't take my word for it, do the math.
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        I have. I almost went crazy when I started to dig deep into this. For example, I thought I couldn't do math at one point... because theres no way I waste that much time every year... it's not possible. Doing the same math, having different people check it without telling them what it's for. Running my math through ai to see if I made a mistake. Even googling my math to make sure I hadn't made any errors. Like spending days on end in my free time... on the simplest of math problems because I could not understand how I could waste that much time every day, month or year. I push myself to be the best, it made no sense. Nope, everything checked out and it needed to change, fast.
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        Measure each and every single process, but you can't get mad at your employees/colleagues due to the results you come to. It's not their fault, no matter how much you try to justify it. And be honest with the numbers, by cheating the numbers and making them smaller then they should. The only person that would harm, is you. Yes, I know sales people can cheat systems as can any employee in any position can, but they cant keep it up long term in a way that would benefit them for more than a 2 week period. Same as any role in the dealer, the job is the job. There's almost no way to change that. The work needs to be done, properly. I've been a sales manager for years, sales person for years, assistant gm for years, gm for years, sales coach, etc. There's no way to get out of the things needed to get the job done. I've tried and lets be honest you probably have too.
      </p>
      <p className='px-[8px]   text-left text-sm   '>
        How people go about the sales process can be different yes, but when you chip away the differences of how one person does it to the next. The fundamentals are still there, if they're successful. And it's the same for every role in the dealer.
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        So... we just make their job easier. That's the secret. So easy, that they wouldn't even know they're being more effecient. Wouldn't even cross their mind, they would just be so relieved not to have to deal with the hell the other crm put them through whenever they needed to do something. These aren't my words either.
      </p>
      <p className='px-[8px]   text-left text-sm   '>
        Word of caution though before you do the math. Be ready. Be ready to not only be blown away by not only the amount of time wasted, but also the amount of profits. But be ready to get angry. The numbers get big, fast. I know how much it takes to earn every dollar in a business/dealer. To the average person 100k wasted in a, what would seem like a big business/dealer to the average person, might seem too insignificant to even bother worrying about it. But I know how much it takes to make 100k in profits and what it can be used for, but you only just measured one role or a portion of one before you start to realize... what about the others or the scaling problem because you have 10 people doing that one job? ... Fuck. So that small 100k just turned into a million or more in profit that could have been kept in the company, maybe? Maybe you wanted to expand? Hire more staff? Offer bigger salaries to help employee retention? Which in turn cuts down a lot of other costs. It's kind of hard when you didn't even know this money was there to begin with.

      </p>

      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">Q: How secure will it be / how fast will it be?</div>
      <p className='px-[8px] pt-[5px] text-left text-sm   '>
        Each dealer will have their own database and server. That way if one dealer is compromised, none of the other dealers would have to suffer due to their security event. This same reason also helps the overall speed of each dealers CRM because no two dealers share the same resources. During peak times, say for example at 9 am when every dealer opens, instead of a bottle neck of traffic slowing you down when logging in or even worse not letting you because everyone is logging in at once, instead each will have fast loading times as if you had your very own custom crm solution.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">Q: Can you actually quote a price in 60 seconds?</div>
      <p className='px-[8px]   text-left text-sm  '>
        No, it's even quicker than that. While setting the time frame any lower might seem unattainable to many, our application is designed to provide pricing information in a matter of seconds. In today's fast-paced world, some automotive brands require salespeople to sift through a massive book with over 500 pages just to discuss vehicle options, which can consume an entire hour. Our application eliminates this time-consuming process by putting almost everything you need right at your fingertips. It doesn't just provide speedy quotes; it also offers additional features that accelerate your workflow, allowing you to serve more customers efficiently. It's not solely about increasing sales but also about aiding more people in a timely manner. I've witnessed customers leaving dealerships because they couldn't find assistance. While it's unfortunate for the dealer, no salesperson should spend three hours with a customer unnecessarily. They claim to be selling, but, in reality, they aren't. Some customers even have to wait weeks to receive a price quote, and that's a situation we aim to change.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">Q: Is it easy to use? Some of my sales guys are too old for technology.</div>
      <p className='px-[8px]    text-left  text-sm  '>
        A: Absolutely, ease of use is one of our top priorities. Our application is designed to be user-friendly, making it accessible to sales professionals of all ages, including those who may not be as tech-savvy. It's much simpler than the processes they are currently accustomed to. They no longer need to search for pricing information because it's readily available. Even for brands with complex lists of options, our application presents the information in a clear and easy-to-read format, benefiting both salespeople and customers. This reduces the need for extensive training on individual units and their options. To illustrate, brands like Manitou and BMW, which are known for their intricate offerings, become straightforward with our application. You simply select a unit, navigate through the list of options and accessories tailored to that unit, and our application generates a quote. It provides payment plans, including weekly, bi-weekly, and monthly options, factoring in local taxes or offering tax-exempt calculations for those who prefer it. Additionally, there's a field for out-of-towners with different tax rates. Furthermore, we include pre-loaded dealer options such as warranties and VIN etching, so if a customer insists on knowing the price with specific add-ons before making a decision, you already have that information at your fingertips.  Our system also allows you to customize finance packages instantly by adjusting up to 11 fields for dealer options. This empowers you to provide a tailored and hassle-free financing solution in real-time, often more efficiently than the finance department.   For those challenging phone inquiries where customers provide incomplete information, our application solves the problem. It's common for customers not to disclose their location or tax status, leading to rework and wasted time. With our application, much of this work is already completed, significantly reducing the time it takes to provide a quote. In some cases, it can take dealers 45-60 minutes or even longer to deliver a price; our application streamlines this process for immediate results.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">Q: Does it just produce prices?</div>
      <p className='px-[8px]    text-left text-sm   '>
        A: Not anymore, our application goes far beyond simply generating prices now. It not only enhances your entire sales process up to the point where it seamlessly integrates with your CRM, if you choose to keep the one you currently have. It also stream lines each and every employees day to day work duties. Here's how it improves your workflow:   Clear and Comprehensive Explanation: Our application excels at explaining vehicle options, prices, and associated fees in a way that's easy to understand. This clarity benefits all customers, including those who might find complex information confusing. You can confidently present pricing without interruptions or hesitation from customers, leading to a smoother sales experience.  Control and Professionalism: Having a tool that provides such control over the sales process elevates your sales game. You won't experience interruptions due to customers struggling to grasp the information. You can maintain a professional and uninterrupted dialogue, making your interactions more efficient and productive.  Streamlined Access to Information: Our application offers features that simplify the process even further. Need to access a spec sheet from the manufacturer's site? Instead of navigating multiple pages, it's just one click away. If a customer is interested in a color that's not in stock, you can quickly show them the model page on the manufacturer's site.   Efficient Communication: In cases where a customer has left without making a purchase, our application provides pre-made templates that can be customized or used as-is. These templates include a variety of email breakdowns tailored to different types of customers. Whether they need payment details or a comprehensive list of options, you can send the information with a single click, saving you valuable time.  In essence, our application is designed to optimize your entire sales process, making it more efficient, professional, and customer-friendly from start to finish.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">Q: Will it really help my sales out?</div>
      <p className='px-[8px]   text-left text-sm   '>
        A: Absolutely, we guarantee it will make a significant difference in your sales process. In the automotive industry, it's surprising how few products genuinely assist salespeople or any other role in the dealer beyond enhancing their skills and salesmanship. Most tech solutions either extend the sales process or add more complexity. However, our application is a game-changer because it complements your existing sales process and skills, simplifying the entire journey.   Here's how it can truly benefit you and your team:  Streamlined Process: By simplifying your workflow, it allows you to focus 100% of your mental energy on closing the sale. You can engage with customers with confidence, fewer headaches, and access to crucial information. For example, if a customer wants to compare the prices of different options, you can provide this information instantly, eliminating unnecessary stress.  Increased Confidence: Confidence is key in sales, and our application empowers you to navigate your interactions with customers more confidently. You'll have the tools at your disposal to provide information quickly and accurately, which builds trust and credibility with potential buyers.  Information Accessibility: In a world where information is readily available online, it's essential to equip salespeople with the tools they need to meet customer expectations. Our application gives you instant access to the information customers seek, eliminating the need for customers to search elsewhere for the details they want.  Customer-Centric Approach: By arming yourself with a tool that provides information efficiently and effectively, you can take a more customer-centric approach to sales. It's about giving customers what they need when they need it, which can lead to higher customer satisfaction and conversion rates.  In summary, our application is designed to make your job easier and more productive by simplifying your sales process and giving you the tools to provide customers with the information they desire. It's a win-win situation that benefits both sales professionals and customers, ultimately driving more sales and increasing overall satisfaction.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">Q: I don't think my gm would let me use this.</div>
      <p className='px-[8px]   text-left text-sm   '>
        It's understandable to have concerns about introducing new tools or changes in your dealership, especially if it involves management approval. Here are some points you can consider when discussing the implementation of this app with your GM:
        <li>Increased Sales Efficiency: Emphasize how the application can significantly improve sales efficiency. It streamlines the sales process, allowing salespeople to provide better and more detailed information to customers quickly. This efficiency can lead to more sales and a better customer experience.</li>
        <li> Enhanced Finance Management: Highlight that the app also benefits finance managers by simplifying the process of adjusting financing rates and options. This means faster turnaround times and less time spent on administrative tasks.</li>
        <li>Reduced Interruptions: Explain that the application can reduce interruptions for both salespeople and management. With quicker access to pricing information, there's less need for constant back-and-forth between sales and management to finalize deals. This, in turn, can lead to more productive workdays for everyone.</li>
        <li>
          Improved Customer Satisfaction: Mention that by using the app, you can provide customers with more accurate and timely information. This can enhance overall customer satisfaction and make the dealership more competitive in a digital age where customers expect fast responses.
        </li>
        <li>
          Trial Period: Suggest a trial period where the GM and the team can test the application's effectiveness firsthand. This will allow them to see the benefits in action and make an informed decision.
        </li>
        <li>
          Training and Support: Offer to provide training and support for the entire team to ensure a smooth transition to using the application. Show that you're committed to making the implementation process as easy as possible.
        </li>
        <li>
          Competitive Advantage: Emphasize how this tool can give your dealership a competitive advantage in the market. In a highly competitive industry, having a tool that streamlines the sales process and improves customer service can be a game-changer.
        </li>
        <li>
          We can continue but will end it here...
        </li>
        Ultimately, it's important to present the application as a solution that benefits the dealership as a whole, from sales and finance to management and customer satisfaction. Showing the potential advantages and offering a trial period can help address any initial concerns and make a strong case for its adoption. But to be honest, your probably going to get a no which is why it's made the way it is. When our crm is connected with another, its as if you threw a new coat of paint on, underneath the paint it does the same thing when interacting with the other crm, but with a turbo and supercharger installed. So you get all the benefits of a improved crm, but don't actually have to use the one you have been provided. Another way of looking at it is, its a new skin with better features and the connected crm wouldn't even be able to tell the difference. If we don't currently work with your crm, let us know and we'll get it hooked up. The only issue we have run into so far, one company just didn't have enough employees to deal with the workflow. All the work was done on our end to hook it up but took more than 6 months to finnaly get it all done. If this outlier of a situation happens to you, we'll refund your subscription, and let you know when its completed so you can come back with no issues or hassles. It only takes a day for us to complete the work needed so its no big deal.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />
      <div className="font-semibold">Q: How can this help other roles in the dealer?</div>
      <p className='px-[8px]   text-left text-sm   '>
        Have you ever asked any of your employees / colleagues about the crm they use? If you got an honest answer, you would come to the conclusion that they hate it more than the sales people. Fortuantly the sales people get paid commission and the crm helps them make that commission. No matter how much they hate it, its a necessary evil to completing their tasks, as quickly as they can given the tools at their disposal. The big take away, and its a massive negative one at that, everyone else works on hourly or salary pay structures. They are not incentivized to use the crm to help them make money. It does not help that the crms naturally make their jobs worse.
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        The worst I've seen it was when I asked my service manager if a part was in and if so when can we get it on the schedule to rectify the problem the oem had given us. The customer was pissed, rightly so and I was trying to ask all the questions needed before moving on.
      </p>
      <p className='px-[8px]   text-left text-sm   '>
        A hundred or so clicks of her button on the computer and 5 minutes later, I said. 'We've known each other for a long time, so please don't take offense to this question because im geniunly curious. But what the fuck are you doing? Are you still trying to find out if we have the part need to fix this issue? It's been over 5 minutes and I've seen you browse atleast 20-30 pages so far, this cannot be what you need to do to get access to this information.'
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        She turned, looked at me with a defeated expression and said yes.
      </p>
      <p className='px-[8px]   text-left text-sm   '>
        I'm sorry but your service manager has better things to do, even your lowest paid employee has better things to do than have to go through that process each and every single time.
      </p>
      <p className='px-[8px]   text-left text-sm     '>
        I remember the dot com boom, it came with a promise... to make our lives easier. So why is it making it harder, almost 30 years later? The biggest reason that comes to mind, the people designing them... don't use them. I worked at a job when I was younger that had a portion of it, resemble working in a call center. We got quick at doing sales calls, like insanely quick. Money was on the line. We worked through those calls faster than I can get through any modern crm system that I have had the chance at using at any dealer. We had flip open cell phones... and all of our contacts were printed in binders. We had our processes to make going through the calls quick, but that was 20 years ago. Your telling me technology can't replicate that. Not till I made it so, apparently.
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        Even though these programmers/crm companies may take your suggestion to make it better, if its even implemented, it still would not be as refined as a team who made it and then used it day to day in their own roles at the dealership. At the end of the day, that programmer has one job. To complete his own job as quickly as possible and move on to the next task or project. The dashboard we made, went through over 100 iterations before landing on the one we have now. Still, it continues to see updates to areas that would cut down your time using it for one reason or another. I should say dashboard's because ours, are role specific. No two roles in a dealership works with the same information, so why do crms usually only make one dashboard? Then make the employees force it their role. Sales managers dash? You first see all of your teams sales statistics, whos achieving their goals, whos not and needs help. Accessories manager, quick overview of sales figures and then goes into inventory management. What's in stock, whats not. What needs to be ordered when. You think the service manager needs to see the information from those two roles? No.
      </p>
      <p className='px-[8px]   text-left text-sm    '>
        Personally, I've always made a joke about crms. They're designed and sold to one person in the dealer... the owner. That's it, and unfortunatly more often than not it's true. The owner doesn't need to be sold on how each roles dash or processes will actually help them with their job. Sales people selling crms, focus on how it will help the owner control the dealer and foresee problems before they become one. The sales persentation ends there 9 times out of 10. No one ever thinks deep enough on how it will effect each and every single person / role in the dealer. Can't blame them, they're busy with the things they need to do as well. But that time has come to end.
      </p>
      <Separator className="my-4 border-border w-[95%] mx-auto" />

    </div>

  )
}

export function Reason() {
  return (
    <div className='grid gap-4 w-2/3  text-neutral-900 mx-auto'>
      <p>
        I realized I hadn’t been learning anything new for 2-3 years, despite constantly attending sales training, refining scripts, and reading extensively. Whether I invested in training from some of the biggest names in the industry or participated in programs set up by the auto brands for their dealer networks, I was doing at least 2-3 trainings annually. Yet, nothing felt fresh.
      </p>
      <p>
        For a long time, I struggled to find anything new to apply. I’ve been in sales for 12 years, always pushing to improve every step of the way. When I first started, I was terrible at sales, hitting rock bottom. But after relentless dedication to reading, training, and learning, everything eventually clicked. I went from being last in the sales rankings at my previous organization to first, right before I moved on.
      </p>
      <p>
        Because of that journey, I made a commitment to never stop improving. In an industry obsessed with salesmanship, techniques, and closing strategies, the breakthrough came when I encountered a problem at the dealership I was working at.
      </p>
      <p>
        I was hired to focus solely on sales generated through online leads. I loved the challenge—most of the leads were terrible, but there were many. Unlike the walk-ins or phone calls, each sale felt like a grind, requiring precise scripting and diligent follow-ups.
      </p>
      <p>
        The real issues, though, stemmed from the process. We had too many bad leads, and it took forever to get quotes. Only the owner and sales manager were authorized to generate them, and sometimes, my quotes would sit on their desks for over 24 hours, while they prioritized walk-ins or phone calls. It made no sense—whether a customer walks in, calls, or contacts us online, they all deserve the same level of urgency.
      </p>
      <p>
        On top of that, the quotes often contained errors, and the deal sheets were terrible to present. The complexity of some product lines, especially Manitou, added to the frustration. Pricing units took hours, and if you can’t price it or check availability quickly, how can you upsell?
      </p>
      <p>
        I needed a solution to quote units quickly and without errors.
      </p>
      <p>
        After hundreds of iterations, I developed a web-based quoting tool that worked flawlessly. It allowed me to manipulate every aspect of the deal and present it to customers seamlessly. In fact, I preferred using my tool even after receiving quotes from management. It was better than what any finance manager had.
      </p>
      <p>
        Once that project was complete, I felt stuck again, like I wasn’t improving. Then, another issue arose. I was leading in sales, but my manager told me to catch up on my CRM calls. I couldn’t believe it—should I focus on making sales or reducing a CRM number? He insisted on the latter.
      </p>
      <p>
        Frustrated, I mass-emailed clients about used units, and that’s when I realized how time-consuming the CRM process was. I timed myself, did the math, and saw how much time was being wasted on trivial tasks. It was ridiculous. How was this process not faster?
      </p>
      <p>
        I initially just wanted to reskin our CRM dashboard, which was doable. But while waiting for integration with the CRM (which took nearly a year), I ended up coding 50% of it myself. During that time, I learned how much time we, as salespeople, waste—and how much time is wasted across other roles too.
      </p>
      <p>
        The numbers were staggering. When I crunched the numbers, I realized the CRM brands themselves were part of the problem. The inefficiencies within the industry were costing big brands over $100 million in salaries every year. It sounded unbelievable, but the more I checked my math, the more I realized it was accurate.
      </p>
      <p>
        This experience reinforced my belief in lifting others up. Even during that 2-3 year stretch where I wasn’t learning anything groundbreaking, I learned from small adjustments—refining scripts and presentations by observing my colleagues. These weren’t major insights on their own, but they added up.
      </p>
      <p>
        When you’re the best, how do you compete? By creating your competition. I’m confident that no matter how many people I help rise to my level, I can push harder and still come out ahead.
      </p>

    </div>
  )
}
export function Why() {
  return (
    <div className='grid gap-4 w-3/4 mx-auto'>
      <p>Outside of sales training, what can you do that would have an impact on your team and sales?</p>
      <p>I'm going to ask you to do some math with me, whether it's on your phone, paper, computer doesn't matter. I'll explain why your doing this later.</p>
      <p>Let's start with one sales person, and one process. The one we have to do more than any other.</p>
      <p>Calls - complete the call in the system, leave a note for yourself for the next time you call them and rebook the appointment so the client doesn't fall through the cracks.</p>
      <p>Now you can time yourself, but quick sales people its going to take 1 min 30 secs to 2 minutes.</p>
      <p>I'm aware you can cheat the system and do it quicker, but your just going to hurt yourself as a sales person in the long run if you take this route. Its not sustainable to be consistently quicker by doing this. When the next time the call comes around, instead of reading a simple note your now opening up previous emails and text messages. So whatever time you think you saved when you rescheduled the call, you now just added 5-10 minutes.</p>
      <p>Lets go with 2 minutes because its easier math. Now I can easily do 100 calls in a day, on average. If no one picks up, or walks in I can be done by lunch</p>
      <p>Do you see the scaling problem?</p>
      <p>100 calls x 2 minutes each = 200 minutes a day wasted doing the most menial task a sales person can do.</p>
      <p>You work 5 days a week.</p>
      <p>Punch into your calculator 200 minutes x 5 days</p>
      <p>Now this is where I explain you need to do the math, because if I just gave you the numbers... you wouldn't beleive it.</p>
      <p>1000 minutes / 60 for minutes an hour, and what is the amount of hours wasted that week by clicking a bunch of buttons you do not need to click?</p>
      <p>I'm not going to answer that, you have your calculator. Now looking at the number your probably going to google next to see if you did the math right.</p>
      <p>.... because that number cannot be right. But it is... and this whole scenario is if your at it the entire shift and lets be real 9 out of 10 sales people aren't going from wire to wire AND your average being 2 minutes. What about the people who aren't good with computers? 5-10 minutes a call.</p>
      <p>Now multiply that number by 4, for the amount of weeks in a month.</p>
      <p>Then times 12 to find out how much each sales person wastes in given year.</p>
      <p>If your a owner, multiply that number by the amount of sales people.</p>
      <p>On a four man team your wasting $108,096 on an average pay of $65,000.</p>
      <p>And if your a dealer group owner, that number can get out of hand quickly.</p>
      <p>Did you catch the biggest issue at hand? This is just one process for one sales person.</p>
      <p>Here again comes the scaling problem, our job as sales people... its nothing but processes.</p>
      <p>But you run into an issue, forcing your team to be the most effecient workers on the planet, will only get you a net workforce of 0. Because no one will want to work for you.</p>
      <p>Make it easier to be more effecient. Instead, crms today just add time to your employees days and waste your hard earned profits.</p>
      <p>Now what kind of times can we get these down to, for the average person.</p>
      <p>Less than 10 secs? If no one picks up the phone, or if its an email/text.</p>
      <p>For more complicated calls/messages, yes it will take longer, but I garantee you it's not 2 minutes. Less than 30 secs on average.</p>
      <p>Let's apply this to every single process we have though.... for every employee in the dealership.</p>
      <p>Yes we only measure the sales people... what about the rest of your staff?</p>
    </div>
  )
}

export function Mission() {
  return (
    <div className='grid gap-4 w-2/3  text-neutral-900 mx-auto'>
      <p className="-ml-1 px-1 text-lg font-medium">Mission Statement</p>
      <p className='px-[8px] pt-[5px] text-center text-sm '>
        Our mission is clear: We aim to empower salespeople everywhere with tools and resources that transcend the traditional approach of relying solely on salesmanship training. Whether it's your first day or your tenth year in sales, our goal is to provide universally accessible solutions that lead to improved sales performance.
      </p>
      <br className='my-1' />
      <p className='px-[8px]   text-center text-sm  '>
        Our commitment goes beyond streamlining sales processes. In development, we're crafting a comprehensive dashboard that significantly reduces the time required to complete customer interactions and schedule follow-ups. This dashboard is designed to seamlessly integrate with various CRM systems, ensuring that you have all the necessary information at your fingertips for well-informed follow-up calls. No more navigating between pages or seeking additional resources; everything you need will be readily available to enhance your efficiency.
      </p>
      <br className='my-1' />
      <p className='px-[8px]    text-center  text-sm '>
        We firmly reject the notion of relying on vague or mystical 'secrets' to enhance sales performance, and we challenge the idea that only seasoned oratory experts can excel in sales. There is no mystical formula to sales success; it's a matter of equipping individuals with the right knowledge at the right time in their sales journey.
      </p>
      <br className='my-1' />
      <p className='px-[8px]    text-center text-sm  '>
        We believe that every person has the potential to become a highly effective sales professional. This is not an abstract hope or wishful thinking; it's a verifiable fact. We've seen remarkable transformations, even among individuals who have faced significant challenges, such as those with criminal backgrounds. Instead of treating them with harsh judgment, we've taken a different approach, guiding them toward sales excellence and, in turn, improving various aspects of their lives.
      </p>
      <br className='my-1' />
      <p className='px-[8px]   text-center text-sm  '>
        Our approach stands in stark contrast to traditional sales presentations where the speaker hopes that attendees will absorb even a small fraction of their teachings. We don't aspire for a handful out of a thousand to improve. Our mission is to empower each and every person to enhance their sales skills. We firmly believe that, given the right tools and guidance, anyone can become a successful salesperson.
      </p>
      <br className='my-1' />
      <p className='px-[8px]   text-center text-sm  '>
        While we could charge premium prices similar to CRM systems once fully developed, our commitment to accessibility remains unwavering. We understand that affordability should not be a barrier to access the tools needed for continuous growth. Every salesperson deserves to have the resources required for success, a principle that drives us to offer our solution at an accessible price point.
      </p>
      <br className='my-1' />
      <p className='px-[8px]   text-center text-sm  '>
        We are committed to a simple principle: We won't offer anything that hasn't undergone rigorous testing on the sales floor. We understand that our real-world experience as current sales professionals provides our tools with a unique advantage over others in the industry.
      </p>
      <br className='my-1' />
      <p className='px-[8px]  ]  text-center text-sm  '>
        While exceptional sales coaches exist, the passage of time can sometimes lead to a disconnect from the practical realities of the sales process. We're not suggesting that you should forego further sales training; in fact, we recognize the immense value that proper training can bring when absorbed effectively.
      </p>
      <br className='my-1' />
      <p className='px-[8px]    text-center text-sm  '>
        What we promise is this: We won't present you with tools or strategies that we haven't personally used ourselves. Our commitment is rooted in the belief that only by testing and validating every aspect of our solutions in the real sales environment can we truly deliver tools that work effectively for you.
      </p>
      <br className='my-1' />
      <p className='px-[8px]    text-center text-sm  '>
        Although we currently focus primarily on the power sports industry, our vision extends far beyond. We plan to expand into the automotive industry and beyond, with a singular purpose: to assist salespeople everywhere. Our mission is to empower you and every other sales professional out there to reach new heights in your career.
      </p>
    </div>
  )
}

export function Features() {
  return (
    <div className="mx-auto flex w-[85%] justify-center">
      <ul className="mx-auto mt-2 grid gap-3 ">
        {dealerFeatures.map((feature, index) => (
          <li
            key={index}
            className="flex items-center justify-between"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer text-left text-neutral-900 ">
                  {feature.name}
                </span>
              </TooltipTrigger>
              <TooltipContent className='w-[200px] bg-background border-border text-foreground'>
                <p>{feature.description}</p>
              </TooltipContent>
            </Tooltip>
            <span>
              <FaCheck
                strokeWidth={1.5}
                className="ml-2 text-lg text-[#22ff40]"
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const dealerFeatures = [
  { name: "Dashboard", description: "Overview of your sales activities for the day, includes time saving methods that will save you 1000's of minuites over the course of the year." },
  { name: "Sales Tracker", description: "Track your sales performance" },
  { name: "Tailer made Sales Calendar", description: "Sales calendars typically suck, because the people who make them for sales people, arent sales people." },
  { name: "Quotes", description: "Generate pricing for customers in under 60 secs" },
  { name: "Script Builder", description: "Create and manage sales scripts" },
  { name: "Document Builder", description: "Generate sales documents, that are reusable for every single sale. Just need to make them once the first time, then at every sale just hit print." },
  { name: "Customer Wish List Dashboard", description: "Manage customer wish lists and get notified when it hits your inventory, so you never miss a sale again", },
  { name: "Instantly generate all your docs", description: "Generate all your docs at once without ever writing anything in again.", },
  { name: "Template Builder", description: "Create and manage templates to ensure fast follow-up times." },
  { name: "Email Client", description: "Integrated email client, so you don't have to leave the app to go over your email." },
  { name: "CRM Integration", description: "Integrate with other CRM systems, whether you already use another crm or not we can integrate our solution into any other crm to make sure you no longer waste time but don't have to switch the entire store over to a new crm in order to do so.", },
  { name: "Payment Calculator", description: "Quick payment calculator for the moments you need to be quick on your toes.", },
  { name: "Quote Builder", description: "Create and manage quotes in record timing. Can provide weekly, bi-weeekly, monthly payments in three different tax scenarios. Home Province, tax exempt, and custom taxes, to ensure you never have to redo another quote again due to the customer not being forth coming about what tax bracket they fall under." },
  { name: "Sales Presentation Page", description: "Sales presentation tool to give you a clean page to present your customer the deal in an easy to folow manner. That way your customer gets an accurate and concise quote from the get go and will have less questions while also giving you the ability to present with confidence with a straight forward approach. The customer feels more confident about the pricing with less questions, which means you waste less time explaining it to them." },
  { name: "Sales Statistics Breakdown", description: "Detailed sales statistics, to see where your at and where you can improve", },
  { name: "Hard to Soft Document Storage", description: "Store documents securely, store documents on the customers deal page so you can come back to them whenever you need them as many times as you want.", },
  { name: "Dept and General Staff Chat", description: "Internal chat for staff.", },
  { name: "Staff Scheduler / Store Hours", description: "Schedule your staff in the crm so your staff knows their schedule.", },
  { name: "Dept Leaderboards", description: "To instill an ever competitive attitude among the staff, with the ability to set goals and compare how your doing against eachother. Made in a way where you can compete, not dollar to dollar from each dept, but instead set goals attached to sales figures appropriate for each dept and see who can hit their depts goals month over month. So instead of seeing how much profit one made more than the other, which can be demotivating, it just shows how hard everyone pushed to complete their depts goals.", },
  { name: "Finance Dashboard", description: "Finance dept specific dashboard." },
  { name: "Finance Specific Processes To Streamline the Sales Flow", description: "", },
  { name: "Admin Section", description: "Administrative tools to manage your crm." },
  { name: "Manager Section", description: "Managerial tools to manage your staff and inventory" },
  { name: "Owner Section", description: "Managerial tools to manage your staff and inventory" },
  { name: "Inventory Dashboard - Automotive", description: "Manage your in stock and sold inventory." },
  { name: "Import / Export Data", description: "Any data you want at any time.", },
  { name: "Revolutionary sales to finance handoff process", description: "Never before seen in the auto industry, making the sales process seem like magic to the customer", },
  { name: "Cloud Based Setup", description: "No initial set-up or installation of any kind for our clients.", },
  { name: "API for Lead Generating Sources", description: "Want to try out a new lead generation campaign with a new company, just give them the api details and your all set.", },
  { name: "No more expensive weird, one off equipment", description: "No special inventory machines to log product, no special printers needed to print anything, no fancy scanners to scan product/unit barcodes", },
  { name: "Employee onboarding", description: "As soon as you add them, an email goes out to them explaining how to use the system." },
  { name: "Unit notifier", description: "Have a customer looking for a specific unit? Our in app notifier will reach out when when their desired product comes in." },
  // here now
  { name: "QR code system to easily get the information you need at the tap of a button", description: "Each receipt, work order or anything to do with a client will include a qr code so you can quickly scan it, either with your computer to pull up their file to work on when a client walks through the door, or your phone so you can work on the file on the go without needing a computer or workorder to refer to, has a plethora of other uses but too many to lsit here. Also removes the need for printed work orders to chase or keep track of.", },
  { name: "Synced between your phone and desktop", description: "For example, your looking at a customers unit outside with them and you pull up their order on your phone to make notes on work needed, once all work has been gone over with the vehicle and the client, you walk back inside with your client and open the orders page, with your clients file already pulled up and everything you noted outside, is already on their file. Or your in accessories, you have the customers order already up on your phone and as your helping your customer try things on and they agree to buy them, your already ringing up their items they want to purchase with your phone. When their done shopping, you can confirm the order with them on your phone or go to your computer and have the order pulled up with all the customers items already on their order, all they have to do is pay.", },
  { name: "Demo Day Dashboard - Coming Soon! - Here now!", description: "Book your clients in for your next demo day. (Coming Soon)", },
  { name: "Full Parts CRM and Inventory Mgt - Coming Soon! - Here now!", description: "Parts CRM and inventory management (Coming Soon)", },
  { name: "Full Acc CRM and Inventory Mgt - Coming Soon! - Here now!", description: "Accessories CRM and inventory management (Coming Soon)", },
  { name: "Mass Email - Coming Soon! - Here now!", description: "Unit just come in? Great, send an email blast.", },
  { name: "No more fancy equipment for scanning items, inventory etc - Here now!", description: "All you need is a cell phone or a simple webcam", },
  { name: "Task & Reminder Automation - Coming Soon! - Here now!", description: "Never forget a task again.", },
  { name: "Customizable Dealer CSI Reports - Coming Soon! - Here now!", description: "Dept specfic csi reports to see how your doing", },
  { name: "Customizable finance products - Coming Soon! - Here now!", description: "No longer have to wait for head office to input products", },
  { name: "Easy unit inventory managment for service- Coming Soon! - Here now!", description: "just take your cell phone, scan the unit's bar code thats it", },
  { name: "AI Booking Assistant - Extra Fees Apply - Coming Soon! - Here now!", description: "Generate so many leads you need help booking appointments, our ai assisntant can help book your clients in your schedule.." },
  { name: "AI Writing Partner - Extra Fees Apply - Here now!", description: "Dont know what to say, our AI can help write your next sales email." },
  { name: "Lead Rotation board - Coming Soon! - Here now!", description: "Automate lead rotation and walk-ins. finance and sales team", },
  { name: "Sales stats breakdowns - Coming Soon! - Here now!", description: "In an easy to digest format for any person looking at their stats. Instead of just looking at a huge wall of numbers, we display the stats in graphs and charts, we compare them to ones that make sense. Breaking down your entire process and showing where you can improve from day to day, to month to month. We do also have the big wall of stats if your into it though.", },
  { name: "Manager Dashboard - Coming Soon! - Here now!", description: "Dashboard for managers, one for each dept head (Coming Soon)", },
  { name: "Full Service CRM - Coming Soon! - Here now!", description: "Full service CRM (Coming Soon), from service writer to technician. Helping your team save time while giving clear instructions with work orders.", },
  { name: "Price display cards for units - Coming Soon! - Here now!", description: "Just hit print.", },
  { name: "Technician dashboard - Coming Soon! - Here now!", description: "Easily access all the information you need for each job, right at your terminal.", },
  { name: "Shipping and Receiving dashboard - Coming Soon! - Here now!", description: "To quickly get through and log incoming products.", },
  { name: "Waiters board for service- Coming Soon! - Here now!", description: "Get customers who want to wait for their work into the queue, once a tech is done with their job, they just take the next one right at their terminal.", },

  // extra fees

  { name: "Owner Dashboard - Coming Soon!", description: "Dashboard for owners (Coming Soon)", },
  { name: "Compaigns - Coming Soon!", description: "Set up and automate an advertising campaign to target your customers where they are specifically in the sales funnnel.", },
  { name: "Cross Platform Ad Manager - Coming Soon!", description: "Make one ad on our platform and push to al of your social media.", },
  { name: "Optional - In-House Infrastructure - Coming Soon!", description: "You would rather host your own server on site.", },
  { name: "Full Dealer Set-up - Extra Fees Apply", description: "Not good with technology and need help setting up all your employees in your dealer? No problem, were here to help.", },
  { name: "Voice Calling - Extra Fees Apply - Here now!", description: "Make voice calls straight from the dashboard to quickly go from call to call." },
  { name: "SMS Client - Extra Fees Apply - Here now!", description: "Send and receive SMS messages, right in the dashboard." },
  { name: "Speech To Text - Extra Fees Apply", description: "Slow at typing, no worries its a lot quicker to say an email than type it for a lot of people." },
  { name: "Trade Evaluations - Extra Fees Apply - Coming Soon!", description: "Trade in pricing from the kelley blue book integrated right into our quoting system.", },
  { name: "Payment processor - Coming Soon!", description: "Why bring in more program's when you dont need to?", },
  { name: "Theres more...", description: "Too many to continue listing them off...", },

];

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
              ? "bg-[#232324] hover:bg-muted/50 w-[90%]  rounded-[32px]   "
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

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}
/*
import { useState, useEffect, } from 'react'
import canamIndex from '~/images/logos/canamIndex.png'
import manitouIndex from '~/images/logos/manitouIndex.png'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, } from '~/components/ui/card'
import { Form, Link, useLocation, useLoaderData, useFetcher, Links, NavLink } from '@remix-run/react';
import Overview from '~/images/overview.png'
import Salestracker from '~/images/salestracker.png'
import Features from '~/images/features.png'
import Dealerfees from '~/images/dealerfees.png'
import harleyDavidson from '~/images/logos/hd.png'
import kawasaki from '~/overviewUtils/images/kawa.png'
import activix from '~/images/logos/activix.svg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import Parts from '~/images/parts.png'
import Quoeimage from '~/images/quote.png'
import { Input, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Label, Separator, Badge, RemixNavLinkText, } from "~/components/ui/index"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import { NavigationMenuSales, mainNav } from '~/components/shared/navMenu'
import { AlertCircle } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { cn } from "~/components/ui/utils"
import { Button, buttonVariants } from "~/components"
import { LinksFunction } from '@remix-run/server-runtime';
import { FaCheck } from "react-icons/fa";
import Why from './__public/why';


export const salesFeatures = [
  { name: "Dashboard", description: "Overview of your activities" },
  { name: "Sales Tracker", description: "Track your sales performance" },
  { name: "Sales Calendar", description: "Keep track of your sales events" },
  { name: "Script Builder", description: "Create and manage sales scripts" },
  { name: "Document Builder", description: "Generate sales documents" },
  {
    name: "Customer Wish List Dashboard",
    description: "Manage customer wish lists",
  },
  {
    name: "Instantly generate all your docs",
    description: "Quick document generation",
  },
  { name: "Template Builder", description: "Create and manage templates" },
  { name: "Email Client", description: "Integrated email client" },
  {
    name: "CRM Integration",
    description: "Integrate with other CRM systems",
  },
  {
    name: "Payment Calculator",
    description: "Calculate payments for customers",
  },
  {
    name: "Trade Evaluations - Coming Soon!",
    description: "Evaluate trade-ins (Coming Soon)",
  },
  { name: "Quote Builder", description: "Create and manage quotes" },
  { name: "Sales Presentation Page", description: "Sales presentation tool" },
  { name: "SMS Client", description: "Send and receive SMS messages" },
  {
    name: "Sales Statistics Breakdown",
    description: "Detailed sales statistics",
  },
  {
    name: "Hard to Soft Document Storage",
    description: "Store documents securely",
  },
  { name: "Voice Calling", description: "Make voice calls" },
];

export const dealerFeatures = [
  { name: "Dashboard", description: "Overview of your sales activities for the day, includes time saving methods that will save you 1000's of minuites over the course of the year." },
  { name: "Sales Tracker", description: "Track your sales performance" },
  { name: "Tailer made Sales Calendar", description: "Sales calendars typically suck, because the people who make them for sales people, arent sales people." },
  { name: "Script Builder", description: "Create and manage sales scripts" },
  { name: "Document Builder", description: "Generate sales documents, that are reusable for every single sale. Just need to make them once the first time, then at every sale just hit print." },
  { name: "Customer Wish List Dashboard", description: "Manage customer wish lists and get notified when it hits your inventory, so you never miss a sale again", },
  { name: "Instantly generate all your docs", description: "Generate all your docs at once without ever writing anything in again.", },
  { name: "Template Builder", description: "Create and manage templates to ensure fast follow-up times." },
  { name: "Email Client", description: "Integrated email client, so you don't have to leave the app to go over your email." },
  { name: "CRM Integration", description: "Integrate with other CRM systems, whether you already use another crm or not we can integrate our solution into any other crm to make sure you no longer waste time but don't have to switch the entire store over to a new crm in order to do so.", },
  { name: "Payment Calculator", description: "Quick payment calculator for the moments you need to be quick on your toes.", },
  { name: "Quote Builder", description: "Create and manage quotes in record timing. Can provide weekly, bi-weeekly, monthly payments in three different tax scenarios. Home Province, tax exempt, and custom taxes, to ensure you never have to redo another quote again due to the customer not being forth coming about what tax bracket they fall under." },
  { name: "Sales Presentation Page", description: "Sales presentation tool to give you a clean page to present your customer the deal in an easy to folow manner. That way your customer gets an accurate and concise quote from the get go and will have less questions while also giving you the ability to present with confidence with a straight forward approach. The customer feels more confident about the pricing with less questions, which means you waste less time explaining it to them." },
  { name: "Sales Statistics Breakdown", description: "Detailed sales statistics, to see where your at and where you can improve", },
  { name: "Hard to Soft Document Storage", description: "Store documents securely, store documents on the customers deal page so you can come back to them whenever you need them as many times as you want.", },
  { name: "Dept and General Staff Chat", description: "Internal chat for staff.", },
  { name: "Staff Scheduler / Store Hours", description: "Schedule your staff in the crm so your staff knows their schedule.", },
  { name: "Dept Leaderboards", description: "To instill an ever competitive attitude among the staff, with the ability to set goals and compare how your doing against eachother. Made in a way where you can compete, not dollar to dollar from each dept, but instead set goals attached to sales figures appropriate for each dept and see who can hit their depts goals month over month. So instead of seeing how much profit one made more than the other, which can be demotivating, it just shows how hard everyone pushed to complete their depts goals.", },
  { name: "Finance Dashboard", description: "Finance dept specific dashboard." },
  { name: "Finance Specific Processes To Streamline the Sales Flow", description: "", },
  { name: "Admin Section", description: "Administrative tools to manage your crm." },
  { name: "Manager Section", description: "Managerial tools to manage your staff and inventory" },
  { name: "Owner Section", description: "Managerial tools to manage your staff and inventory" },
  { name: "Inventory Dashboard - Automotive", description: "Manage your in stock and sold inventory." },
  { name: "Import / Export Data", description: "Any data you want at any time.", },
  { name: "Revolutionary sales to finance handoff process", description: "Never before seen in the auto industry, making the sales process seem like magic to the customer", },
  { name: "Cloud Based Setup", description: "No initial set-up or installation of any kind for our clients.", },
  { name: "API for Lead Generating Sources", description: "Want to try out a new lead generation campaign with a new company, just give them the api details and your all set.", },
  { name: "No more expensive weird, one off equipment", description: "No special inventory machines to log product, no special printers needed to print anything, no fancy scanners to scan product/unit barcodes", },
  { name: "Employee onboarding", description: "As soon as you add them, an email goes out to them explaining how to use the system." },
  { name: "Unit notifier", description: "Have a customer looking for a specific unit? Our in app notifier will reach out when when their desired product comes in." },
  // here now
  { name: "QR code system to easily get the information you need at the tap of a button", description: "Each receipt, work order or anything to do with a client will include a qr code so you can quickly scan it, either with your computer to pull up their file to work on when a client walks through the door, or your phone so you can work on the file on the go without needing a computer or workorder to refer to, has a plethora of other uses but too many to lsit here. Also removes the need for printed work orders to chase or keep track of.", },
  { name: "Synced between your phone and desktop", description: "For example, your looking at a customers unit outside with them and you pull up their order on your phone to make notes on work needed, once all work has been gone over with the vehicle and the client, you walk back inside with your client and open the orders page, with your clients file already pulled up and everything you noted outside, is already on their file. Or your in accessories, you have the customers order already up on your phone and as your helping your customer try things on and they agree to buy them, your already ringing up their items they want to purchase with your phone. When their done shopping, you can confirm the order with them on your phone or go to your computer and have the order pulled up with all the customers items already on their order, all they have to do is pay.", },
  { name: "Demo Day Dashboard - Coming Soon! - Here now!", description: "Book your clients in for your next demo day. (Coming Soon)", },
  { name: "Full Parts CRM and Inventory Mgt - Coming Soon! - Here now!", description: "Parts CRM and inventory management (Coming Soon)", },
  { name: "Full Acc CRM and Inventory Mgt - Coming Soon! - Here now!", description: "Accessories CRM and inventory management (Coming Soon)", },
  { name: "Mass Email - Coming Soon! - Here now!", description: "Unit just come in? Great, send an email blast.", },
  { name: "No more fancy equipment for scanning items, inventory etc - Here now!", description: "All you need is a cell phone or a simple webcam", },
  { name: "Task & Reminder Automation - Coming Soon! - Here now!", description: "Never forget a task again.", },
  { name: "Customizable Dealer CSI Reports - Coming Soon! - Here now!", description: "Dept specfic csi reports to see how your doing", },
  { name: "Customizable finance products - Coming Soon! - Here now!", description: "No longer have to wait for head office to input products", },
  { name: "Easy unit inventory managment for service- Coming Soon! - Here now!", description: "just take your cell phone, scan the unit's bar code thats it", },
  { name: "AI Booking Assistant - Extra Fees Apply - Coming Soon! - Here now!", description: "Generate so many leads you need help booking appointments, our ai assisntant can help book your clients in your schedule.." },
  { name: "AI Writing Partner - Extra Fees Apply - Here now!", description: "Dont know what to say, our AI can help write your next sales email." },
  { name: "Lead Rotation board - Coming Soon! - Here now!", description: "Automate lead rotation and walk-ins. finance and sales team", },
  { name: "Sales stats breakdowns - Coming Soon! - Here now!", description: "In an easy to digest format for any person looking at their stats. Instead of just looking at a huge wall of numbers, we display the stats in graphs and charts, we compare them to ones that make sense. Breaking down your entire process and showing where you can improve from day to day, to month to month. We do also have the big wall of stats if your into it though.", },
  { name: "Manager Dashboard - Coming Soon! - Here now!", description: "Dashboard for managers, one for each dept head (Coming Soon)", },
  { name: "Full Service CRM - Coming Soon! - Here now!", description: "Full service CRM (Coming Soon), from service writer to technician. Helping your team save time while giving clear instructions with work orders.", },
  { name: "Price display cards for units - Coming Soon! - Here now!", description: "Just hit print.", },
  { name: "Technician dashboard - Coming Soon! - Here now!", description: "Easily access all the information you need for each job, right at your terminal.", },
  { name: "Shipping and Receiving dashboard - Coming Soon! - Here now!", description: "To quickly get through and log incoming products.", },
  { name: "Waiters board for service- Coming Soon! - Here now!", description: "Get customers who want to wait for their work into the queue, once a tech is done with their job, they just take the next one right at their terminal.", },

  // extra fees

  { name: "Owner Dashboard - Coming Soon!", description: "Dashboard for owners (Coming Soon)", },
  { name: "Compaigns - Coming Soon!", description: "Set up and automate an advertising campaign to target your customers where they are specifically in the sales funnnel.", },
  { name: "Cross Platform Ad Manager - Coming Soon!", description: "Make one ad on our platform and push to al of your social media.", },
  { name: "Optional - In-House Infrastructure - Coming Soon!", description: "You would rather host your own server on site.", },
  { name: "Full Dealer Set-up - Extra Fees Apply", description: "Not good with technology and need help setting up all your employees in your dealer? No problem, were here to help.", },
  { name: "Voice Calling - Extra Fees Apply - Here now!", description: "Make voice calls straight from the dashboard to quickly go from call to call." },
  { name: "SMS Client - Extra Fees Apply - Here now!", description: "Send and receive SMS messages, right in the dashboard." },
  { name: "Speech To Text - Extra Fees Apply", description: "Slow at typing, no worries its a lot quicker to say an email than type it for a lot of people." },
  { name: "Trade Evaluations - Extra Fees Apply - Coming Soon!", description: "Trade in pricing from the kelley blue book integrated right into our quoting system.", },
  { name: "Payment processor - Coming Soon!", description: "Why bring in more program's when you dont need to?", },
  { name: "Theres more...", description: "Too many to continue listing them off...", },

];

export const dealerCard = [
  { description: "Why should you choose this crm? I'm just going to give it to you straight, it's better, period. I'm a sales person, have been my whole life. When I know every script, rebuttal and overcome a sales person can learn, how else can I improve and make more money? This was the biggest crux to fix and I'm sick and tired of crm's wasting my time, making me do more steps in the sales process that arent needed. Or not even addressing the the bigger ones. I've always pushed to be the best, and thats what you will get. If your sales staff don't see an improvment in effeciency in their day to day, which in turn increases their sales by allowing them to complete more of them, you get your money back. I'm that confident.", },
  { description: "Already have a crm and dont want to upset the dynamic of your entire store? No problem, you can just have your sales team, or just your top sales people use it. If we are not integrated with your current crm, we can quickly connect our app to your crm and it would look like they were still using the original crm. That way, theres no disruption.", },
  { description: "I've counted the minutes crm's waste, and its mind boggling. 9 out of 10 products on the market are a waste of time and money. And I'm talking about the biggest products on the market. Or maybe your just an average store that does average sales, then this is an even better product for you. It doesn't cost as much as the 'bigger' brand names, with more features out of the gate. I not only made the near perfect crm for sales people (since I'm always improving it), I took that same attitude to every position in the dealer. The owner shouldn't have to look at the same dash as the sales people and try to decipher a bunch of data to get information they need to make informed decisions on sales and such. No two positions in the dealer need the same data.", },
  { description: "Lets be honest, the sales part of the crm is better then the parts or service depts. They complain even more, and they should. It shouldn't take 5 minutes to find the information to answer a simple question. Navigating 32 pages to see if something is in stock for a unit. So I tailor made every position/role's section of the app and they will be able to expect a lot better experience.", },
  { description: "There are tools in my crm, that you cannot find in any other product on the market. With that said, it doesn't make sense to go with a competing product because you would be doing yourself a disservice. Your getting more for your money, lets be real a lot of crm companies charge an actual arm and a leg, at a cheaper rate. Ontop of that theres's no contract, you can walk at any time.", },
]

export const salesCard = [
  { description: "Experience the only CRM on the market designed to empower every salesperson, regardless of your current CRM provider. While we may not have every integration yet, if your current provider isn't on our list, sign up, and we'll prioritize integrating it promptly.", },
  { description: "Say goodbye to countless hours wasted on repetitive tasks in your dealership without needing management's permission. Our CRM acts like a new 'skin' or interface, replacing your dashboard to make your job more efficient and help you outsell everyone else. Whether you want to achieve more or prefer spending time on other activities, our CRM adapts to your needs.", },
  { description: "While the salesperson's version may lack some functionalities compared to the full dealership version, convincing management to change the entire CRM system might be as challenging as selling cars in Thailand without speaking the language. ", },
  { description: "However, adopting our CRM will significantly elevate your sales game, surpassing the impact of the last five sales training sessions. Guaranteed to be the most significant change in your career, whether you're a newcomer, a sales superstar, or a seasoned salesperson who isn't tech-savvy. You'll undoubtedly see a remarkable increase—Just read the upcoming story about wasting time with mass emails. ", },

];


export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
]

export default function Index() {
  return (
    <>
      <div className='bg-background'>
        <NavigationMenuSales />
        <AlertBox />
        <div className='w-[85%] md:w-[100%]'>
          <NewHeader />
          <NewSection />
        </div>
        <Footer />
      </div>
    </>
  )
}
function AlertBox() {
  return (
    <div className='ite mx-auto mt-3 flex justify-center bg-background'>
      <div className='w-[75%] rounded-md border border-border'>
        <div className='m-3 flex items-center justify-center p-3'>
          <AlertCircle color="#ffffff" />
          <div className='ml-3'>
            <p className='text-foreground'>
              Heads up!
            </p>
            <p className='text-foreground'>
              Beta version of our new CRM is now available! Be some of the first to take advantage of our discounted pricing, limited spots for our beta program.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
function NewHeader() {
  return (
    <div className='bg-background mt-[60px] mx-auto justify-center ' >
      <div className="mx-auto max-w-2xl py-[55px] ">

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Generate vehicle pricing in less than 60 seconds or saving your sales people 125+ mins a day, individually
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground">
            Experience crystal-clear and effortlessly legible displays of weekly, bi-weekly, and monthly payment options, all while receiving a detailed breakdown of every dollar involved in the deal.
          </p>
          <p className="mt-6 text-lg leading-8 text-foreground">
            Along with numerous other processes to save not only your sales staff time during the sales process, but save time for each and everyone of your employees. Make it easier to get the job done with more efficiency. Start you subscription today or request a free demo to see what your missing out on.
          </p>
          <div className='flex justify-center'>
            <Link to='/testDrive' >
              <Button size='sm' className='mx-auto bg-primary text-foreground  mt-3 mr-3'>
                Request Demo
              </Button>
            </Link>
            <Link to='/subscribe' >
              <Button size='sm' className='mx-auto bg-primary text-foreground  mt-3'>
                Subscribe
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
const sections = [
  {
    title: "Want to see it in action?",
    paragraphs: [
      "Streamline the payment process with 3 distinct payment options tailored to different tax requirements. Ever had to painstakingly recalculate prices over the phone, only for the customer to reveal they're from out of town or tax-exempt, requiring you to start from scratch?",
      "Within these options, effortlessly present customers with 3 payments, monthly , bi-weekly, or weekly. While breaking down the differences in price involving gap coverage, tire and rim protection, and extended warranty. It's all right at your fingertips.",
      "Deliver pricing and payments swiftly to any customer by email, granting access to the manufacturer's site, specification sheets, dealer worksheets, customer worksheets, and even a contract for cash transactions closed on the spot. All within 40 seconds.",
    ],

    image: null,
  },
  {
    title: "Enhancing Your Workflow",
    paragraphs: [
      "Enter Customer Details Easily.",
      "Simplify Customer Data Entry.",
      "Each Brand Has Its Dedicated Page.",
    ],
    image: Quoeimage,
  },
  {
    title: "Dedicated Options Pages",
    paragraphs: [
      "Walk Through Each Option and Part with Your Customer for Maximum Profit.",
      "Never Miss Your Monthly Target Again."
    ],
    image: Parts,
  },
  {
    title: "Deliver Professionally Presentable Quotes",
    paragraphs: [
      "- Ensuring Every Customer Gains a Clear Breakdown with an Easy Line-by-Line Explanation.",
      "- Produces monthly, bi-weekly and weekly payments.",
      "- Customize Payments Instantly on the Spot, Including Trade Value, Discounts, Rates, Terms, and More.",
      "- Instantly Generates Pricing with and without Options (VIN Etching, Warranties, etc.), Including Predetermined Pricing.",
      "- Discount Area Conveniently Hidden, Yet Easily Accessible for Flexible Pricing Adjustments.",
      "- Dynamic Pricing and Payment Updates, No Reload Required.",
    ],
    image: Overview,
  },
  {
    paragraphs: [
      "- Instantly Generates Manufacturer Spec Sheets Directly from Their Website.",
      "- Instantly Access Model-Specific Manufacturer Pages with a Single Click.",
      "- Automatically Email Customers Price Breakdowns: Choose from Predetermined Templates or Customize the Email Body with Full-Featured Price Details.",
    ],
    image: Features,
  },
  {
    title: "Tailor-Made Dealer Fee Options",
    paragraphs: [
      "- Efficient Quoting with Accurate, Dealer-Specific Fee Inputs.",
    ],
    image: Dealerfees,
  },
  {
    title: "Coming Soon: Extras",
    paragraphs: [
      "- Sales Tracker - Year-Over-Year Sales Tracking.",
      "- Sales Calendar - Tailor made specfic for sales people to keep track of appointments. No matter how many calls you have booked you won't miss out on those important in person meetings, deliveries, walkarounds, F-I bookings, etc.",
      "- SMS - Send single or mass text messages to your client base.",
      "- Email - Using microsoft outlook as the providor, ensuring that most dealer's will already be set up.",
      "- Voice - Make phone calls right through the dash.",
      "- Template Builder - Have good scripts that you want to reuse, great send them with ease.",
      "- Document Builder - No more filling out paperwork, just click and all of your document needs will be done for you.",
    ],
    image: Salestracker,
  },
  {
    title: "Coming Soon: Innovative Dashboard",
    paragraphs: [
      "- While many dashboards can be time-wasting in most dealerships, our dashboard is designed to help you complete calls efficiently..",
      "- Customer-Specific Notes Section",
      "- Effortlessly Schedule Follow-Up Calls with a Single Click, Automatically Recorded in the System.",
    ],
    image: Dealerfees,
  },
  {
    title: "Coming Soon: Full CRM for sales dept.",
    paragraphs: [
      "- Waste less time and money on over priced, over promised CRM's",
      "- Developed by a sales staff, so you can have the confidence in getting a premium system for your sales staff.",
      "- Features will not be hidden behind paywalls, if we offer it you will have it with your subscription",
    ],
    image: Dealerfees,
  },
  // ... Add other sections here
];
export function Feature1() {
  // <video width="50%" muted autoPlay loop src={Indexvideo} />
  //
  return (
    <>

      <Carousel className=" mx-auto my-auto  w-[95%]" opts={{ loop: true, }}>
        <CarouselContent className=" rounded-md ">
          {sections.map((item, index) => (
            <CarouselItem className='h-auto   border-border' key={index}>
              <div className="p-1">
                <Card className='h-auto border-border'>
                  <CardContent className="flex  justify-center rounded-md  bg-background p-6">
                    <div className='grid grid-cols-2 items-center justify-between'>
                      <div className='justify-center'>
                        <h2 className="top-[50%] my-auto text-center text-2xl font-semibold text-foreground">{item.title}</h2>
                        {item.paragraphs.map((paragraph, i) => (
                          <p className='text-center text-foreground' key={i}>{paragraph}</p>
                        ))}
                      </div>
                      <img alt="logo" width='450' height='450' src={item.image} className='ml-[50px]' />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='text-foreground' />
        <CarouselNext className='text-foreground' />
      </Carousel>
    </>
  )
}

export function DealerPrice() {
  return (
    <>

      <fieldset className="mx-auto grid h-auto max-h-[600px] overflow-y-auto w-[400px] rounded-lg border border-border p-4 ">
        <legend className="-ml-1 px-1 text-lg font-medium text-foreground">
          Dealer
        </legend>
        <br className="my-1" />
        <div className="mx-auto flex w-[70%] justify-center">
          <ul className="mx-auto mt-2 grid gap-3 text-sm">
            {dealerFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-center justify-between"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-left text-foreground">
                      {feature.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className='w-[200px] bg-background border-border'>
                    <p>{feature.description}</p>
                  </TooltipContent>
                </Tooltip>
                <span>
                  <FaCheck
                    strokeWidth={1.5}
                    className="ml-2 text-lg text-[#22ff40]"
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="items-end">
          <Separator className="w-[90%] text-center text-border bg-border mt-5 mx-auto" />
          <h4 className="text-foreground mt-5 text-center">
            Subscribe Now for Just $449.95 Per Month.
          </h4>
          <div className="flex justify-center">
            <a
              href="https://buy.stripe.com/eVa01v0aLfDP4WkfZ0"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 lg:ml-2 lg:mt-0"
            >
              <Button
                size="sm"
                className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
              >
                Continue
              </Button>
            </a>
          </div>
        </div>
        <div className='mt-[35px] flex items-center'>
          <p className='text-muted-foreground mr-2'>Still unsure? Click</p>
          <NavLink to='/testDrive' className='text-muted-foreground '>
            Here...
          </NavLink>
        </div>
      </fieldset>
    </>
  )
}
export function SalespersonPrice() {
  return (
    <>
      <fieldset className="mx-auto grid h-auto max-h-[600px] overflow-y-auto w-[400px]  rounded-lg border border-border p-4 lg:mr-2 ">
        <legend className="-ml-1 px-1 text-lg font-medium text-foreground">
          Sales People
        </legend>
        <div className="mx-auto flex w-[60%] justify-center">
          <ul className="mx-auto mt-2 grid gap-3 text-sm">
            {salesFeatures.map((feature, index) => (
              <li key={index} className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-foreground text-left cursor-pointer">
                      {feature.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className='bg-background border-border text-foreground'>
                    <p>{feature.description}</p>
                  </TooltipContent>
                </Tooltip>
                <span>
                  <FaCheck
                    strokeWidth={1.5}
                    className="ml-2 text-lg text-[#22ff40]"
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="items-end">
          <Separator className="mt-5 w-[90%] text-center text-border mx-auto border-border bg-border" />
          <h4 className="mt-5 text-foreground">
            Subscribe Now for Just $49.95 Per Month.
          </h4>
          <div className="flex justify-center">
            <a
              href="https://buy.stripe.com/bIYaG9f5Fbnz74s5kn"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:mr-2"
            >
              <Button
                size="sm"
                className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
              >
                Continue
              </Button>
            </a>

          </div>
        </div>
      </fieldset>
    </>
  )
}
export function Mission() {
  return (
    <>
      <div className="text-foreground  md:w-1/2 mt-[25px] mx-auto">
        <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[500x] w-[400px] max-h-[500px] overflow-y-auto border-border cursor-pointer " >
          <legend className="-ml-1 px-1 text-lg font-medium">Mission Statement</legend>
          <p className='px-[8px] pt-[5px] text-center text-sm  text-foreground '>
            Our mission is clear: We aim to empower salespeople everywhere with tools and resources that transcend the traditional approach of relying solely on salesmanship training. Whether it's your first day or your tenth year in sales, our goal is to provide universally accessible solutions that lead to improved sales performance.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            Our commitment goes beyond streamlining sales processes. In development, we're crafting a comprehensive dashboard that significantly reduces the time required to complete customer interactions and schedule follow-ups. This dashboard is designed to seamlessly integrate with various CRM systems, ensuring that you have all the necessary information at your fingertips for well-informed follow-up calls. No more navigating between pages or seeking additional resources; everything you need will be readily available to enhance your efficiency.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center  text-sm  text-foreground '>
            We firmly reject the notion of relying on vague or mystical 'secrets' to enhance sales performance, and we challenge the idea that only seasoned oratory experts can excel in sales. There is no mystical formula to sales success; it's a matter of equipping individuals with the right knowledge at the right time in their sales journey.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center text-sm   text-foreground '>
            We believe that every person has the potential to become a highly effective sales professional. This is not an abstract hope or wishful thinking; it's a verifiable fact. We've seen remarkable transformations, even among individuals who have faced significant challenges, such as those with criminal backgrounds. Instead of treating them with harsh judgment, we've taken a different approach, guiding them toward sales excellence and, in turn, improving various aspects of their lives.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            Our approach stands in stark contrast to traditional sales presentations where the speaker hopes that attendees will absorb even a small fraction of their teachings. We don't aspire for a handful out of a thousand to improve. Our mission is to empower each and every person to enhance their sales skills. We firmly believe that, given the right tools and guidance, anyone can become a successful salesperson.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            While we could charge premium prices similar to CRM systems once fully developed, our commitment to accessibility remains unwavering. We understand that affordability should not be a barrier to access the tools needed for continuous growth. Every salesperson deserves to have the resources required for success, a principle that drives us to offer our solution at an accessible price point.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            We are committed to a simple principle: We won't offer anything that hasn't undergone rigorous testing on the sales floor. We understand that our real-world experience as current sales professionals provides our tools with a unique advantage over others in the industry.
          </p>
          <br className='my-1' />
          <p className='px-[8px]  ]  text-center text-sm   text-foreground '>
            While exceptional sales coaches exist, the passage of time can sometimes lead to a disconnect from the practical realities of the sales process. We're not suggesting that you should forego further sales training; in fact, we recognize the immense value that proper training can bring when absorbed effectively.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center text-sm   text-foreground '>
            What we promise is this: We won't present you with tools or strategies that we haven't personally used ourselves. Our commitment is rooted in the belief that only by testing and validating every aspect of our solutions in the real sales environment can we truly deliver tools that work effectively for you.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center text-sm   text-foreground '>
            Although we currently focus primarily on the power sports industry, our vision extends far beyond. We plan to expand into the automotive industry and beyond, with a singular purpose: to assist salespeople everywhere. Our mission is to empower you and every other sales professional out there to reach new heights in your career.
          </p>
        </fieldset>
      </div>
    </>
  )
}
export const logos = [
  {
    src: activix,
    alt: 'Activix',
  },
  {
    src: "https://searchlogovector.com/wp-content/uploads/2020/04/ski-doo-logo-vector.png",
    alt: 'Ski-Doo',
  },
  {
    src: "https://searchlogovector.com/wp-content/uploads/2020/04/sea-doo-logo-vector.png",
    alt: 'Sea-Doo',
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/500px-Suzuki_logo_2.svg.png",
    alt: 'Suzuki',
  },
  {
    src: "https://www.bmw-motorrad.ca/content/dam/bmwmotorradnsc/common/mnm/graphics/bmw_motorrad_logo.svg.asset.1585209612412.svg",
    alt: 'bmw',
  },

  {
    src: manitouIndex,
    alt: 'Manitou',
  },

  {
    src: "https://www.brp.com/content/dam/global/logos/brands/logo-brp.svg",
    alt: 'brp',
  },
  {
    src: canamIndex,
    alt: 'canam',
  },
  {
    src: harleyDavidson,
    alt: 'h-d',
  },

  {
    src: "https://media.triumphmotorcycles.co.uk/image/upload/f_auto/q_auto/SitecoreMediaLibrary//_images/apple-touch-icon-180x180.png",
    alt: 'Triumph',
  },
  {
    src: kawasaki,
    alt: 'Kawasaki',
  },
  {
    src: "",
    alt: 'Yamaha',
  },
  {
    src: "",
    alt: 'Honda',
  },
  {
    src: "",
    alt: 'Indian',
  },


]
export function Brands() {
  return (
    <div className='mx-5 w-[100%] overflow-clip'>
      <div className="text-foreground  md:w-1/2 mt-[25px] mx-auto">
        <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[1050x] w-[120%]  border-border cursor-pointer bg-white " >
          <legend className="-ml-1 -top-5 px-1 text-lg font-medium text-black"></legend>
          <p className='text-2xl text-center text-black'>Brands</p>
          <div className='flex flex-wrap justify-center gap-8  py-4'>

            <TooltipProvider>
              {logos.map(img => (
                <Tooltip key={img.href}>
                  <TooltipTrigger asChild>
                    <a
                      href={img.href}
                      className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
                    >
                      <img
                        alt={img.alt}
                        src={img.src}
                        className="object-contain"
                      />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className='border-border bg-background text-foreground'>{img.alt}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </fieldset>
      </div>
    </div>
  )
}
export function FAQ() {
  return (
    <div className=' '>
      <div className="text-foreground  w-[90%] mt-[25px] mx-auto">
        <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto  h-[600x] w-[500px] max-h-[600px] overflow-y-auto  border-border   " >
          <legend className="-ml-1 px-1 text-lg font-medium">FAQ</legend>
          <div className="font-semibold">How much set-up am I required to do?</div>
          <p className='px-[8px] pt-[5px] text-left text-sm  text-foreground '>
            Aside from setting up your employees, virtually none. The server and database will be hosted off site that we will set up for you. Once up and you will have full access to your new crm to start taking advantage of it. If you would like your line-up included for the quoting capabilities, we just require your dealer binder, if it's a brand we already do not have. If your not technically savvy or do not have a tech dept of some kind, we can set everything up for you, even your employee accounts. If you would like to take it a step farther and include parts, accessories and such for your sales team to help increase sales while they sell their units, let us know and we can discuss it.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">
            You don't have as big as a customer base using this crm in comparison to other brand names, how can I trust it will do the job?
          </div>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            You think yours is actually doing the job? 9.5 people out of 10 reading this... unfortunately your crm is costing you a lot of money. Exponentially more, than you could even imagine. You will throw away more money by not completely switching in salary costs alone, then trying and failing.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            Don't take my word for it, do the math.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            I have. I almost went crazy when I started to dig deep into this. For example, I thought I couldn't do math at one point... because theres no way I waste that much time every year... it's not possible. Doing the same math, having different people check it without telling them what it's for. Running my math through ai to see if I made a mistake. Even googling my math to make sure I hadn't made any errors. Like spending days on end in my free time... on the simplest of math problems because I could not understand how I could waste that much time every day, month or year. I push myself to be the best, it made no sense. Nope, everything checked out and it needed to change, fast.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            Measure each and every single process, but you can't get mad at your employees/colleagues due to the results you come to. It's not their fault, no matter how much you try to justify it. And be honest with the numbers, by cheating the numbers and making them smaller then they should. The only person that would harm, is you. Yes, I know sales people can cheat systems as can any employee in any position can, but they cant keep it up long term in a way that would benefit them for more than a 2 week period. Same as any role in the dealer, the job is the job. There's almost no way to change that. The work needs to be done, properly. I've been a sales manager for years, sales person for years, assistant gm for years, gm for years, sales coach, etc. There's no way to get out of the things needed to get the job done. I've tried and lets be honest you probably have too.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            How people go about the sales process can be different yes, but when you chip away the differences of how one person does it to the next. The fundamentals are still there, if they're successful. And it's the same for every role in the dealer.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            So... we just make their job easier. That's the secret. So easy, that they wouldn't even know they're being more effecient. Wouldn't even cross their mind, they would just be so relieved not to have to deal with the hell the other crm put them through whenever they needed to do something. These aren't my words either.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            Word of caution though before you do the math. Be ready. Be ready to not only be blown away by not only the amount of time wasted, but also the amount of profits. But be ready to get angry. The numbers get big, fast. I know how much it takes to earn every dollar in a business/dealer. To the average person 100k wasted in a, what would seem like a big business/dealer to the average person, might seem too insignificant to even bother worrying about it. But I know how much it takes to make 100k in profits and what it can be used for, but you only just measured one role or a portion of one before you start to realize... what about the others or the scaling problem because you have 10 people doing that one job? ... Fuck. So that small 100k just turned into a million or more in profit that could have been kept in the company, maybe? Maybe you wanted to expand? Hire more staff? Offer bigger salaries to help employee retention? Which in turn cuts down a lot of other costs. It's kind of hard when you didn't even know this money was there to begin with.

          </p>

          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">How secure will it be / how fast will it be?</div>
          <p className='px-[8px] pt-[5px] text-left text-sm  text-foreground '>
            Each dealer will have their own database and server. That way if one dealer is compromised, none of the other dealers would have to suffer due to their security event. This same reason also helps the overall speed of each dealers CRM because no two dealers share the same resources. During peak times, say for example at 9 am when every dealer opens, instead of a bottle neck of traffic slowing you down when logging in or even worse not letting you because everyone is logging in at once, instead each will have fast loading times as if you had your very own custom crm solution.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">Can you actually quote a price in 60 seconds?</div>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            No, it's even quicker than that. While setting the time frame any lower might seem unattainable to many, our application is designed to provide pricing information in a matter of seconds. In today's fast-paced world, some automotive brands require salespeople to sift through a massive book with over 500 pages just to discuss vehicle options, which can consume an entire hour. Our application eliminates this time-consuming process by putting almost everything you need right at your fingertips. It doesn't just provide speedy quotes; it also offers additional features that accelerate your workflow, allowing you to serve more customers efficiently. It's not solely about increasing sales but also about aiding more people in a timely manner. I've witnessed customers leaving dealerships because they couldn't find assistance. While it's unfortunate for the dealer, no salesperson should spend three hours with a customer unnecessarily. They claim to be selling, but, in reality, they aren't. Some customers even have to wait weeks to receive a price quote, and that's a situation we aim to change.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">Q: Is it easy to use? Some of my sales guys are too old for technology.</div>
          <p className='px-[8px]    text-left  text-sm  text-foreground '>
            A: Absolutely, ease of use is one of our top priorities. Our application is designed to be user-friendly, making it accessible to sales professionals of all ages, including those who may not be as tech-savvy. It's much simpler than the processes they are currently accustomed to. They no longer need to search for pricing information because it's readily available. Even for brands with complex lists of options, our application presents the information in a clear and easy-to-read format, benefiting both salespeople and customers. This reduces the need for extensive training on individual units and their options. To illustrate, brands like Manitou and BMW, which are known for their intricate offerings, become straightforward with our application. You simply select a unit, navigate through the list of options and accessories tailored to that unit, and our application generates a quote. It provides payment plans, including weekly, bi-weekly, and monthly options, factoring in local taxes or offering tax-exempt calculations for those who prefer it. Additionally, there's a field for out-of-towners with different tax rates. Furthermore, we include pre-loaded dealer options such as warranties and VIN etching, so if a customer insists on knowing the price with specific add-ons before making a decision, you already have that information at your fingertips.  Our system also allows you to customize finance packages instantly by adjusting up to 11 fields for dealer options. This empowers you to provide a tailored and hassle-free financing solution in real-time, often more efficiently than the finance department.   For those challenging phone inquiries where customers provide incomplete information, our application solves the problem. It's common for customers not to disclose their location or tax status, leading to rework and wasted time. With our application, much of this work is already completed, significantly reducing the time it takes to provide a quote. In some cases, it can take dealers 45-60 minutes or even longer to deliver a price; our application streamlines this process for immediate results.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">Q: Does it just produce prices?</div>
          <p className='px-[8px]    text-left text-sm   text-foreground '>
            A: Not anymore, our application goes far beyond simply generating prices now. It not only enhances your entire sales process up to the point where it seamlessly integrates with your CRM, if you choose to keep the one you currently have. It also stream lines each and every employees day to day work duties. Here's how it improves your workflow:   Clear and Comprehensive Explanation: Our application excels at explaining vehicle options, prices, and associated fees in a way that's easy to understand. This clarity benefits all customers, including those who might find complex information confusing. You can confidently present pricing without interruptions or hesitation from customers, leading to a smoother sales experience.  Control and Professionalism: Having a tool that provides such control over the sales process elevates your sales game. You won't experience interruptions due to customers struggling to grasp the information. You can maintain a professional and uninterrupted dialogue, making your interactions more efficient and productive.  Streamlined Access to Information: Our application offers features that simplify the process even further. Need to access a spec sheet from the manufacturer's site? Instead of navigating multiple pages, it's just one click away. If a customer is interested in a color that's not in stock, you can quickly show them the model page on the manufacturer's site.   Efficient Communication: In cases where a customer has left without making a purchase, our application provides pre-made templates that can be customized or used as-is. These templates include a variety of email breakdowns tailored to different types of customers. Whether they need payment details or a comprehensive list of options, you can send the information with a single click, saving you valuable time.  In essence, our application is designed to optimize your entire sales process, making it more efficient, professional, and customer-friendly from start to finish.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">Q: Will it really help my sales out?</div>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            A: Absolutely, we guarantee it will make a significant difference in your sales process. In the automotive industry, it's surprising how few products genuinely assist salespeople or any other role in the dealer beyond enhancing their skills and salesmanship. Most tech solutions either extend the sales process or add more complexity. However, our application is a game-changer because it complements your existing sales process and skills, simplifying the entire journey.   Here's how it can truly benefit you and your team:  Streamlined Process: By simplifying your workflow, it allows you to focus 100% of your mental energy on closing the sale. You can engage with customers with confidence, fewer headaches, and access to crucial information. For example, if a customer wants to compare the prices of different options, you can provide this information instantly, eliminating unnecessary stress.  Increased Confidence: Confidence is key in sales, and our application empowers you to navigate your interactions with customers more confidently. You'll have the tools at your disposal to provide information quickly and accurately, which builds trust and credibility with potential buyers.  Information Accessibility: In a world where information is readily available online, it's essential to equip salespeople with the tools they need to meet customer expectations. Our application gives you instant access to the information customers seek, eliminating the need for customers to search elsewhere for the details they want.  Customer-Centric Approach: By arming yourself with a tool that provides information efficiently and effectively, you can take a more customer-centric approach to sales. It's about giving customers what they need when they need it, which can lead to higher customer satisfaction and conversion rates.  In summary, our application is designed to make your job easier and more productive by simplifying your sales process and giving you the tools to provide customers with the information they desire. It's a win-win situation that benefits both sales professionals and customers, ultimately driving more sales and increasing overall satisfaction.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">I don't think my gm would let me use this.</div>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            It's understandable to have concerns about introducing new tools or changes in your dealership, especially if it involves management approval. Here are some points you can consider when discussing the implementation of this app with your GM:
            <li>Increased Sales Efficiency: Emphasize how the application can significantly improve sales efficiency. It streamlines the sales process, allowing salespeople to provide better and more detailed information to customers quickly. This efficiency can lead to more sales and a better customer experience.</li>
            <li> Enhanced Finance Management: Highlight that the app also benefits finance managers by simplifying the process of adjusting financing rates and options. This means faster turnaround times and less time spent on administrative tasks.</li>
            <li>Reduced Interruptions: Explain that the application can reduce interruptions for both salespeople and management. With quicker access to pricing information, there's less need for constant back-and-forth between sales and management to finalize deals. This, in turn, can lead to more productive workdays for everyone.</li>
            <li>
              Improved Customer Satisfaction: Mention that by using the app, you can provide customers with more accurate and timely information. This can enhance overall customer satisfaction and make the dealership more competitive in a digital age where customers expect fast responses.
            </li>
            <li>
              Trial Period: Suggest a trial period where the GM and the team can test the application's effectiveness firsthand. This will allow them to see the benefits in action and make an informed decision.
            </li>
            <li>
              Training and Support: Offer to provide training and support for the entire team to ensure a smooth transition to using the application. Show that you're committed to making the implementation process as easy as possible.
            </li>
            <li>
              Competitive Advantage: Emphasize how this tool can give your dealership a competitive advantage in the market. In a highly competitive industry, having a tool that streamlines the sales process and improves customer service can be a game-changer.
            </li>
            <li>
              We can continue but will end it here...
            </li>
            Ultimately, it's important to present the application as a solution that benefits the dealership as a whole, from sales and finance to management and customer satisfaction. Showing the potential advantages and offering a trial period can help address any initial concerns and make a strong case for its adoption. But to be honest, your probably going to get a no which is why it's made the way it is. When our crm is connected with another, its as if you threw a new coat of paint on, underneath the paint it does the same thing when interacting with the other crm, but with a turbo and supercharger installed. So you get all the benefits of a improved crm, but don't actually have to use the one you have been provided. Another way of looking at it is, its a new skin with better features and the connected crm wouldn't even be able to tell the difference. If we don't currently work with your crm, let us know and we'll get it hooked up. The only issue we have run into so far, one company just didn't have enough employees to deal with the workflow. All the work was done on our end to hook it up but took more than 6 months to finnaly get it all done. If this outlier of a situation happens to you, we'll refund your subscription, and let you know when its completed so you can come back with no issues or hassles. It only takes a day for us to complete the work needed so its no big deal.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />
          <div className="font-semibold">How can this help other roles in the dealer?</div>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            Have you ever asked any of your employees / colleagues about the crm they use? If you got an honest answer, you would come to the conclusion that they hate it more than the sales people. Fortuantly the sales people get paid commission and the crm helps them make that commission. No matter how much they hate it, its a necessary evil to completing their tasks, as quickly as they can given the tools at their disposal. The big take away, and its a massive negative one at that, everyone else works on hourly or salary pay structures. They are not incentivized to use the crm to help them make money. It does not help that the crms naturally make their jobs worse.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            The worst I've seen it was when I asked my service manager if a part was in and if so when can we get it on the schedule to rectify the problem the oem had given us. The customer was pissed, rightly so and I was trying to ask all the questions needed before moving on.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            A hundred or so clicks of her button on the computer and 5 minutes later, I said. 'We've known each other for a long time, so please don't take offense to this question because im geniunly curious. But what the fuck are you doing? Are you still trying to find out if we have the part need to fix this issue? It's been over 5 minutes and I've seen you browse atleast 20-30 pages so far, this cannot be what you need to do to get access to this information.'
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            She turned, looked at me with a defeated expression and said yes.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            I'm sorry but your service manager has better things to do, even your lowest paid employee has better things to do than have to go through that process each and every single time.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            I remember the dot com boom, it came with a promise... to make our lives easier. So why is it making it harder, almost 30 years later? The biggest reason that comes to mind, the people designing them... don't use them. I worked at a job when I was younger that had a portion of it, resemble working in a call center. We got quick at doing sales calls, like insanely quick. Money was on the line. We worked through those calls faster than I can get through any modern crm system that I have had the chance at using at any dealer. We had flip open cell phones... and all of our contacts were printed in binders. We had our processes to make going through the calls quick, but that was 20 years ago. Your telling me technology can't replicate that. Not till I made it so, apparently.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            Even though these programmers/crm companies may take your suggestion to make it better, if its even implemented, it still would not be as refined as a team who made it and then used it day to day in their own roles at the dealership. At the end of the day, that programmer has one job. To complete his own job as quickly as possible and move on to the next task or project. The dashboard we made, went through over 100 iterations before landing on the one we have now. Still, it continues to see updates to areas that would cut down your time using it for one reason or another. I should say dashboard's because ours, are role specific. No two roles in a dealership works with the same information, so why do crms usually only make one dashboard? Then make the employees force it their role. Sales managers dash? You first see all of your teams sales statistics, whos achieving their goals, whos not and needs help. Accessories manager, quick overview of sales figures and then goes into inventory management. What's in stock, whats not. What needs to be ordered when. You think the service manager needs to see the information from those two roles? No.
          </p>
          <p className='px-[8px]   text-left text-sm   text-foreground '>
            Personally, I've always made a joke about crms. They're designed and sold to one person in the dealer... the owner. That's it, and unfortunatly more often than not it's true. The owner doesn't need to be sold on how each roles dash or processes will actually help them with their job. Sales people selling crms, focus on how it will help the owner control the dealer and foresee problems before they become one. The sales persentation ends there 9 times out of 10. No one ever thinks deep enough on how it will effect each and every single person / role in the dealer. Can't blame them, they're busy with the things they need to do as well. But that time has come to end.
          </p>
          <Separator className="my-4 border-border w-[95%] mx-auto" />

        </fieldset>
      </div>

    </div>

  )
}
function NewSection() {
  const [sales, setSales] = useState(false)
  const [dealer, setDealer] = useState(false)

  return (
    <>
      {sales === false && dealer === false && (
        <div className='mx-auto grid lg:grid-cols-2 justify-center mb-[40px] mt-[75px]'>
          <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850px] w-full sm:w-[85%] lg:w-[550px] border-border cursor-pointer hover:border-primary"
            onClick={() => setSales(true)}>
            <legend className="-ml-1 px-1 text-lg font-medium text-foreground">Sales People</legend>

            <p className='px-[8px] pt-[5px] text-center text-sm text-foreground'>
              Experience the only CRM on the market designed to empower every salesperson, regardless of your current CRM provider. While we may not have every integration yet, if your current provider isn't on our list, sign up, and we'll prioritize integrating it promptly.
            </p>
            <br className='my-1' />
            <p className='px-[8px] text-center text-sm text-foreground'>
              Say goodbye to countless hours wasted on repetitive tasks in your dealership without needing management's permission. Our CRM acts like a new "skin" or interface, replacing your dashboard to make your job more efficient and help you outsell everyone else.
            </p>
            <br className='my-1' />
            <p className='px-[8px] text-center text-sm text-foreground'>
              While the salesperson's version may lack some functionalities compared to the full dealership version, convincing management to change the entire CRM system might be as challenging as selling cars in Thailand without speaking the language.
            </p>
            <br className='my-1' />
            <p className='px-[8px] text-center text-sm text-foreground'>
              However, adopting our CRM will significantly elevate your sales game, surpassing the impact of the last five sales training sessions.
            </p>
            <div className='flex justify-center'>
              <Button size='sm' className='mx-auto bg-primary text-foreground mt-3'>
                Continue
              </Button>
            </div>
          </fieldset>

          <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850px] w-full sm:w-[85%] lg:w-[550px] border-border cursor-pointer hover:border-primary"
            onClick={() => setDealer(true)}>
            <legend className="-ml-1 px-1 text-lg font-medium text-foreground">Dealers</legend>

            <ul className="grid gap-3 text-sm mt-2">
              {dealerCard.map((item, index) => (
                <li key={index} className="">
                  <p className='text-left'>{item.description}</p>
                </li>
              ))}
            </ul>

            <div className='flex justify-center'>
              <Button size='sm' className='mx-auto bg-primary text-foreground mt-3'>
                Continue
              </Button>
            </div>
          </fieldset>
        </div>
      )}
      {sales && (
        <>
          <Tabs defaultValue="account" className="w-full sm:w-[85%] lg:w-2/3 mx-auto justify-center">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="account">Why</TabsTrigger>
              <TabsTrigger value="Action">In Action</TabsTrigger>
              <TabsTrigger value="Brands">Brands Integrated</TabsTrigger>
              <TabsTrigger value="Mission">Mission</TabsTrigger>
              <TabsTrigger value="FAQ">FAQ</TabsTrigger>
              <TabsTrigger value="Price">Price</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Why />
            </TabsContent>
            <TabsContent value="Action">
              <Card>
                <CardHeader className="text-lg leading-8 text-foreground bg-muted-background border-b border-border">
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 bg-background">
                  <div className=' mt-3'>
                    <Feature1 />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Brands">
              <Brands />
            </TabsContent>
            <TabsContent value="Mission">
              <Mission />
            </TabsContent>
            <TabsContent value="FAQ">
              <FAQ />
            </TabsContent>
            <TabsContent value="Price">
              <SalespersonPrice />
            </TabsContent>
          </Tabs>
        </>
      )}
      {dealer && (
        <>
          <Tabs defaultValue="account" className="w-2/3 mx-auto justify-center">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="account">Why</TabsTrigger>
              <TabsTrigger value="Action">In Action</TabsTrigger>
              <TabsTrigger value="Brands">Brands Integrated</TabsTrigger>
              <TabsTrigger value="Mission">Mission</TabsTrigger>
              <TabsTrigger value="FAQ">FAQ</TabsTrigger>
              <TabsTrigger value="Price">Price</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Why />

            </TabsContent>
            <TabsContent value="Action">
              <Card>
                <CardHeader className="text-lg leading-8 text-foreground bg-muted-background border-b border-border">
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 bg-background  ">
                  <div className=' mt-3'>

                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Brands">
              <Brands />
            </TabsContent>
            <TabsContent value="Mission">
              <Mission />
            </TabsContent>
            <TabsContent value="FAQ">
              <FAQ />
            </TabsContent>
            <TabsContent value="Price">
              <DealerPrice />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  )
}
function Footer() {
  return (
    <>
      <div className="mt-[35px] mb-[25px] border-t border-border ">
        <div className='bg-background text-foreground  '>
          <div className=' mt-[15px] w-[80%] mx-auto space-y-3'>
            <p>Dealer Sales Assistant</p>
          </div>
          <div className='mt-[15px] w-[80%] mx-auto space-y-3'>
            <SidebarNav items={mainNav} />
          </div>
        </div>
      </div>
    </>
  )
}
/**   <div className="text-center">
              <p className="px-8 pt-5 text-sm text-foreground">
                Increase your revenue and streamline training for new hires by using our CRM. It's not just easier for your employees but also provides an excellent way to present and upsell to every customer.
              </p>
              <br className="my-1" />
              <p className="px-8   text-sm text-foreground">
                Experience quicker sales with fewer customer questions. The easy-to-read information about the deal makes customers happier. Your sales team can effortlessly close deals without getting hung up on questions or uncertainty through the process.
              </p>
              <br className="my-1" />
              <p className="px-8   text-sm text-foreground">
                Eliminate paperwork for your salespeople. Our system handles all necessary paperwork, allowing your sales team to hit print, and the system takes care of the rest. Save time and boost profits across any dealership.
              </p>
              <br className="my-1" />
              <p className="px-8   text-sm text-foreground">
                Discover more benefits by exploring our system. Stay tuned for an in-depth video covering the entire system and addressing how the industry has done us wrong. If you're here, you're already moving in the right direction. To top it off, we have one advatange none of the CRM providors have.
              </p>
            </div> */
