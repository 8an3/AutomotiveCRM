import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuItem, } from '~/components/ui/index'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "~/other/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/other/tabs"
import { PhoneOutcome, MenuScale, MailOut, MessageText, User, ArrowDown } from "iconoir-react";
import { Form, useFetcher, useSubmit } from '@remix-run/react';
import PropTypes from 'prop-types'


const PresetFollowUpDay = ({ data }) => {
    const submit = useSubmit();
    const id = data.id ? data.id.toString() : '';
    const fetcher = useFetcher();
    return (
        <fetcher.Form method="post" onChange={(event) => {
            submit(event.currentTarget);
        }}>
            <select defaultValue={data.followUpDay} name='followUpDay' className="mx-auto rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
            >
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
            </select>
            <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
            <Input type="hidden" defaultValue={data.id} name="financeId" />
            <Input type="hidden" defaultValue={id} name="id" />
            <Input type="hidden" defaultValue={data.brand} name="brand" />
            <Input type="hidden" defaultValue='updateFinance' name="intent" />
        </fetcher.Form>
    );
}

export default PresetFollowUpDay;
