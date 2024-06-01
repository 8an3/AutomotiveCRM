import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '~/components/ui/index'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "~/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { PhoneOutcome, MenuScale, MailOut, MessageText, User, ArrowDown } from "iconoir-react";
import { useFetcher } from '@remix-run/react';

const ComsCard = ({ row }) => {
    const fetcher = useFetcher();

    return (
        <Popover>
            <PopoverTrigger>{row.getValue("touches")}

            </PopoverTrigger>
            <PopoverContent>
                <h3 className="text-2xl font-thin">
                    Comms
                </h3>
                <Separator />
                <div className='gap-3 my-2 grid grid-cols-3'>
                    <Button name="intent" type="submit" className='mt-3 mr-3' value='callClient'>
                        <PhoneOutcome />
                    </Button>
                    <Button name="intent" type="submit" className='mt-3 mr-3' value='emailClient' >
                        <MailOut />
                    </Button>
                    <Button name="intent" type="submit" className='mt-3 mr-3' value='textClient'  >
                        <MessageText />
                    </Button>
                </div>
                <div className='grid grid-cols-3 justify-center mt-2'>
                    <p className=" text-sm mx-auto">
                        1
                    </p>
                    <p className=" text-sm mx-auto">
                        3
                    </p>
                    <p className=" text-sm mx-auto">
                        2
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    )

}
export default ComsCard
