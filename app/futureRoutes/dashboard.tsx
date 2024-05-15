import { Links, Meta, Outlet } from "@remix-run/react";
import {
  type MetaFunction,
  redirect,
  type LoaderFunction,
} from "@remix-run/node";
import { requireUserSession } from "~/helpers";
//import { authenticator } from "~/services";
import { model } from "~/models";
import ApptList from "~/components/dashboard/customer/apptList";



export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};

export default function Quote() {

  return (
    <>

      <div className="flex min-h-screen  px-2 sm:px-1 lg:px-3 bg-[#09090b] border-gray-300 font-bold uppercase hover:text-[#02a9ff] ">
        <div className="w-full  rounded-lg ">
          <div className="mx-auto my-auto md:flex">
            <div className="mx-auto my-auto   ">
              <div className="mx-auto my-auto ">
                <Outlet />
              </div>

            </div>
          </div>
        </div>
      </div>

    </>
  );
}
