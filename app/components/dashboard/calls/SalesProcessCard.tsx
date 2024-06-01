import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '~/components/ui/index'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "~/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { PhoneOutcome, MenuScale, MailOut, MessageText, User, ArrowDown } from "iconoir-react";


const SalesProcessCard = ({ data }) => {
    return (
        <Popover >
            <PopoverTrigger>
                <Button name="intent" type="submit" className='mt-3 w-full '>
                    SALES PROCESS
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[750px]">

                <Separator />
                <div className='grid grid-cols-3'>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Appt.
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Visit
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Test Drive
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Deposit
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Follow-up
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Manager Turn Over/Try to close
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Test Drive
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Sold
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Referral
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Finance
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Delivered
                        </label>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
export default SalesProcessCard
