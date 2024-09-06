import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { Button, ButtonLoading, Checkbox, } from '~/components/ui/index'
import { json, type ActionFunction, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'

import { Bird, Rabbit, Turtle } from "lucide-react"

import {
  TextArea, Select, Input,
  SelectContent, Label,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/"
import { model } from '~/models'
import financeFormSchema from '~/overviewUtils/financeFormSchema';

import { prisma } from "~/libs";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'
import { toast } from 'sonner'
import CheckingDealerPlan from '../__customerLandingPages/welcome/contactUsEmail'
import * as React from "react";

export default function MyComponent() {
  return (
    <div className="flex flex-col w-full max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between px-9 py-6 w-full text-lg uppercase whitespace-nowrap bg-zinc-100 max-md:px-5 max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5d615d0c46cf51017f8cf79e2d9604d6b22cc63a9315cd27d82cf70d1f0959c?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
          className="object-contain shrink-0 my-auto max-w-full aspect-[4.74] w-[109px]"
        />
        <div className="flex items-start p-0.5 leading-none text-white bg-white border-2 border-solid border-neutral-900 rounded-[32px] max-md:max-w-full">
          <div className="flex flex-wrap gap-0 items-start min-w-[240px] max-md:max-w-full">
            <div className="px-7 pt-4 pb-4 max-md:px-5">Pricing</div>
            <div className="pt-4 pr-8 pb-4 pl-7 text-base leading-none max-md:px-5">
              Products
            </div>
            <div className="pt-4 pr-7 pb-4 pl-7 text-base leading-none max-md:px-5">
              Apps
            </div>
            <div className="px-7 pt-4 pb-4 max-md:px-5">Docs</div>
            <div className="pt-4 pr-7 pb-4 pl-7 max-md:px-5">Blog</div>
          </div>
        </div>
        <div className="self-start pt-4 pr-9 pb-5 pl-9 font-semibold leading-none text-gray-50 border-2 border-solid bg-neutral-900 border-neutral-900 rounded-[32px] max-md:px-5">
          Login
        </div>
      </div>
      <div className="flex flex-wrap gap-5 justify-between self-center mt-20 w-full max-w-[1341px] max-md:mt-10 max-md:max-w-full">
        <div className="flex items-start self-start py-1 pr-40 pl-1 mt-20 text-xs leading-none text-white uppercase whitespace-nowrap rounded-full bg-neutral-900 bg-opacity-10 max-md:pr-5 max-md:mt-10">
          <div className="py-0.5 pr-2.5 pl-2 rounded-full bg-neutral-900">
            NEW
          </div>
        </div>
        <div className="flex flex-col justify-center p-1.5 border-2 border border-solid bg-zinc-100 rounded-[38px] text-neutral-900 max-md:max-w-full">
          <div className="flex flex-wrap items-start p-0.5 border-2 border-solid border-neutral-900 rounded-[32px] max-md:max-w-full">
            <div className="flex flex-col items-start p-6 border-r-2 border-neutral-200 min-w-[240px] w-[286px] max-md:px-5">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/307a5d82eab401d5ca9abf2194df41848ae8859b951b9f26ebed025497c20958?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain w-7 rounded-full aspect-square"
              />
              <div className="mt-3 text-base text-zinc-700">Rick Astley</div>
              <div className="mt-3 text-2xl leading-none">Get Rickrolled</div>
              <div className="flex flex-col self-stretch mt-7 text-sm font-medium leading-loose">
                <div className="flex gap-2 items-start pr-0.5 leading-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4dac1c40d359684a861c54bea0ebdef481a853577891459aeff762c45bcf0882?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 aspect-square w-[17px]"
                  />
                  <div className="w-[209px]">
                    Book me and I will never give you up. Cal will never let you
                    down. Open Source will never run around and desert you.
                  </div>
                </div>
                <div className="gap-2 pr-44 mt-3 text-sm max-md:pr-5">
                  30 min
                </div>
                <div className="flex gap-2 items-start pr-44 mt-3 text-sm whitespace-nowrap max-md:pr-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/074b4183995c907623ee20ac0cde96fe0d8e3bde520d39577e65daca43d06d47?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 aspect-square w-[17px]"
                  />
                  <div>Zoom</div>
                </div>
                <div className="flex gap-2 items-start pr-28 mt-3 leading-none max-md:pr-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d75eeb27beadae274624aac198d995da8b8d456ee97dfc0eeb81db128cf0ccbe?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 aspect-square w-[17px]"
                  />
                  <div>Europe / Dublin</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center py-6 whitespace-nowrap min-w-[240px] w-[346px]">
              <div className="flex flex-col self-stretch px-6 w-full max-md:px-5">
                <div className="flex gap-5 justify-between w-full">
                  <div className="flex gap-2">
                    <div className="grow text-base font-bold">December</div>
                    <div className="text-base leading-relaxed">2022</div>
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5302921a2473f3401c80fe09e3aa65d76eaae416b5cf5dec2be36e28ff5ec8d6?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain shrink-0 my-auto aspect-[2.47] w-[42px]"
                  />
                </div>
                <div className="flex gap-4 mt-6 text-sm font-medium leading-none uppercase max-md:mr-2 max-md:ml-1.5">
                  <div className="grow">Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div className="flex gap-9 self-end mt-8 text-sm font-medium leading-none max-md:mr-2.5">
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                </div>
              </div>
              <div className="flex gap-5 justify-between mt-8 max-w-full text-sm font-medium leading-none w-[268px]">
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
                <div>9</div>
                <div className="text-sm leading-loose">10</div>
              </div>
              <div className="flex gap-4 items-center mt-5 max-w-full text-sm font-medium leading-loose w-[272px]">
                <div className="flex gap-8 self-stretch my-auto">
                  <div>11</div>
                  <div>12</div>
                  <div>13</div>
                  <div>14</div>
                </div>
                <div className="flex gap-1 self-stretch">
                  <div className="py-2.5 pr-3 pl-3 bg-gray-200 rounded h-[39px] w-[39px]">
                    15
                  </div>
                  <div className="py-2.5 pr-3 pl-3 bg-gray-200 rounded h-[39px] w-[39px]">
                    16
                  </div>
                </div>
                <div className="self-stretch my-auto">17</div>
              </div>
              <div className="flex gap-4 items-center mt-1 max-w-full text-sm font-medium leading-loose w-[273px]">
                <div className="self-stretch my-auto">18</div>
                <div className="flex gap-1 self-stretch">
                  <div className="px-3 py-2.5 bg-gray-200 rounded h-[39px] w-[39px]">
                    19
                  </div>
                  <div className="px-3 py-2.5 bg-gray-200 rounded h-[39px] w-[39px]">
                    20
                  </div>
                  <div className="px-3 py-2.5 w-10 h-10 bg-gray-200 rounded">
                    21
                  </div>
                  <div className="py-2.5 pr-3 pl-3 bg-gray-200 rounded h-[39px] w-[39px]">
                    22
                  </div>
                  <div className="py-2.5 pr-3 pl-3 bg-gray-200 rounded h-[39px] w-[39px]">
                    23
                  </div>
                </div>
                <div className="self-stretch my-auto">24</div>
              </div>
              <div className="flex gap-4 items-center mt-1 max-w-full text-sm font-medium leading-loose w-[271px]">
                <div className="self-stretch my-auto">25</div>
                <div className="flex gap-1 self-stretch">
                  <div className="px-3 py-2.5 w-10 h-10 bg-gray-200 rounded">
                    26
                  </div>
                  <div className="px-3 py-2.5 w-10 h-10 bg-gray-200 rounded">
                    27
                  </div>
                  <div className="px-3 py-2.5 w-10 h-10 bg-gray-200 rounded">
                    28
                  </div>
                  <div className="py-2.5 pr-3 pl-3 w-10 h-10 bg-gray-200 rounded">
                    29
                  </div>
                  <div className="py-2.5 pr-3 pl-3 w-10 h-10 bg-gray-200 rounded">
                    30
                  </div>
                </div>
                <div className="self-stretch my-auto">31</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pr-52 text-2xl leading-8 max-md:max-w-full">
        Meet Cal.com, the event-juggling scheduler for everyone.
        <br />
        <span className="text-2xl not-italic ">
          &nbsp;Focus on meeting, not making meetings. Free for individuals.
        </span>
        <br />
      </div>
      <div className="pt-6 pr-11 pb-px mx-9 text-8xl tracking-tight border border-black border-solid leading-[117px] text-neutral-900 max-md:pr-5 max-md:mr-2.5 max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
        Scheduling
        <br />
        infrastructure for <span className="text-gray-50">everyone.</span>
      </div>
      <div className="flex flex-wrap gap-6 mx-9 mt-5 w-full max-w-[1372px] max-md:mr-2.5 max-md:max-w-full">
        <div className="flex overflow-hidden flex-wrap flex-auto p-0.5 mr-7 whitespace-nowrap bg-gray-50 border-2 border-solid border-neutral-900 rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] max-md:max-w-full">
          <div className="pt-8 pr-16 pb-8 pl-14 text-2xl leading-none border-r-2 bg-neutral-200 border-neutral-900 text-neutral-900 max-md:px-5">
            cal.com/
          </div>
          <div className="flex flex-col grow shrink-0 justify-center px-9 py-8 mr-52 text-xl font-medium text-gray-500 bg-gray-50 basis-0 w-fit max-md:px-5 max-md:max-w-full">
            <div className="overflow-hidden pt-px pr-[662px] max-md:pr-5">
              RickAstley
            </div>
          </div>
        </div>
        <div className="flex shrink gap-5 px-10 py-9 text-xl font-semibold leading-none text-center uppercase bg-gray-50 border-2 border-solid basis-auto border-neutral-900 grow-0 rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] text-neutral-900 max-md:px-5">
          <div className="grow">Claim username</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/99ee96b8a0884c62fd428f86d9672907ab021e3fefd9a0480f6f1982d3fbf3ff?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
            className="object-contain shrink-0 self-start mt-1.5 aspect-square w-[15px]"
          />
        </div>
      </div>
      <div className="flex overflow-hidden relative flex-col items-start pt-14 pb-28 pl-16 mx-9 mt-20 pr-[485px] rounded-[32px] max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex absolute inset-0 z-0 max-w-full bg-neutral-900 min-h-[690px] w-[1372px]" />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a19c4a401657e1ccc16d91de9e395aa6a2643cd720e2ab604843b10232df305?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
          className="object-contain absolute right-0 bottom-0 z-0 max-w-full aspect-[1.77] top-[-101px] w-[1400px]"
        />
        <div className="flex absolute top-0 right-0 z-0 max-w-full h-[276px] min-h-[276px] rounded-[32px_32px_0px_0px] w-[1372px]" />
        <div className="z-0 self-stretch text-6xl text-gray-50 leading-[62px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
          Schedule meetings without the email tennis
        </div>
        <div className="flex relative z-0 items-start pt-10 pb-48 max-w-full text-zinc-500 w-[400px] max-md:pb-24">
          <div className="flex z-0 flex-col pt-2 pr-6 pb-8 text-gray-50 min-w-[240px] w-[400px]">
            <div className="self-start text-3xl leading-none">
              Connect your calendar(s)
            </div>
            <div className="mt-3 text-2xl leading-8">
              Cal reads your availability from all your existing calendars
              ensuring you never get double booked!
            </div>
          </div>
          <div className="absolute left-0 z-0 text-3xl leading-none bottom-[159px] right-[122px] top-[204px] w-[278px]">
            Set your availability
          </div>
          <div className="absolute left-0 right-48 z-0 w-52 text-3xl leading-none bottom-[95px] top-[268px]">
            Share your link
          </div>
          <div className="absolute left-0 z-0 text-3xl leading-10 bottom-[-31px] right-[63px] top-[356px] w-[337px]">
            Let people book when it works for both of you
          </div>
        </div>
      </div>
      <div className="self-center mt-28 text-8xl tracking-tighter text-center leading-[93px] text-neutral-900 max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
        Everything you need in a scheduling app
      </div>
      <div className="flex overflow-hidden flex-col py-0.5 pr-0.5 pl-4 mx-9 mt-9 rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex overflow-hidden relative flex-col items-start px-8 pt-8 pb-96 min-h-[531px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/780143fb37c451ecaab8bf76adee3f8aa9b647866af8ff51dd380b832f82f06e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
            className="object-cover absolute inset-0 size-full"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/321fa2c23382f68dda9bd8991ff047d27d7cf62d0986a9dcf9dcdc65d23e3ae8?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
            className="object-contain mb-0 rounded-full aspect-square w-[72px] max-md:mb-2.5"
          />
        </div>
        <div className="flex flex-wrap gap-5 justify-between px-8 pt-5 pb-10 border-t-2 border-neutral-900 text-neutral-900 max-md:px-5 max-md:max-w-full">
          <div className="self-start text-3xl leading-none max-md:max-w-full">
            A tailored link ready for every scenario
          </div>
          <div className="text-xl leading-8">
            Set availability, location, duration and more on a per-link basis.
            Send bookings to different calendars or set a default.
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
                      Connect all your calendars
                    </div>
                  </div>
                  <div className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
                    <div className="text-lg leading-7 text-neutral-900 max-md:mt-10">
                      Cal.com checks for conflicts across all of your calendars
                      and only offers times that are open. Never get double
                      booked again.
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
                            Send SMS reminder 24 hours before event starts to
                            Host
                          </div>
                        </div>
                        <div className="flex overflow-hidden gap-2 px-5 py-7 mt-4 rounded-2xl bg-white bg-opacity-70 shadow-[0px_4px_0px_rgba(229,231,235,0.7)] text-neutral-900 text-opacity-70">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8932a5bc55cf71d027a30a14346bc420d8a1207cf21f16b7a25076af9fd2f0b7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                            className="object-contain shrink-0 aspect-[1.03] w-[38px]"
                          />
                          <div>
                            Send custom email when event is cancelled to host
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
                    Send reminder email 24 hours before event starts to attendee
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
                      Workflow automation
                    </div>
                  </div>
                  <div className="flex flex-col ml-5 w-[65%] max-md:ml-0 max-md:w-full">
                    <div className="text-lg leading-7 text-neutral-900 max-md:mt-10">
                      Cal.com enables you to build processes around your events.
                      Notifications, reminders and follow ups are automatically
                      taken care of.
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
              <div className="flex gap-9 self-end">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/26b0d7405bee7a6011938dc202f2ffb1918253bc13098b1aafd8488bde88eaa0?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 self-start w-14 rounded-full aspect-square"
                />
                <div className="flex flex-col grow shrink-0 justify-center py-1 border-solid basis-0 border-[14px] border-neutral-900 rounded-[32px_32px_0px_0px] w-fit">
                  <img
                    loading="lazy"
                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/7bc6ea7af6eb680261d495cbf483e49e01093b8727689e2d84433112c57372cc?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                    className="object-contain w-full aspect-[1.43]"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-6 pr-20 pb-10 pl-8 border-t-2 border-neutral-900 text-neutral-900 max-md:px-5 max-md:max-w-full">
                <div className="text-2xl leading-none">
                  Scheduling for your team
                </div>
                <div className="mt-2 text-lg leading-7">
                  Round-Robin scheduling ensures even distribution of calls
                  across your team. Collective availability makes it easy to
                  book your team when everyone is available.
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
            <div className="flex overflow-hidden flex-col grow py-0.5 pr-0.5 pl-4 rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 text-neutral-900 max-md:mt-6 max-md:max-w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6ad1e8dc5e75766717783d6a258ec2ac5ede0290c5b0c850c46941a7344193f?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain w-full aspect-[1.71] max-md:max-w-full"
              />
              <div className="flex flex-col pt-6 pr-14 pb-10 pl-8 border-t-2 border-neutral-900 max-md:px-5 max-md:max-w-full">
                <div className="text-xl leading-loose">
                  Route bookers to the right person
                </div>
                <div className="mt-2 text-lg leading-7">
                  Ensure every booker is connected to the right person with
                  Routing Forms. Ask screening questions and automatically
                  connect bookers to the right person, event or even to a link.
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
            <div className="flex overflow-hidden flex-col grow py-0.5 pr-0.5 pl-4 rounded-2xl border-r-2 border-l-[17px] border-neutral-900 border-y-2 text-neutral-900 max-md:mt-6 max-md:max-w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/6f0f43489935a17dcaf7d99626d3bec2002ea8bba045f7344c34c82a0a016af7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain w-full aspect-[1.7] max-md:max-w-full"
              />
              <div className="flex flex-col pt-6 pr-20 pb-10 pl-8 border-t-2 border-neutral-900 max-md:px-5 max-md:max-w-full">
                <div className="text-2xl leading-none">
                  Avoid meeting overload
                </div>
                <div className="mt-2 text-lg leading-7">
                  Limit people from overbooking you on a weekly or daily basis.
                  Put breathing room between meetings with buffers either side
                  and prevent surprises with minimum notice periods.
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
                <div className="basis-auto">Pay to meet</div>
              </div>
              <div className="flex gap-3 py-px w-[212px]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/387a6384b3a2c59cdb39d59615ee5b75287b3997867d6bbbbb24ddb536c236ff?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 my-auto w-2 aspect-square"
                />
                <div className="basis-auto">Embed it anywhere</div>
              </div>
              <div className="flex gap-3 py-px w-[181px]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/dae6e33e344e146ec7e1394031e326eaaeae8f254259990be4fc80011adb6b84?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 my-auto w-2 aspect-square"
                />
                <div className="basis-auto">Opt-in bookings</div>
              </div>
              <div className="flex gap-3 py-px w-[222px]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/45283cefda64cd442209278d2cc5824ee1ec996ac947a15e9e72e48913bf3f61?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 my-auto w-2 aspect-square"
                />
                <div className="basis-auto">Simple rescheduling</div>
              </div>
              <div className="flex gap-3 py-px text-xl leading-loose min-w-[240px] w-[318px]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3893f89aedff2c8cc074033bd44ec65f8d1dcd9a0b484d0d5e3d1298a2062326?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 my-auto w-2 aspect-square"
                />
                <div className="flex-auto">Available in over 26 languages</div>
              </div>
              <div className="flex gap-3 py-px w-[232px]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/4b1efac0c0531a8792984cae483f0e863b9141fdb4578bc03e82533e4f1e2390?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                  className="object-contain shrink-0 my-auto w-2 aspect-square"
                />
                <div className="basis-auto">Hashed booking links</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden flex-col mt-3 w-full max-w-[1372px] max-md:max-w-full">
          <div className="flex flex-wrap gap-3 items-start pr-2.5">
            <div className="flex relative flex-col px-5 text-xl leading-loose aspect-[4.452] w-[138px]">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/b311a10282d751e7446c2ab40f8d130a792c9aa50f0e11843dbbbf977b3b2e8e?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-cover absolute inset-0 size-full"
              />
              Pay to meet
            </div>
            <div className="flex gap-3 w-[212px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5e5cc1c42c38a61ccdf2ab73004f4e1fc542df41fcf4ee42a43cfbcfaa316b99?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 my-auto w-2 aspect-square"
              />
              <div className="basis-auto">Embed it anywhere</div>
            </div>
            <div className="flex gap-3 w-[181px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/265579aa2b8e94b278704916b13b86346d4d4a38ad92db200968c5bcfd8e56e7?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 my-auto w-2 aspect-square"
              />
              <div className="basis-auto">Opt-in bookings</div>
            </div>
            <div className="flex gap-3 w-[222px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/349c4d78ed5b11b48fa1b49afdfe7583b7e0b979f2b08229c79d1c98d4b83bfe?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 my-auto w-2 aspect-square"
              />
              <div className="basis-auto">Simple rescheduling</div>
            </div>
            <div className="flex gap-3 text-xl leading-loose min-w-[240px] w-[318px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/647e6af2041d11395a80af31cf4b123de378223a10571ce80d8b1207609fc298?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 my-auto w-2 aspect-square"
              />
              <div className="flex-auto">Available in over 26 languages</div>
            </div>
            <div className="flex gap-3 w-[232px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/90c4717abb701bf2c88ad525a37070ccc59fb099262e24b033e731e0337b9616?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 my-auto w-2 aspect-square"
              />
              <div className="basis-auto">Hashed booking links</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex overflow-hidden flex-col mt-28 w-full text-center text-neutral-900 max-md:mt-10 max-md:max-w-full">
        <div className="flex relative flex-col justify-center items-center px-20 py-28 w-full min-h-[597px] max-md:px-5 max-md:py-24 max-md:max-w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d071c96c72b6e95760a0ee1121ab4ae624da33d2b201a2dae50c22846afab477?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
            className="object-cover absolute inset-0 size-full"
          />
          <div className="flex relative flex-col mb-0 max-w-full w-[359px] max-md:mb-2.5">
            <div className="text-6xl leading-[62px] max-md:mr-1.5 max-md:ml-2 max-md:text-4xl max-md:leading-[50px]">
              Connect your favorite apps
            </div>
            <div className="mt-10 text-xl leading-8">
              Cal.com works with all apps already in your scheduling flow
              ensuring everything works perfectly together.
            </div>
            <div className="flex gap-5 px-14 py-9 mt-9 mr-3.5 ml-4 text-xl font-semibold leading-none uppercase bg-gray-50 border-2 border-solid border-neutral-900 rounded-[32px] shadow-[0px_4px_0px_rgba(20,20,20,1)] max-md:px-5 max-md:mx-2.5">
              <div className="grow">Explore all apps</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed47eae7a15ea000ab4095efae43a3cacb0d08a11c6134381ce07fa5850b34b1?placeholderIfAbsent=true&apiKey=fdb7b9e08a6a45868cbaa43480e243cd"
                className="object-contain shrink-0 self-start mt-1.5 aspect-square w-[15px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="self-center mt-32 text-8xl tracking-tighter text-center leading-[93px] text-neutral-900 max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
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
                        Cardiologists from California focussing on fitness and
                        performance
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
                    Build Telemedicine to allow patients to book appointments
                    with doctors and therapists.
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
    </div>
  );
}



export async function loader({ request, params, placeholder }) {
  return null
}


export const meta: MetaFunction = () => {
  return [
    { title: ' Contact Us | Dealer Sales Assistant' },
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


export const action: ActionFunction = async ({ request, }) => {
  const formPayload = Object.fromEntries(await request.formData())
  console.log(formPayload, 'before dealerlead is created')
  const lead = await prisma.dSALeads.create({
    data: {
      dealerName: formPayload.dealerName,
      dealerAddress: formPayload.dealerAddress,
      dealerCity: formPayload.dealerCity,
      dealerProv: formPayload.dealerProv,
      dealerPostal: formPayload.dealerPostal,
      dealerPhone: formPayload.dealerPhone,
      ownerName: formPayload.ownerName,
      ownerEmail: formPayload.ownerEmail,
      ownerPhone: formPayload.ownerPhone,
      adminName: formPayload.adminName,
      adminEmail: formPayload.adminEmail,
      adminPhone: formPayload.adminPhone,
      dealerEtransferEmail: formPayload.dealerEtransferEmail,
      message: formPayload.message,

      generatedFrom: 'Contact us via dealer pricing',
      infoBeforePurchase: formPayload.infoBeforePurchase ? formPayload.infoBeforePurchase : false,
      justlooking: formPayload.justlooking ? formPayload.justlooking : false,
      demoBeforePurchase: formPayload.demoBeforePurchase ? formPayload.demoBeforePurchase : false,
      seekingAppointment: formPayload.seekingAppointment ? formPayload.seekingAppointment : false,

      timeToPurchase: Boolean(formPayload.asap) === true ? 'ASAP' :
        Boolean(formPayload.justlooking) === true ? 'Just looking' :
          Boolean(formPayload.infoBeforePurchase) === true ? "Haven't made a descion yet, if I make one, but I require more information." :
            Boolean(formPayload.seekingAppointment) === true ? " Looking to set up an appointment with someone to discuss everything." :
              "Did not make a decision"

      ,
      triedDemo: formPayload.triedDemo,
    }
  })


  const customer = {
    firstName: formPayload.firstName,
    lastName: formPayload.lastName,
    email: formPayload.email,
    message: formPayload.message,
  }
  console.log(customer)
  const sendEmail = await CheckingDealerPlan(customer)
  return json({ sendEmail })
}

export   function Component() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div
      className="relative  flex-col items-start gap-8 md:flex pl-3 pr-3 md:w-[30%] text-foreground mx-auto"
    >
      <Form method='post' className="grid w-full items-start gap-6">

        <fieldset className="grid gap-6 rounded-lg border p-4 border-border  bg-background">
          <legend className="-ml-1 px-1 text-sm font-medium">Contact Us</legend>
          <p>Maybe you just need to talk to someone? Or you would like to try it first? Reach out, we can help you out and accommodate any situation and over come any obstacle or objection that may arise. No matter how weird or complicated your situation is, we will come up with a solution to fit.</p>
          <div className="grid gap-3">
            <Label htmlFor="role">First Name</Label>
            <Input name="firstName" placeholder='John' className="bg-background text-foreground  border-border " />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Last Name</Label>
            <Input name="lastName" placeholder='Wick' className="bg-background text-foreground  border-border " />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Email</Label>
            <Input name="email" placeholder='johnwick@thecontinental.com' className="bg-background text-foreground  border-border " />
          </div>
          <p className='text-center text-foreground'>To serve you better, check off any / all that apply, if they do, and leave a quick message in the box describing what your looking for / need.</p>
          <div className="flex items-center space-x-2">
            <Checkbox name="demoBeforePurchase" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Requesting demo before purchase.
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="justlooking" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Just looking...
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="infoBeforePurchase" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Haven't made a descion yet, if I make one, but I require more information.
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="seekingAppointment" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Looking to set up an appointment with someone to discuss everything.
            </label>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="content">Message</Label>
            <TextArea
              name="message"
              placeholder="Type your message here..."
              className="bg-background min-h-[9.5rem] text-foreground  border-border"
            />
          </div>
          <p className='text-center text-foreground'>Foreseeable purchase date.</p>
          <div className="flex items-center space-x-2">
            <Checkbox name="asap" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ASAP
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="twoToFour" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              2-4 weeks
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="twoPlusMonths" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              2-4 months
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="twoPlusMonths" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              5 + months
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notInterested" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Not interested
            </label>
          </div>
          <ButtonLoading
            onClick={() =>
              toast.success("Thank you for your inquiry!", {
                description: 'Someone will respond as soon as possible.',
              })
            }
            size="lg"
            type="submit"
            isSubmitting={isSubmitting}
            loadingText="Sending email now..."
            className="ml-auto mt-5 w-auto cursor-pointer border-border text-foreground hover:text-primary"
          >
            Submit
          </ButtonLoading>

        </fieldset>
      </Form>
    </div>
  )
}
