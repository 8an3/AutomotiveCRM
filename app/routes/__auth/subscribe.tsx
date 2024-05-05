import React from 'react';
import { Button } from "~/components/ui/button"
import { LinksFunction, type MetaFunction, DataFunctionArgs, V2_MetaFunction } from '@remix-run/node'
import {
    Form, Link, Links, LiveReload, useNavigation, Outlet, Scripts, ScrollRestoration, useFetcher, useFetchers, useLoaderData, useMatches, useSubmit,
} from '@remix-run/react'
import { ButtonLoading } from "~/components/ui/button-loading";
import { toast } from "sonner"
import { Separator } from '~/components';

export const meta: MetaFunction = ({ data }) => {
    return [
        { title: "Subscribe - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM',

        },
    ];
};


export default function Subscribe() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
        <>
            <div className="flex px-4 py-12 sm:px-6 lg:px-8 centered-center bg-black">
                <div className="w-full  h-full ">
                    <div className="md:flex">
                        <div className="p-4 mx-auto my-auto">
                            <div className='grid grid-cols-1 place-content-center mx-auto my-auto	mt-6' >
                                <div className="item-4 grid grid-cols-1 scriptcard justify-end mx-auto my-auto ">
                                    <div className="text-center">
                                        <h2 className="scriptcardText text-white text-3xl sm:mt-0 mt-6 font-thin tracking-tight  sm:text-4xl mb-6 ">
                                            Subscription Plans
                                        </h2>
                                        <p className="scriptcardText text-[#fff]">
                                            Cancel at any time with no penalty.
                                        </p>
                                        <div className='mx-auto grid grid-cols-2 justify-center mb-[40px]  mt-[75px] '>
                                            <a href='https://buy.stripe.com/14k6pTg9J0IV0G4fYZ' target="_blank" className='mr-2'>
                                                <div className='p-1 mx-auto h-[700px] w-[550px] rounded-md border border-white cursor-pointer hover:border-[#02a9ff]' onClick={() => {
                                                }}>
                                                    <h1 className='mt-[40px] text-center text-white  bold text-4xl'>Sales People</h1>
                                                    <Separator className='text-white' />
                                                    <h3 className="scriptcardTitler text-[#fff]">
                                                        For a limited time $19.95/MONTH
                                                    </h3>
                                                    <br className='my-1' />

                                                    <p className='px-[40px]  py-[10px] text-center  text-myColor-200 '>
                                                        Sales person specific made dashboard.
                                                    </p>
                                                    <br className='my-1' />
                                                    <p className='px-[40px]  py-[10px] text-center  text-myColor-200 '>
                                                        Perfect calendar for plan your sales day.
                                                    </p>
                                                    <br className='my-1' />
                                                    <p className='px-[40px]  py-[10px] text-center  text-myColor-200 '>
                                                        Process designed to eliminate sales process steps instead of adding to it.
                                                    </p>
                                                    <br className='my-1' />
                                                    <p className='px-[40px] py-[10px]  text-center  text-myColor-200 '>
                                                        However, adopting our CRM will significantly elevate your sales game, surpassing the impact of the last five sales training sessions. Guaranteed to be the most significant change in your career, whether you're a newcomer, a sales superstar, or a seasoned salesperson who isn't tech-savvy. You'll undoubtedly see a remarkable increase—Just read the upcoming story about wasting time with mass emails.
                                                    </p>
                                                    <p className='px-[40px] py-[10px]  text-center  text-myColor-200 '>
                                                        Click on the card to continue.
                                                    </p>
                                                </div>
                                            </a>

                                            <a href='https://buy.stripe.com/14k6pTg9J0IV0G4fYZ' target="_blank" className='ml-2'>
                                                <div className='p4 mx-auto h-[700px] w-[550px] cursor-pointer   rounded-md border border-white text-white hover:border-[#02a9ff]'
                                                    onClick={() => {
                                                    }}>
                                                    <h1 className='mt-[40px] text-center text-white  bold text-4xl'>Dealers</h1>
                                                    <Separator className='text-white' />
                                                    <h3 className="scriptcardTitler text-[#fff]">
                                                        For a limited time $19.95/MONTH
                                                    </h3>
                                                    <br className='my-1' />
                                                    <div className="text-center">
                                                        <p className="px-8 py-5 text-myColor-200">
                                                            Increase your revenue and streamline training for new hires by using our CRM. It's not just easier for your employees but also provides an excellent way to present and upsell to every customer.
                                                        </p>
                                                        <br className="my-1" />
                                                        <p className="px-8 py-3 text-myColor-200">
                                                            Experience quicker sales with fewer customer questions. The easy-to-read information about the deal makes customers happier. Your sales team can effortlessly close deals without getting hung up on questions or uncertainty through the process.
                                                        </p>
                                                        <br className="my-1" />
                                                        <p className="px-8 py-3 text-myColor-200">
                                                            Eliminate paperwork for your salespeople. Our system handles all necessary paperwork, allowing your sales team to hit print, and the system takes care of the rest. Save time and boost profits across any dealership.
                                                        </p>
                                                        <br className="my-1" />
                                                        <p className="px-8 py-3 text-myColor-200">
                                                            Discover more benefits by exploring our system. Stay tuned for an in-depth video covering the entire system and addressing how the industry has done us wrong. If you're here, you're already moving in the right direction. To top it off, we have one advatange none of the CRM providors have.
                                                        </p>
                                                    </div>
                                                    <p className='px-[40px] py-[10px]  text-center  text-myColor-200 '>
                                                        Click on the card to continue.
                                                    </p>
                                                </div>
                                            </a>

                                        </div>

                                        <p className="scriptcardText text-sm mt-6 text-[#fff]">
                                            Once subscribed you can continue to the walkthrough.
                                        </p>
                                        <Link to='/checksubscription' >
                                            <ButtonLoading
                                                onClick={() => toast.success(`Thank-you for your business!`)}
                                                size="lg"
                                                name='intent'
                                                value='returnToQuote'
                                                type='submit'
                                                isSubmitting={isSubmitting}
                                                loadingText="Checking Subscription..."
                                                className="w-auto cursor-pointer ml-auto mt-5  text-[#fff] border-[#fff]hover:text-[#02a9ff]"
                                            >
                                                Continue
                                            </ButtonLoading>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
