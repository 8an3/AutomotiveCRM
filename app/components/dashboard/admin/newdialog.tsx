import * as React from "react"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "~/components/ui/button"
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
import { NavLink } from "@remix-run/react"
import { options2 } from "~/components/shared/shared"
import { Separator } from "~/components/ui"



export function DrawerDemo({ data, user, deFees, salesPerson }) {

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Orders</Button>
      </DrawerTrigger>
      <DrawerContent className='border-border'>
        <div className="mx-auto w-full max-w-[1000px]">
          <DrawerHeader>
            <DrawerTitle>Client</DrawerTitle>
            <DrawerDescription>Every contract and order the client has had.</DrawerDescription>
          </DrawerHeader>
          <div className='grid grid-cols-4'>
            <NavLink to={`/dealer/sales/customer/${data.id}/profile`}>
              <Button variant='ghost' className="hover:bg-muted/50 text-[#a1a1aa]  w-[90%] justify-start" >
                Client Profile
              </Button>
            </NavLink>
            <div className='h-auto max-h-[300px] overflow-y-auto'>
              <p className='ml-5'>Sales Contracts</p>
              <Separator className='w-[90%] mb-5 mx-auto' />
              {data.Finance && data.Finance.map((result, index) => (
                <NavLink key={index} to={`/dealer/sales/customer/${data.id}/${result.id}`}>
                  <Button variant='ghost' className="hover:bg-muted/50 text-[#a1a1aa]  w-[90%] justify-start " >
                    {result.model}
                  </Button>
                </NavLink>
              ))}
            </div>
            <div className='h-auto max-h-[300px] overflow-y-auto'>
              <p className=' ml-5'>Accessory Orders</p>
              <Separator className='w-[90%] mb-5 mx-auto' />
              {data.AccOrder && data.AccOrder.map((result, index) => (
                <NavLink key={index} to={`/dealer/accessories/newOrder/${result.id}`}>
                  <Button variant='ghost' className="hover:bg-muted/50 text-[#a1a1aa]  w-[90%] justify-start" >
                    {new Date(result.createdAt).toLocaleDateString("en-US", options2)}
                  </Button>
                </NavLink>
              ))}
            </div>
            <div className='h-auto max-h-[300px] overflow-y-auto'>
              <p className=' ml-5'>Work Orders</p>
              <Separator className='w-[90%] mb-5 mx-auto' />
              {data.WorkOrder && data.WorkOrder.map((result, index) => (
                <NavLink key={index} to={`/dealer/service/order/${result.id}`}>
                  <Button variant='ghost' className="hover:bg-muted/50 text-[#a1a1aa]  w-[90%] justify-start" >
                    {result.unit} {new Date(result.createdAt).toLocaleDateString("en-US", options2)}
                  </Button>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-[250px] mx-auto">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer >
  )
}
