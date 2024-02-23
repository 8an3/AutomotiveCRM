/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Tabs, TabsContent, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Label, Separator, Button, SheetFooter, SheetClose, SheetContent, Sheet, SheetTrigger, TextArea, ScrollArea,
} from "~/components/ui/index"
import jsPDF from 'jspdf'

import { PrintSpec } from './printSpec'
import { ModelPage } from './modelPage'
import { PrintDealer } from "../../components/formToPrint/printDealer"
import PrintContract from "../../components/formToPrint/printContact"
import PrintUCDA from "~/components/formToPrint/printUcda"

const FeaturePop = ({ finance, user }) => {
  /**
   * <div className="">
                <Button disabled className="cursor-pointer" type="submit" content="update">
                  Customer W/S - Unavailable
                </Button>
              </div>

               <div className="">
                <Button disabled className=" cursor-pointer" type="submit" content="update">
                  Test Drive Docs - Unavailable
                </Button>
              </div>
   */
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='rounded-md border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border' >
          Features
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] bg-slate1 text-slate12 border-2 border-slate12">
        <div className="grid">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Features</h4>
          </div>
          <div className="flex ">
            <div className='grid grid-cols-1 gap-2'>


              <div className="mx-auto justify-center">
                <PrintSpec />
              </div>
              <ModelPage />

              <Button className=" border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" >
                <a href="/leads" target="_blank"  >
                  Dashboard
                </a>
              </Button>
              <Button className=" border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" >
                <a href={`/customer/${finance.id}`} target="_blank">
                  Client File
                </a>
              </Button>
            </div>
          </div>
          <div className="flex justify-between mb-[10px] mt-3">

          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FeaturePop


