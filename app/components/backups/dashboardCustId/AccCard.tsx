import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";
import { Form, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import Calendar from "react-calendar";
import * as Toast from '@radix-ui/react-toast';


export default function AccCard({
  finance,
  user,
  timerRef,
  open,
  setOpen,
  fetcher,
}) {
  return (
    <>
      <div className="px-2 border-1 border-black">
        <h2>Accessories</h2>
        <div className="flex flex-wrap justify-center">

          <div className="flex-grow h-full w-full ">
            <fetcher.Form method="post"   >
              <Input type="hidden" defaultValue={user.name} name="author" />
              <Input type="hidden" defaultValue={finance.id} name="id" />
              <Input type="hidden" defaultValue="updateFinance" name="intent" />
              <div className=" py-1 lg:pt-1 pt-1 items-center">

                <div className=" flex items-center justify-between">
                  <label className="text-sm text-left text-slate1" htmlFor='partsonorder'>Accessories On Order</label>
                  <p className="text-sm text-right text-slate1"></p>
                </div>
                <hr className="mt-1 mb-1 border-b-1 border-gray-600" />
              </div>

              <div className="flex justify-end">
                <Input type="hidden" defaultValue={user.name} name="author" />
                <Input type="hidden" defaultValue={finance.id} name="id" />
                <Input type="hidden" defaultValue="updateFinance" name="intent" />



              </div>

            </fetcher.Form>
          </div>

        </div>
      </div>

    </>
  )
}
