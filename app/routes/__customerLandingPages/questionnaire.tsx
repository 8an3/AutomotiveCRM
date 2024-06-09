import { LinksFunction } from "@remix-run/node";
import { Input } from "~/components";
import { json } from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { Outlet } from "@remix-run/react";

export default function DealerCompleted() {
  return (
    <div className="bg-white my-auto mx-auto font-sans   text-black h-[100vh] ">
      <Outlet />
    </div>
  );
}
export async function loader() {
  return null
}
