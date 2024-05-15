import { type MetaFunction, } from '@remix-run/node'
import { Separator, Button, } from '~/components/ui/index'
import Walkthrough from '~/routes/images/walkthriugh.png'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
    return [
        { title: "Your First Quote - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content: "To help sales people achieve more. Every automotive dealer needs help, especially the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM',
        },
    ];
};

export default function Dealerfees() {
    return (
        <>
            <div className='welcomeDealerfees'>
                <div>
                    <div className="mt-3">
                        <h3 className="text-2xl font-thin">
                            Your First Quote
                        </h3>
                        <Separator className='separatorDF  mb-10' />
                    </div>
                    <p className=" text-sm">
                        If any issues questions come up, your more than welcome to send them in and we will answer them as soon as possible.
                    </p>
                    <p className=" text-sm">
                        For more detailed walkthroughs, they will be in your settings under docs.
                    </p>

                </div>
                <Separator className='separatorDF mt-10 mb-10' />
                <img alt="logo" src={Walkthrough} className='mx-auto' />
                <Separator className='separatorDF mt-10 mb-10' />
                <Link to='/quote/Harley-Davidson'>
                    <Button type="submit" className="bg-[#02a9ff] cursor-pointer mb-10 w-[75px] ml-2  mr-2 text-[#fafafa] active:bg-[#0176b2] font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
                        Next
                    </Button>
                </Link>
            </div>
        </>
    )
}
