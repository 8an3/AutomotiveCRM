
import {
    Tabs, TabsContent, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, AccordionContent, AccordionItem, AccordionTrigger, Input, Label, Separator, Button, TextArea,
} from "~/components/ui/index"
import { Form, Link, useFetcher, useLoaderData, useParams, } from '@remix-run/react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/other/select"
import { ScrollArea } from "~/other/scrollarea"
import { SendEmail, SendPayments } from "~/routes/__authorized/dealer/email.server"

const EmailSheet = (finance) => {
    const { user, tokens } = useLoaderData()
    console.groupCollapsed(finance, 'emailsheet')
    console.log(user, tokens, 'emails popup')
    function handleSendPayments() {
        console.log(user, tokens, 'inside handesendpayments')
        const send = SendPayments(tokens, user)
        return send
    }
    return (
        <Sheet variant='left'>
            <SheetTrigger asChild>
                <Button className='rounded-md border border-black  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border' >
                    Emails
                </Button>
            </SheetTrigger>
            <SheetContent side='right' className='bg-slate1 text-black w-[500px] mt-3 ml-3 mr-3' >
                <div className="grid gap-2">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                            Email Templates
                        </h4>
                        <p className="text-muted-foreground text-sm">
                            Be sure to update before selecting an email to send.
                        </p>
                        <p className="text-muted-foreground text-sm mt-2">
                            Options - would include gap, warranties, etc
                        </p>
                        <p className="text-muted-foreground text-sm mt-2">
                            These are templated emails, send one to yourself first to ensure you like the content.
                        </p>
                        <hr className="solid" />
                    </div>
                    <div className="w-[95%]">

                        <Form method='post' >
                            <input type="hidden" name="financeId" value={finance.id} />
                            <input type="hidden" name="template" value='justPayments' />
                            <Button
                                type='submit'
                                name='intent'
                                value='sendPayments'
                                className='w-auto mt-2 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border'
                            >
                                Send Payments
                            </Button>
                        </Form>
                        <Form method='post' >
                            <input type="hidden" name="financeId" value={finance.id} />
                            <input type="hidden" name="template" value='FullBreakdown' />

                            <Button
                                type='submit'
                                name='intent'
                                value='sendPayments'
                                className='w-auto mt-2 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border'
                            >
                                Full Breakdown

                            </Button>
                        </Form>
                        <Form method='post' >
                            <input type="hidden" name="template" value='justPayments' />
                            <input type="hidden" name="financeId" value='FullBreakdownWOptions' />
                            <Button
                                disabled
                                type='submit'
                                name='intent'
                                value='sendPayments'
                                className='w-auto mt-2 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border'
                            >
                                Full Breakdown W/ Options
                            </Button>
                        </Form>
                        <div className="space-y-2 mt-4">
                            <h4 className="font-medium leading-none">
                                Custom Email Templates
                            </h4>
                            <p className="text-muted-foreground text-sm">
                                Instead of a complete template, with these you can insert your own body but still get all the payments and breakdowns already done.
                            </p>
                            <hr className="solid" />
                        </div>
                        <Form method="post" action="/emails/send/payments">
                            <input type="hidden" name="financeId" value={finance.id} />

                            <TextArea
                                placeholder="Type your message here."
                                name="customContent"
                                className="h-[250px] mt-2 bg-slate1"
                            />
                            <Select name="emailType" >
                                <SelectTrigger className="w-full mt-2">
                                    <SelectValue placeholder="Payments (by default)" />
                                </SelectTrigger>
                                <SelectContent className="">
                                    <ScrollArea className="h-[300px] w-[350px] rounded-md text-slate12 bg-slate1 p-4 border border-slate12">                                        <SelectGroup>
                                        <SelectLabel>Payments </SelectLabel>
                                        <SelectItem value="payments">Payments</SelectItem>{/*19 */}
                                        <SelectItem value="wBreakdown">W/ Full Breakdown</SelectItem>{/* 20*/}
                                        <SelectItem value="wSpec">W/ Full Breakdown & Spec</SelectItem>{/*21 */}
                                    </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Options</SelectLabel>
                                            <SelectItem value="wOptions">W/ Options</SelectItem>{/* 22*/}
                                            <SelectItem value="optionsWBreakdown">Options W/ Full Breakdown</SelectItem>{/* 23*/}
                                            <SelectItem value="optionsWSpec"> Options W/ Full Breakdown & Spec</SelectItem>{/*24 */}
                                        </SelectGroup>
                                        <hr className="solid" />
                                        <SelectGroup>
                                            <SelectLabel>No Tax</SelectLabel>
                                            <SelectItem value="paymentsNoTax">Payments</SelectItem>{/*25 */}
                                            <SelectItem value="wBreakdownNoTax">W/ Full Breakdown</SelectItem>{/* 26*/}
                                            <SelectItem value="wSpecNoTax">W/ Full Breakdown & Spec</SelectItem>{/*27 */}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Options</SelectLabel>
                                            <SelectItem value="wOptionsNoTax">W/ Options</SelectItem>{/*28 */}
                                            <SelectItem value="optionsWBreakdownNoTax">Options W/ Full Breakdown</SelectItem>{/* 29*/}
                                            <SelectItem value="optionsWSpecNoTax"> Options W/ Full Breakdown & Spec</SelectItem>{/* 30*/}
                                        </SelectGroup>
                                        <hr className="solid" />
                                        <SelectGroup>
                                            <SelectLabel>Custom Tax</SelectLabel>
                                            <SelectItem value="paymentsCustom">Payments</SelectItem>{/*31*/}
                                            <SelectItem value="wBreakdownCustom">W/ Full Breakdown</SelectItem>{/*32 */}
                                            <SelectItem value="wSpecCustom">W/ Full Breakdown & Spec</SelectItem>{/* 33*/}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Options</SelectLabel>
                                            <SelectItem value="wOptionsCustom">W/ Options</SelectItem>{/*34 */}
                                            <SelectItem value="optionsWBreakdownCustom">Options W/ Full Breakdown</SelectItem>{/*35 */}
                                            <SelectItem value="optionsWSpecCustom">W/ Full Breakdown & Spec</SelectItem>{/*36 */}
                                        </SelectGroup>
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                            <Button className="w-auto mt-2 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" type="submit" name="intent" value="justpaymentsCustom">
                                Email
                            </Button>
                        </Form>
                        <Form method='post' >
                            <input type="hidden" name="financeId" value={finance.id} />
                            <Button
                                type='submit'
                                name='intent'
                                value='sendPayments'
                                className={` text-black border border-black mr-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
                            >
                                Send Payments
                            </Button>
                        </Form>

                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default EmailSheet
