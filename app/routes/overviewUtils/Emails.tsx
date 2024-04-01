
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

const EmailSheet = (finance) => {
    console.groupCollapsed(finance, 'emailsheet')
    return (
        <Sheet variant='left'>
            <SheetTrigger asChild>
                <Button className='rounded-md border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border' >
                    Emails</Button>
            </SheetTrigger>
            <SheetContent side='right' className='bg-slate1 text-slate12 w-[500px] mt-3 ml-3 mr-3' >
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
                        <Form method="post" action="/emails/send/payments">
                            <input type="hidden" name="financeId" value={finance.id} />
                            <Select name="emailType">
                                <SelectTrigger className=" mt-2 rounded-[0px] border">
                                    <SelectValue placeholder="Select an email..." />
                                </SelectTrigger>
                                <SelectContent className="">
                                    <ScrollArea className="h-[300px] w-[350px] rounded-md text-slate12 bg-slate1 p-4 border border-slate12">
                                        <SelectGroup>
                                            <SelectLabel>Payments </SelectLabel>
                                            <SelectItem value="">Select None</SelectItem>
                                            <SelectItem value="paymentsTemp">Payments</SelectItem>{/* 1*/}
                                            <SelectItem value="wBreakdownTemp">W/ Full Breakdown</SelectItem>{/*2 */}
                                            <SelectItem value="wSpecTemp">W/ Full Breakdown & Spec</SelectItem>{/* 3*/}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Options</SelectLabel>
                                            <SelectItem value="wOptionsTemp">W/ Options</SelectItem>{/* 4*/}
                                            <SelectItem value="optionsWBreakdownTemp">Options W/ Full Breakdown</SelectItem>{/* 5*/}
                                            <SelectItem value="optionsWSpecTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*6 */}
                                        </SelectGroup>
                                        <hr className="solid" />
                                        <SelectGroup>
                                            <SelectLabel>No Tax</SelectLabel>
                                            <SelectItem value="paymentsNoTaxTemp">Payments</SelectItem>{/* 7*/}
                                            <SelectItem value="wBreakdownNoTaxTemp">W/ Full Breakdown</SelectItem>{/* 8*/}
                                            <SelectItem value="wSpecNoTaxTemp">W/ Full Breakdown & Spec</SelectItem>{/*9 */}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Options</SelectLabel>
                                            <SelectItem value="wOptionsNoTaxTemp">W/ Options</SelectItem>{/* 10*/}
                                            <SelectItem value="optionsWBreakdownNoTaxTemp">Options W/ Full Breakdown</SelectItem>{/*11 */}
                                            <SelectItem value="optionsWSpecNoTaxTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*12 */}
                                        </SelectGroup>
                                        <hr className="solid" />
                                        <SelectGroup>
                                            <SelectLabel>Custom Tax</SelectLabel>
                                            <SelectItem value="paymentsCustomTemp">Payments</SelectItem>{/*13 */}
                                            <SelectItem value="wBreakdownCustomTemp">W/ Full Breakdown</SelectItem>{/*14 */}
                                            <SelectItem value="wSpecCustomTemp">W/ Full Breakdown & Spec</SelectItem>{/* 15*/}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Options</SelectLabel>
                                            <SelectItem value="wOptionsCustomTemp">W/ Options</SelectItem>{/*16 */}
                                            <SelectItem value="optionsWBreakdownCustomTemp">Options W/ Full Breakdown</SelectItem>{/*17 */}
                                            <SelectItem value="optionsWSpecCustomTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*18 */}
                                        </SelectGroup>
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                            <Button className="mt-2 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" type="submit" name="intent" value="justpaymentsCustom" >
                                Email
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


                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default EmailSheet
