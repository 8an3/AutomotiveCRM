/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Tabs, TabsContent, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Label, Separator, Button, SheetFooter, SheetClose, SheetContent, Sheet, SheetTrigger, TextArea, ScrollArea,
} from "~/components/ui/index"
import jsPDF from 'jspdf'
import { ButtonLoading } from "~/components/ui/button-loading";
import { PrintSpec } from './printSpec'
import { ModelPage } from './modelPage'
import { PrintDealer } from "~/components/formToPrint/printDealer"
import PrintContract from "~/components/formToPrint/printContact"
import PrintUCDA from "~/components/formToPrint/printUcda"
import { Form, useNavigation } from "@remix-run/react"
import { toast } from "sonner"

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
  const lockedValue = true

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='rounded-md border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border' >
          Features
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] bg-slate1 text-[#fafafa] border-2 border-slate12">
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
              <a className="w-full mx-auto" href="/leads/sales" target="_blank"  >
                <Button className="w-full border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" >
                  Dashboard
                </Button>
              </a>
              <a className="w-full mx-auto" href={`/customer/${finance.clientfileId}/${finance.id}`} target="_blank">
                <Button className=" w-full border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" >
                  Client File
                </Button>
              </a>

              <Form method='post' >
                <input type='hidden' name='intent' value='financeTurnover' />
                <input type='hidden' name='locked' value={lockedValue} />
                <input type='hidden' name='financeId' value={finance.id} />

                <ButtonLoading
                  size="lg"
                  className="w-full cursor-pointer ml-auto p-5 hover:text-[#02a9ff]"
                  type="submit"
                  isSubmitting={isSubmitting}
                  onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                  loadingText="Notifying finance managers..."
                >
                  Finance Turnover
                </ButtonLoading>
              </Form>


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


